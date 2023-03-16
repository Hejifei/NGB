// index.ts
// 获取应用实例
const app = getApp<IAppOption>()

import { writeAndReadBLECharacteristicValue } from "../../../utils/bluetooth_util"
import { parse10To16, parseProtocolCodeMessage } from "../../../utils/protocol_util"
import {
    ab2hex,
    writeUTF,
    ab2str,
 } from "../../../utils/util"

Page({
    data: {
        text: undefined,
    },
    onShow() {
        wx.onBLECharacteristicValueChange(res => {
            console.log({
                res,
            })
            const value = ab2hex(res.value)
            console.log({
                res,
                value,
            }, '收到数据 onBLECharacteristicValueChange -------')
        })
        const buffer = writeUTF('我是何继飞');
        console.log({
            buffer,
            // text: readUTF(buffer),
        })
        console.log({
            xxx: ab2str(buffer)
        })
    },
    confirmUpload() {
        console.log({
            text: this.data.text,
        })
        const {
            deviceId,
            serviceId,
            characteristicId,
        } = app.globalData
        if (!deviceId || !serviceId || !characteristicId) {
            return
        }
        if (!this.data.text) {
            return
        }
        const textBuffer = writeUTF(this.data.text)
        // const buffer = parseProtocolCodeMessage(
        //     textBuffer.length,
        //     'F5',
        //     textBuffer.join('')
        // )
        const buffer = [
            parse10To16(textBuffer.length),
            'F5',
            ...textBuffer,
            'CRC16_H',
            'CRC16_L',
        ]
        console.log({
            textBuffer,
            buffer,
        }, '获取常规信息')
        try {
            writeAndReadBLECharacteristicValue(
                deviceId,
                serviceId,
                characteristicId,
                buffer,
            )
        } catch (err) {
            console.log('getBaseInfo error: ', {err})
        }
    }
})
