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
        // const value = ab2hex('0501032050')
        // console.log('before', {value})
        // var gb2312 = iconv.encode("要转换的字符串", 'gb2312');
        // var gb2312 = encodeURIComponentNew("你好").replaceAll("%", "")
        // const value = '你好'
        // var gb2312 = TextCodec("GB2312","long", '你好')
        // console.log({
        //     // value,
        //     gb2312,
        // })
        // console.log({
        //     gb2312
        // })
        // // const buffer = writeUTF('我是何继飞');
        // const value = gb2312
        // const valueLength = getLength(value)
        // const buffer = `${parse10To16(valueLength)}06${value}CRC16_HCRC16_L`
        // console.log({
        //     buffer,
        //     // text: readUTF(buffer),
        // })
    },
    confirmUpload() {
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
        
        if (!this.data.text) {
            return
        }
        const value = this.data.text || ''
        const valueLength = getLength(value)
        var gb2312 = TextCodec("GB2312","long",value)
        const dataString = parseProtocolCodeMessage(
            parse10To16(valueLength + 4),
            'b1',
            gb2312,
            // nickName.split('').map((item: string) => item.charCodeAt().toString(16)).join(''),
        )
        console.log({
            dataString,
        })
        
        
        // const valueString = `${parse10To16(valueLength)}06${gb2312}`
        // const myBuffer = array2Buffer(gb2312)
        console.log({
            value,
            gb2312,
            // valueString,
            // myBuffer,
        })
        
        // const buffer = '0501032050'
        // const buffer = new ArrayBuffer(value.length)
        // const dataView = new Uint8Array(buffer)
        // for (let i = 0; i < value.length; i++) {
        //     console.log({
        //         i,
        //         charCode: value.charCodeAt(i),
        //     })
        //     dataView[i] = value.charCodeAt(i)
        // }
        // const dataList = [
        //     '0x05',
        //     '0x01',
        //     '0x03',
        //     '0x20'
        //     '0x50',
        // ]
        // const buffer = new ArrayBuffer(dataList.length)
        // const dataView = new Uint8Array(buffer)
        // for (let i = 0; i < dataList.length; i++) {
        //     console.log({
        //         i,
        //         charCode: dataList[i],
        //     })
        //     dataView[i] = dataList[i]
        // }
        console.log({
            dataString,
        }, '写')
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
    }
})
