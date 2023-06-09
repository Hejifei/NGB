import {
  getHistoryDevices,
  inArray,
  setHistoryDevices,
} from "../../utils/util";
import { Request } from "../../utils/request";
import Dialog from "@vant/weapp/dialog/dialog";
import {
  bluetoothInit,
  getBluetoothAdapterState,
  startBluetoothDevicesDiscovery,
  stopBluetoothDevicesDiscovery,
  getBluetoothDevices,
  createBLEConnection,
  getBLEDeviceServices,
  getBLEDeviceCharacteristics,
  notifyBLECharacteristicValueChange,
  closeBLEConnection,
  writeAndReadBLECharacteristicValue,
} from "../../utils/bluetooth_util";
import { TextCodec } from "../../utils/utf8ToGb2312";
// import Toast from '@vant/weapp/toast/toast';
const app = getApp<IAppOption>();

Page({
  data: {
    barhHeight: 0,
    titlePositionTop: 0,
    name: "",
    connected: false,
    deviceList: [],
    descList: [
      "请确认设备已开启",
      "请确认手机蓝牙已开启",
    ],
    chs: [],
    _discoveryStarted: false, //  是否开始扫描
    // deviceId: undefined, // 已连接蓝牙id
  },
  onLoad() {
    console.log("onLoad");
    // console.log(ModBusCRC16('55590A293000'))
  },
  onShow() {
    console.log("onShow");
  },
  onUnload() {
    // 停止扫描
    stopBluetoothDevicesDiscovery();
    // this.closeBluetoothAdapter()
  },
  onReady() {
    this.setData({
      connected: app.globalData.deviceId || false,
      name: app.globalData.deviceName,
    });
    if (this.data.connected && app.globalData.deviceName && app.globalData.deviceId) {
        this.setData({
            deviceList: [{
                name: app.globalData.deviceName,
                deviceId: app.globalData.deviceId,  
            }]
        })
    }
    const that = this;
    wx.getSystemInfo({
      success(res) {
        const { windowHeight, screenHeight, statusBarHeight } = res;
        const barhHeight = screenHeight - windowHeight;
        let menu = wx.getMenuButtonBoundingClientRect();
        let navBarHeight = menu.height + (menu.top - statusBarHeight) * 2;
        const navTopHeight = statusBarHeight + navBarHeight / 2 - 12;
        that.setData({
          barhHeight,
          titlePositionTop: navTopHeight,
        });
      },
    });

    //  开始扫描
    this.openBluetoothAdapter();

  },
  async openBluetoothAdapter() {
    wx.showLoading({
        title: '扫描中',
    })
    // wx.showToast({
    //     title: "",
    //     icon: "loading",
    //     mask: true,
    //     duration: 2000,
    // });
    const that = this;
    const failWhenBluetootoOpenCallback = () => {
      that.startBluetoothDevicesDiscovery();
    };
    try {
    //   await bluetoothClose()
      await bluetoothInit(failWhenBluetootoOpenCallback);
      that.startBluetoothDevicesDiscovery();
    } catch (err) {
      // console.log({err})
      // Toast.fail(err.errMsg);
      wx.hideLoading()
      wx.showToast({
        title: err.errMsg,
        icon: "error",
        duration: 2000,
      });
    }
  },
  getBluetoothAdapterState() {
    const that = this;
    getBluetoothAdapterState().then((res: any) => {
        console.log({
            res,
        }, 'getBluetoothAdapterState')
      if (res.discovering) {
        that.onBluetoothDeviceFound();
      } else if (res.available) {
        that.startBluetoothDevicesDiscovery();
      }
    });
  },
  async startBluetoothDevicesDiscovery() {
    if (this.data._discoveryStarted) {
      return;
    }
    this.setData({
      _discoveryStarted: true,
    });
    try {
      await startBluetoothDevicesDiscovery();
      this.onBluetoothDeviceFound();
    } catch (err) {
      // console.log({err})
      // Toast.fail(err.errMsg);
      wx.hideLoading()
      this.setData({
        _discoveryStarted: false,
      });
      stopBluetoothDevicesDiscovery()
      wx.showToast({
        title: err.errMsg.split(':').splice(1).join(','),
        icon: "error",
        duration: 2000,
      });
    }
  },
  async onBluetoothDeviceFound() {
    const historyDeviceList = await getHistoryDevices();
    const deviceMap = {}
    // historyDeviceList.forEach(item => {
    //     if (item.nickName) {
    //         deviceMap[item.deviceId] = item.nickName
    //     }
    // })
    wx.onBluetoothDeviceFound((res) => {
        // console.log({
        //     res,
        // })
        
        res.devices
            .forEach((device) => {
            if (!device.name && !device.localName) {
                return;
            }
            if (deviceMap[device.deviceId]) {
                device.nickName = deviceMap[device.deviceId]
            }
            const foundDevices = this.data.deviceList;
            const newDeviceList = [...foundDevices];
            const idx = inArray(foundDevices, "deviceId", device.deviceId);
            if (idx === -1) {
                //  @ts-ignore
                newDeviceList.push(device);
            } else {
                //  @ts-ignore
                newDeviceList[idx] = device;
            }
            newDeviceList.sort((deviceA, deviceB) => {
                return deviceB.RSSI - deviceA.RSSI
            })
            console.log({
                newDeviceList,
            })
            this.setData({
                deviceList: [...newDeviceList],
            });
            });
      })
      setTimeout(() => {
        wx.hideLoading()
        stopBluetoothDevicesDiscovery()
        this.setData({
            _discoveryStarted: false,
        });
      }, 10 * 1000)
  },
  async closeBLEConnection() {
    const { deviceId } = app.globalData;
    if (!deviceId) {
      return;
    }
    getApp().globalData.connected = false;
    getApp().globalData.deviceName = undefined;
    getApp().globalData.deviceId = undefined;
    getApp().globalData.serviceId = undefined;
    getApp().globalData.characteristicId = undefined;
    this.setData({
      connected: false,
      name: "",
    });
    // Toast.success('蓝牙已断开!');
    await closeBLEConnection(deviceId);
    wx.showToast({
        title: "蓝牙已断开!",
        icon: "success",
        duration: 2000,
      });
  },
  async createBLEConnection(e: any) {
    const that = this;
    // wx.showToast({
    //   title: "",
    //   icon: "loading",
    //   mask: true,
    //   duration: 2000,
    // });
    wx.showLoading({
        title: '连接中',
    })
    // console.log('建立蓝牙连接')
    const ds = e.currentTarget.dataset;
    const deviceId = ds.deviceId;
    const name = ds.name;
    const id = ds.deviceId;
    // console.log({
    //     e,
    //     id,
    //     connected: this.data.connected,
    // })
    if (id === this.data.connected) {
        wx.hideLoading()
      Dialog.confirm({
        title: "断开连接?",
        message: "此操作将断开您与以下设备的连接:" + name,
      })
        .then(() => {
          that.closeBLEConnection();
        })
        .catch(() => {
          // console.log('error')
          // on cancel
        });
      return;
    }
    const deviceInfo: IHistoryDeviceItem = {
      name,
      deviceId,
    };
    try {
      await createBLEConnection(deviceId);
      const { services } = await getBLEDeviceServices(deviceId);
      console.log({
        services,
      })
      for (let i = 0; i < services.length; i++) {
        // for (let i = 0; i < services.length; i++) {
        if (services[i].isPrimary) {
          const serviceId = services[i].uuid;
          const { characteristics } = await getBLEDeviceCharacteristics(
            deviceId,
            serviceId
          );
          console.log({
            services: services[i],
            serviceId: services[i].uuid,
            characteristics,
            characteristicsList: characteristics.map(item => ({
                properties: item.properties,
                id: item.uuid,
            }))
          }, 'getBLEDeviceCharacteristics')
          for (let j = 0; j < characteristics.length; j++) {
            let item = characteristics[j];
            const characteristicId = item.uuid;
            // console.log({
            //     characteristicId,
            //     notify: item.properties.notify,
            // })
            if ((item.properties.notify || item.properties.indicate) && characteristicId.toLocaleLowerCase() === '0000ae02-0000-1000-8000-00805f9b34fb') {
                // console.log({
                //     characteristicId,
                //     if: characteristicId.toLocaleLowerCase() !== '0000ae02-0000-1000-8000-00805f9b34fb',
                // })
              await notifyBLECharacteristicValueChange(
                deviceId,
                serviceId,
                characteristicId
              );
              deviceInfo.notify = {
                serviceId,
                characteristicId,
              };
              getApp().globalData.deviceNotify = {
                serviceId,
                characteristicId,
              };
              console.log('启用蓝牙notify功能', {
                  deviceId, serviceId, characteristicId
              })
            }
            
            if (item.properties.write && characteristicId.toLocaleLowerCase() === '0000ae3b-0000-1000-8000-00805f9b34fb') {
              getApp().globalData.connected = true;
              getApp().globalData.deviceId = deviceId;
              getApp().globalData.serviceId = serviceId;
              getApp().globalData.characteristicId = characteristicId;
              getApp().globalData.deviceWrite = {
                serviceId,
                characteristicId,
              };
              deviceInfo.write = {
                serviceId,
                characteristicId,
              };
              console.log('启用write功能',{
                  deviceId,
                  serviceId,
                  characteristicId,
              }, '')
              // setTimeout(() => {
              //     writeAndReadBLECharacteristicValue(
              //         deviceId,
              //         serviceId,
              //         characteristicId,
              //         '5559011E000071E9'
              //     )
              // }, 10000);
            }
          }
        }
      }
      // console.log({
      //     services,
      // })
      const deviceHistory = await getHistoryDevices();
      if (!deviceHistory.filter((item) => item.deviceId === deviceId).length) {
        deviceHistory.push(deviceInfo);
      }
      setHistoryDevices(deviceHistory);
      this.setData({
        connected: deviceId,
        name,
        deviceId,
      });
      getApp().globalData.deviceName = name;
    //   this.uploadConnectRecord(name);
      wx.hideLoading()
      console.log('蓝牙连接成功!')
      // Toast.success('设备连接成功!');
      wx.showToast({
        title: "蓝牙已连接!",
        icon: "success",
        duration: 2000,
      });

    //   if (true) {
    //     setTimeout(() => {
    //         const {
    //         deviceId,
    //         // serviceId,
    //         // characteristicId,
    //         deviceWrite = {},
    //         deviceNotify = {},
    //     } = app.globalData
    //     const {
    //         serviceId,
    //         characteristicId,
    //     } = deviceWrite
    //     const {
    //         serviceId: serviceIdNotify,
    //         characteristicId: characteristicIdNotify,
    //     } = deviceNotify
    //     console.log({
    //         deviceWrite,
    //         deviceNotify,
    //     })
    //     const value = '电视机'
    //     var gb2312 = TextCodec("GB2312","long",value)
    //     console.log({
    //         value,
    //         gb2312,
    //     })
    //     // const buffer = `${parse10To16(valueLength)}06${gb2312}CRC_HCRC_L`
    //     // const buffer = 'gb2312'
    //     const buffer = '0501032050'
    //     console.log('write before')
    //     writeAndReadBLECharacteristicValue(
    //         deviceId,
    //         serviceId,
    //         characteristicId,
    //         serviceIdNotify,
    //         characteristicIdNotify,
    //         buffer,
    //     )
    //     console.log('write after')
    //     }, 2000);
    //   }
    } catch (err) {
      // console.log({err}, '蓝牙连接失败')
      // Toast.fail(err.errMsg);
      wx.hideLoading()
      wx.showToast({
        title: err.errMsg,
        icon: "error",
        duration: 2000,
      });
    }

    // stopBluetoothDevicesDiscovery()
  },
  //  记录设备连接记录
  uploadConnectRecord(title: string) {
    Request({
      url: "/api/user/connect",
      data: {
        title,
      },
      method: "POST",
      successCallBack: (res: any) => {
        console.log({ res }, "/api/user/connect");
      },
    });
  },
  closeBluetoothAdapter() {
    // bluetoothClose()
    this.setData({
      _discoveryStarted: false,
    });
  },
});
