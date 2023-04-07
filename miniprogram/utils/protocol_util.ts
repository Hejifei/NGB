import {ModBusCRC16} from './crc'
import {
    isString,
} from './lodash'
import moment from 'moment'

// 起始码、指令码、字节长度、起始地址、数据(写指令有效，读指令/擦除指令省略)、校验码组成。

//  生成报文
export const parseProtocolCodeMessage = (
    byteLength: string,  //  子节长度
    directCode: string,  //  指令码
//   startByteAddress: string,  //  起始地址
  data: string,  //  数据(写指令有效，读指令/擦除指令省略)
) => {
  const frontCode = [
    byteLength,
    directCode,
    data
  ].join('')
  //  校验码
  const checkCode = ModBusCRC16(frontCode)
//   const checkCode = 'CRC_HCRC_L'
  return [
    frontCode,
    checkCode,
  ].join('')
}

// 解析报文
export const analyzeProtocolCodeMessage = (
  codeMessage: string,
  fontBaseCode: string, //  除了起始码之外的固定码,

) => {
  const baseFrontCode = [
    fontBaseCode,
  ].join('')
  return codeMessage.substring(baseFrontCode.length, codeMessage.length - 4)
}


// ArrayBuffer转16进度字符串示例
export const ab2hex = (buffer: Buffer) => {
    var hexArr = Array.prototype.map.call(
      new Uint8Array(buffer),
      function (bit) {
        return ('00' + bit.toString(16)).slice(-2)
      }
    )
    return hexArr.join('');
}

//  16进制转10进制
export const parse16To10 = (value: string) => {
    return parseInt(value, 16)
}

const fillText = (str: string, length: number, fillText: string = '0') => {
    str = (new Array(length)).fill(fillText).join(fillText) + str;
    return str.substring(str.length - length, str.length);
}

//  10进制转16进制
export const parse10To16 = (value: number | string, byteLength: number = 1) => {
    let value16 = (isString(value) ? parseInt(value) : value).toString(16)
    if (byteLength) {
        const newVlaueLength = byteLength * 2
        return fillText(value16, newVlaueLength, '0')
    }
    return value16
}


