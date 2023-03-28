import {
  bluetoothInit,
  getBluetoothAdapterState,
} from "./utils/bluetooth_util";

// app.ts
App<IAppOption>({
  globalData: {
    userInfo: undefined,
    isDebugModel: false,
    // isDebugModel: true,
    connected: false,
    reConnectedTimes: 0,    //  蓝牙断开重连次数
    deviceName: undefined,
    deviceId: undefined,
    serviceId: undefined,
    characteristicId: undefined,
    deviceNotify: undefined,
    deviceWrite: undefined,
  },
  onLaunch() {
    // 展示本地存储能力
    // const logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // // 登录
    // wx.login({
    //   success: res => {
    //     console.log(res.code)
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   },
    // })

    getBluetoothAdapterState()
      .then((res) => {
        console.log("蓝牙可用");
      })
      .catch((res) => {
        console.log("蓝牙不可用");
      });

    bluetoothInit()
      .then((res) => {
        console.log("蓝牙初始化成功!");
        // console.log({
        //     success:res
        // })
      })
      .catch((res) => {
        console.log({ res }, "蓝牙初始化异常!");
      });

    const listenConnection = () => {
      console.log("listenConnection");
      wx.onBLEConnectionStateChange((res) => {
        console.log("connectState", { res });
        //   this.globalData.connected = res.connected
        if (res.connected) {
            this.globalData.reConnectedTimes = 0
          // Toast.success('连接成功!');
          // that.showToast({
          //   title: "连接成功",
          // })
        } else {
          if (this.globalData.deviceId && this.globalData.reConnectedTimes <= 5) {
            this.globalData.reConnectedTimes = this.globalData.reConnectedTimes + 1
            const deviceId = this.globalData.deviceId;
            console.log({
              deviceId,
            });
            // bluetoothInit()
            wx.createBLEConnection({
              deviceId,
              success(res) {
                //   console.log(res)
                console.log("蓝牙重连成功!");
              },
            });
          } else if (this.globalData.deviceId && this.globalData.reConnectedTimes > 5) {
            // 重连5次仍然失败,断开连接,给出提示
            this.globalData = {
                ...this.globalData,
                connected: false,
                reConnectedTimes: 0,
                deviceName: undefined,
                deviceId: undefined,
                serviceId: undefined,
                characteristicId: undefined,
            }
            wx.showToast({
                title: '蓝牙连接已断开',
                icon: "none",
                duration: 3000
            });

          }

          // this.globalData = {
          //     ...this.globalData,
          //     deviceName: undefined,
          //     deviceId: undefined,
          //     serviceId: undefined,
          //     characteristicId: undefined,
          // }
          // Toast.fail('连接断开')
          // that.showToast({
          //   title: "连接断开",
          // })
        }
      });
    };
    listenConnection();
  },
})