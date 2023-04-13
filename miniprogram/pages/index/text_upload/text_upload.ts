// index.ts
// 获取应用实例
const app = getApp<IAppOption>()

import { writeAndReadBLECharacteristicValue } from "../../../utils/bluetooth_util"
import { parse10To16, parseProtocolCodeMessage } from "../../../utils/protocol_util"
import {
    ab2hex,
    writeUTF,
    ab2str,
    getLength,
    string2Buffer,
    encodeURIComponentNew,
    array2Buffer,
 } from "../../../utils/util"
 import {TextCodec} from '../../../utils/utf8ToGb2312'
// import {encode} from 'iconv-lite'
// var iconv = require('iconv-lite');

Page({
    data: {
        text: undefined,
        myModalVisible: false,
        model_type: '',
        title: '',
        content: '',
    },
    onShow() {
        wx.onBLECharacteristicValueChange(res => {
            // console.log({
            //     res,
            // })
            const value = ab2hex(res.value)
            if (value === '07a100000173fc') {
                return
            }
            console.log({
                res,
                value,
            }, '收到数据 onBLECharacteristicValueChange -------')
        })
        
    },
    handleConfirm() {
        this.setData({
            myModalVisible: false,
            model_type: '',
            title: '',
            content: '',
        })
    },
    async confirmUpload() {
        console.log({
            text: this.data.text,
        })
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
        if (!deviceId || !serviceId || !characteristicId || !serviceIdNotify || !characteristicIdNotify) {
            return
        }
        
        if (!this.data.text) {
            wx.showToast({ title: '请输入文字!', icon: 'none' });
            return
        }
        this.setData({
            myModalVisible: true,
            model_type: 'waiting',
            title: '上传中...',
            content: '请保持设备和手机蓝牙处于开启状态',
        })
        const value = this.data.text || ''
        const valueLength = getLength(value)
        var gb2312 = TextCodec("GB2312","long",value)

        let str = gb2312
        const len = str.length / 32;
        const strList = []
        for(let i = 0;i < len; i++) {
            const x = str.substring(0,32)
            strList.push(x)
            str = str.substring(32)
        }

        console.log({
            
            gb2312,
            valueLength,
            strList,
        })

        for (let i = 0; i < strList.length; i++) {
            const itemStr = strList[i]
            const dataString = parseProtocolCodeMessage(
                parse10To16(itemStr.length / 2 + 4),
                'b' + (i + 1),
                itemStr,
                // nickName.split('').map((item: string) => item.charCodeAt().toString(16)).join(''),
            )
            console.log({
                // itemStrLength: itemStr.length / 2,
                itemStr,
                dataString,
            }, '写')
            
            try {
                await writeAndReadBLECharacteristicValue(
                    deviceId,
                    serviceId,
                    characteristicId,
                    serviceIdNotify,
                    characteristicIdNotify,
                    dataString,
                )
                if (i === (strList.length - 1)) {
                    this.setData({
                        myModalVisible: true,
                        model_type: 'success',
                        title: '上传成功',
                        content: '',
                    })

                }
            } catch (err) {
                console.log('getBaseInfo error: ', {err})
                this.setData({
                    myModalVisible: true,
                    model_type: 'error',
                    title: '上传失败,请重新上传',
                    content: err.errMsg,
                })
            }
        }
        
    }
})
