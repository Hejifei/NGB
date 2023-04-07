import WeCropper from '@we-cropper/index.js'
import { writeAndReadBLECharacteristicValue } from '../../../utils/bluetooth_util';
import { parse10To16, parseProtocolCodeMessage } from '../../../utils/protocol_util';
import { base64ToHex } from '../../../utils/util';
// 获取应用实例
const app = getApp<IAppOption>()

Page({
    data: {
        src: '',
        width: 128,//宽度
        height: 128,//高度
        imgCropperVisible: false,
        fileList: [],
        imgBase64Str: '',
    },
    onLoad: function (options) {
        //获取到image-cropper实例
        this.cropper = this.selectComponent("#image-cropper");
        //开始裁剪
        // this.setData({
        //     src:"../../../assets/imgs/demo2.jpg",
        // });
        // wx.showLoading({
        //     title: '加载中'
        // })

    },
    onShow() {
        // const query = wx.createSelectorQuery()
        // query.select('.canvasItem')
        // .fields({node: true, size: true})
        // .exec(res => {
        //     console.log({
        //         res,
        //     })
        //     const canvas = res[0].node;
        //     const ctx = canvas.getContext('2d')
        //     console.log({
        //         ctx,
        //     })
        // })

    },
    cropperload(e) {
        console.log("cropper初始化完成");
    },
    loadimage(e) {
        console.log("图片加载完成", e.detail);
        // wx.hideLoading();
        //重置图片角度、缩放、位置
        // this.cropper.imgReset();
    },
    grayPixle(pix: number[]) {
        return pix[0] * 0.299 + pix[1] * 0.587 + pix[2] * 0.114;
    },
    /**
     * overwriteImageData
     * @param {object} data
     * {
                width,//图片宽度
                height,//图片高度
                imageData,//Uint8ClampedArray
                threshold,//阈值
        }
     */
    overwriteImageData(data: {
        width: number
        height: number
        data: number[]
        threshold: number
    }) {
        let sendWidth = data.width,
            sendHeight = data.height;
        const threshold = data.threshold || 180;
        let sendImageData = new ArrayBuffer((sendWidth * sendHeight) / 8);
        sendImageData = new Uint8Array(sendImageData);
        let pix = data.data;
        const part = [];
        let index = 0;
        for (let i = 0; i < pix.length; i += 32) {
            //横向每8个像素点组成一个字节（8位二进制数）。
            for (let k = 0; k < 8; k++) {
                const grayPixle1 = this.grayPixle(pix.slice(i + k * 4, i + k * 4 + (4 - 1)));
                //阈值调整
                if (grayPixle1 > threshold) {
                    //灰度值大于threshold位   白色 为第k位0不打印
                    part[k] = 0;
                } else {
                    part[k] = 1;
                }
            }
            let temp = 0;
            for (let a = 0; a < part.length; a++) {
                temp += part[a] * Math.pow(2, part.length - 1 - a);
            }
            //开始不明白以下算法什么意思，了解了字节才知道，一个字节是8位的二进制数，part这个数组存的0和1就是二进制的0和1，传输到打印的位图数据的一个字节是0-255之间的十进制数，以下是用权相加法转十进制数，理解了这个就用上面的for循环替代了
            // const temp =
            //     part[0] * 128 +
            //     part[1] * 64 +
            //     part[2] * 32 +
            //     part[3] * 16 +
            //     part[4] * 8 +
            //     part[5] * 4 +
            //     part[6] * 2 +
            //     part[7] * 1;
            sendImageData[index++] = temp;
        }
        return {
            array: Array.from(sendImageData),
            width: sendWidth / 8,
            height: sendHeight,
        };
    },
    /**
     * sendDataToDevice
     * @param {object} options
     * {
                deviceId,
                serviceId,
                characteristicId,
                value [ArrayBuffer],
                lasterSuccess,
        }
    */
    async sendDataToDevice(options: {
        value: [ArrayBuffer],
        lasterSuccess: boolean,
    }) {
        const {
            deviceId,
            // serviceId,
            // characteristicId,
            deviceWrite = {},
            deviceNotify = {},
        } = app.globalData
        const {
            serviceId,
            characteristicId,
        } = deviceWrite
        const {
            serviceId: serviceIdNotify,
            characteristicId: characteristicIdNotify,
        } = deviceNotify
        console.log({
            dataString,
        }, '写')
        if (!deviceId || !serviceId || !characteristicId || !serviceIdNotify || !characteristicIdNotify) {
            return
        }
        let byteLength = options.value.byteLength;
        //这里默认一次20个字节发送
        const speed = 16;
        if (byteLength > 0) {
            try {
                const value = options.value.slice(0, byteLength > speed ? speed : byteLength)
                const dataString = parseProtocolCodeMessage(
                    parse10To16(value + 4),
                    'f5',
                    value.map((item: string) => item.toString(16)).join(''),
                    // nickName.split('').map((item: string) => item.charCodeAt().toString(16)).join(''),
                )
                console.log({
                    value,
                    dataString,
                })

                await writeAndReadBLECharacteristicValue(
                    deviceId,
                    serviceId,
                    characteristicId,
                    serviceIdNotify,
                    characteristicIdNotify,
                    dataString,
                )
                if (byteLength > speed) {
                    this.sendDataToDevice({
                        value: options.value.slice(speed, byteLength),
                    });
                } else {
                    options.lasterSuccess && options.lasterSuccess();
                }
            } catch (err) {
                console.log('getBaseInfo error: ', { err })
            }
        }
    },
    clickcut(e) {
        console.log({
            e,
            detail: e.detail
        });
        const url = e.detail.url;
        const query = wx.createSelectorQuery()
        query.select('.canvasItem')
            .fields({ node: true, size: true })
            .exec(res => {
                console.log({
                    res,
                })
                const canvas = res[0].node;
                const ctx = canvas.getContext('2d')
                console.log({
                    ctx,
                })
                console.log({ url });
                const img = canvas.createImage()
                img.src = url
                img.onload = () => {
                    const width = 128;
                    const height = 128;
                    canvas.width = width
                    canvas.height = height
                    ctx.drawImage(img, 0, 0, width, height)
                    const dataUrl = canvas.toDataURL();
                    this.setData({
                        imgBase64Str: dataUrl,
                    })
                    console.log({
                        dataUrl,
                    })

                    const smallImg = canvas.createImage()
                    smallImg.src = dataUrl
                    smallImg.onload = () => {
                        ctx.clearRect(0, 0, 128, 128);
                        ctx.height = 128;
                        ctx.width = 128;
                        ctx.drawImage(smallImg, 0, 0);
                        const myImageData = ctx.getImageData(0, 0, 128, 128);
                        console.log('myImageData', myImageData);
                        const rgb565ImageData = ctx.createImageData(128, 128);
                        for (let i = 0; i < 128; i++) {
                            for (let j = 0; j < 128; j++) {
                                const index = ((j * (myImageData.width * 4)) + (i * 4));
                                const r = myImageData.data[index];
                                const g = myImageData.data[index + 1];
                                const b = myImageData.data[index + 2];
                                const a = myImageData.data[index + 3];
                                rgb565ImageData.data[index] = r >> 3 << 3;
                                rgb565ImageData.data[index + 1] = g >> 2 << 2;
                                rgb565ImageData.data[index + 2] = b >> 3 << 3;
                                rgb565ImageData.data[index + 3] = a;
                            }
                        }
                        console.log({ rgb565ImageData })
                        ctx.putImageData(rgb565ImageData, 0, 0);
                        const dataUrl = canvas.toDataURL();
                        const base64 = dataUrl.replace(/^data:image\/\w+;base64,/, "");
                        let arrayBuffer = wx.base64ToArrayBuffer(base64);
                        console.log({
                            dataUrl,
                            arrayBuffer,
                            base64ToHex: base64ToHex(dataUrl),
                            overwriteImageData: this.overwriteImageData(rgb565ImageData)
                        })

                        // wx.canvasGetImageData({
                        //     canvasId: 'canvas',
                        //     x: 0,
                        //     y: 0,
                        //     width: 128,
                        //     height: 128,
                        //     success(res) {
                        //       console.log(res)
                        //     //   console.log(res.height) // 100
                        //     //   console.log(res.data instanceof Uint8ClampedArray) // true
                        //     //   console.log(res.data.length) // 100 * 100 * 4
                        //     }
                        //   })

                        this.setData({
                            imgBase64Str: dataUrl,
                        })

                        const fileList = this.data.fileList
                        //  @ts-ignore
                        this.setData({
                            fileList: [
                                {
                                    ...fileList[0],
                                    // url: e.detail.url,
                                    // thumb: e.detail.url,
                                    url: dataUrl,
                                    thumb: dataUrl,
                                }
                            ],
                            // src: e.detail.url,
                            src: dataUrl,
                            imgCropperVisible: false,
                        }, () => {
                            console.log({
                                fileList: this.data.fileList,
                            })
                        });
                    }


                }

                // imageEl.src = url;

                // const img = new Image();
                // img.src=url;
                // img.onload = () => {



                // }
            })

        //点击裁剪框阅览图片
        // wx.previewImage({
        //     current: e.detail.url, // 当前显示图片的http链接
        //     urls: [e.detail.url] // 需要预览的图片http链接列表
        // })

    },
    handlePreview(e) {
        console.log({ e })
        wx.previewImage({
            current: e.detail.url, // 当前显示图片的http链接
            urls: [e.detail.url] // 需要预览的图片http链接列表
        })
    },
    produceImg() {
        this.setData({

        })
        console.log({
            imgCropperVisible: false,
        })
    },
    afterRead(event) {
        const { file } = event.detail;
        // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
        this.setData({
            fileList: [
                { ...file, }
            ],
            src: file.url,
            imgCropperVisible: true,
        });
        console.log({
            event,
        })
        // wx.uploadFile({
        //   url: 'https://example.weixin.qq.com/upload', // 仅为示例，非真实的接口地址
        //   filePath: file.url,
        //   name: 'file',
        //   formData: { user: 'test' },
        //   success(res) {
        //     // 上传完成需要更新 fileList
        //     const { fileList = [] } = this.data;
        //     fileList.push({ ...file, url: res.data });
        //     this.setData({ fileList });
        //   },
        // });
    },
    handleDelte(event) {
        // const index = event.detail.index
        console.log({
            event,
        })
        this.setData({
            fileList: []
        })
    },
    //   onShow() {

    //     },
    confirmUpload() {
        const {
            deviceId,
            // serviceId,
            // characteristicId,
            deviceWrite = {},
            deviceNotify = {},
        } = app.globalData
        const {
            serviceId,
            characteristicId,
        } = deviceWrite
        const {
            serviceId: serviceIdNotify,
            characteristicId: characteristicIdNotify,
        } = deviceNotify
        const dataString = parseProtocolCodeMessage(
            parse10To16(5),
            'f1',
            parse10To16(0),
        )
        console.log({
            dataString,
        }, '图片信息指令 写')
        if (!deviceId || !serviceId || !characteristicId || !serviceIdNotify || !characteristicIdNotify) {
            return
        }
        try {
            writeAndReadBLECharacteristicValue(
                deviceId,
                serviceId,
                characteristicId,
                serviceIdNotify,
                characteristicIdNotify,
                dataString,
            )
        } catch (err) {
            console.log('getBaseInfo error: ', {err})
        }
        const dataStringWriteImg = parseProtocolCodeMessage(
            parse10To16(8),
            'f5',
            '00000001',
        )
        console.log({
            dataStringWriteImg,
        }, '传送图片内容 写')
        try {
            writeAndReadBLECharacteristicValue(
                deviceId,
                serviceId,
                characteristicId,
                serviceIdNotify,
                characteristicIdNotify,
                dataStringWriteImg,
            )
        } catch (err) {
            console.log('getBaseInfo error: ', {err})
        }
    }
})
