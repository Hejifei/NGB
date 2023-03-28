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
        console.log('before')
        // var gb2312 = iconv.encode("要转换的字符串", 'gb2312');
        // var gb2312 = encodeURIComponentNew("你好").replaceAll("%", "")
        // const value = '你好'
        var gb2312 = TextCodec("GB2312","long", '你好')
        console.log({
            // value,
            gb2312,
        })
        console.log({
            gb2312
        })
        // const buffer = writeUTF('我是何继飞');
        const value = gb2312
        const valueLength = getLength(value)
        const buffer = `${parse10To16(valueLength)}06${value}CRC16_HCRC16_L`
        console.log({
            buffer,
            // text: readUTF(buffer),
        })
        console.log({
            xxx: string2Buffer(buffer),
            gb2312,
        })
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
        if (!deviceId || !serviceId || !characteristicId) {
            return
        }
        if (!this.data.text) {
            return
        }
        // var gb2312 = encodeURIComponentNew("你好").replaceAll("%", "")
        // console.log({
        //     gb2312
        // })
        // // const buffer = writeUTF('我是何继飞');
        // const value = gb2312
        // const valueLength = getLength(value)
        // const buffer = `${parse10To16(valueLength)}06${value}CRC16_HCRC16_L`
        const value = this.data.text || ''
        const valueLength = getLength(value)
        // var gb2312 = encodeURIComponentNew(value)
            // .replaceAll("%", "")
        var gb2312 = TextCodec("GB2312","long",value)
        console.log({
            value,
            gb2312,
        })
        const buffer = `${parse10To16(valueLength)}06${gb2312}CRC_HCRC_L`
        // const textBuffer = writeUTF(this.data.text)
        // const buffer = parseProtocolCodeMessage(
        //     textBuffer.length,
        //     'F5',
        //     textBuffer.join('')
        // )
        // const buffer = [
        //     parse10To16(textBuffer.length),
        //     'F5',
        //     ...textBuffer,
        //     'CRC16_H',
        //     'CRC16_L',
        // ]
        console.log({
            // textBuffer,
            buffer,
        }, '写')
        try {
            writeAndReadBLECharacteristicValue(
                deviceId,
                serviceId,
                characteristicId,
                serviceIdNotify,
                characteristicIdNotify,
                buffer,
            )
        } catch (err) {
            console.log('getBaseInfo error: ', {err})
        }
    }
})
