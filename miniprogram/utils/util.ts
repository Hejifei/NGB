import {LOCAL_STORAGE_KEY_HISTORY_DEVICES, REQUEST_URL} from '../common/index'

export const formatTime = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  )
}

const formatNumber = (n: number) => {
  const s = n.toString()
  return s[1] ? s : '0' + s
}

export const inArray = (arr: Record<string, any>, key: string, val: any) => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i][key] === val) {
        return i;
      }
    }
    return -1;
  }
  
  // ArrayBuffer转16进度字符串示例
export const ab2hex = (buffer: number) => {
    var hexArr = Array.prototype.map.call(
      new Uint8Array(buffer),
      function (bit) {
        return ('00' + bit.toString(16)).slice(-2)
      }
    )
    return hexArr.join('');
}


export const parseApiUrl = (url: string): string => {
    const api = REQUEST_URL
    return `${api}${url}`
}

export const getUserInfo: () => {
    city: string
    country: string
    gender: number
    headimgurl: string
    language: string
    nickname: string
    openid: string
    province: string
    token: string
    uid: number
    group_id: number
} = () => {
  return wx.getStorageSync('userInfo')
}

export const setUserInfo = (info: {
    city: string
    country: string
    gender: number
    headimgurl: string
    language: string
    nickname: string
    openid: string
    province: string
    token: string
    uid: number
    group_id: number
}) => {
  return wx.setStorageSync('userInfo', info)
}

export const getUserToken = () => {
  return wx.getStorageSync('token')
}

export const setUserToken = (token: string) => {
  return wx.setStorageSync('token', token)
}

//  是否调试模式
export const getIsDebugModel: () => boolean = () => {
    // todo 默认值修改
    return wx.getStorageSync('IS_DEBUG_MODEL') || false
}
export const setIsDebugModel = (value: boolean) => {
    return wx.setStorageSync('IS_DEBUG_MODEL', value)
}


//  历史设备记录
export const getHistoryDeviceList: () => object[] = () => {
    return wx.getStorageSync('history_device_list') || []
}
export const setHistoryDeviceList = (value: object[]) => {
    return wx.setStorageSync('history_device_list', value)
}

//  uint8Array 转 string
export const  uint8ArrayToString = (fileData: number[]) => {
  var dataString = "";
  for (var i = 0; i < fileData.length; i++) {
    dataString += String.fromCharCode(fileData[i]);
  }
  return dataString
}
// var arr = [48,48,48,48]
// uint8ArrayToString(arr)  //"0000"

//  string 装 uint8Array 
export const stringToUint8Array = (str: string) => {
  var arr = [];
  for (var i = 0, j = str.length; i < j; ++i) {
    arr.push(str.charCodeAt(i));
  }
 
  var tmpUint8Array = new Uint8Array(arr);
  return tmpUint8Array
}
// stringToUint8Array('12313132') // Uint8Array(8)   [49, 50, 51, 49, 51, 49, 51, 50]

//  string 转 ArrayBuffer
export const stringToArrayBuffer = (str: string) => {
  var buf = new ArrayBuffer(str.length * 2); // 每个字符占用2个字节
  var bufView = new Uint16Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}
// stringToArrayBuffer('00000')
// 输出：ArrayBuffer(10) {}

//  arrayBuffer 转 string
export const arrayBufferToString = (buf: ArrayBuffer) => {
  //  @ts-ignore
  return String.fromCharCode.apply(null, new Uint8Array(buf)).replaceAll('\x00', '');
}


//   int 转 byte []
export const intTobytes = (n: number) => {
  var bytes = [];
  for (var i = 0; i < 2; i++) {
    bytes[i] = n >> (8 - i * 8);
  }
  return bytes;
}
// intTobytes(10) // [0, 10]

export const stringToHex = (str: string) => {
  var val="";
  for(var i = 0; i < str.length; i++){
    if(val == "")
      val = str.charCodeAt(i).toString(16);
    else {
      val += "," + str.charCodeAt(i).toString(16);
    }
  }
  return val;
}

export const hexToString = (str: string) => {

  var val="";
  
  let arr = str.split(",");
  
  for(var i = 0; i < arr.length; i++){
  
    // val += arr[i].fromCharCode(i);
    // val += String.fromCharCode(arr[i]);
    var tmp = "0x" + arr[i * 2] + arr[i * 2 + 1]
    var charValue = String.fromCharCode(tmp);
    val += charValue
  }
  
  return val;
  
}


//  tools

/*
  16进制字符串转整形数组
*/
export const str2Bytes = (str) => {
    var len = str.length;
    if (len % 2 != 0) {
      return null;
    }
    var hexA = new Array();
    for (var i = 0; i < len; i += 2) {
      var s = str.substr(i, 2);
      var v = parseInt(s, 16);
      hexA.push(v);
    }
  
    return hexA;
  }
  
  /*
    整形数组转buffer
  */
export const array2Buffer = (arr) => {
    let buffer = new ArrayBuffer(arr.length)
    let dataView = new DataView(buffer)
    for (let i = 0; i < arr.length; i++) {
      dataView.setUint8(i, arr[i])
    }
  
    return buffer
  }
  
  /*
    16进制字符串转数组
  */
export const string2Buffer = (str: string) => {
    let arr = str2Bytes(str);
    return array2Buffer(arr)
  }
  
  /*
    ArrayBuffer转十六进制字符串
  */
  export const uint8Array2Str = (buffer) => {
    var str = "";
    let dataView = new DataView(buffer)
    for (let i = 0; i < dataView.byteLength; i++) {
      var tmp = dataView.getUint8(i).toString(16)
      if (tmp.length == 1) {
        tmp = "0" + tmp
      }
      str += tmp
    }
    return str;
  }
  

export const getHistoryDevices: () => Promise<IHistoryDeviceItem[]> = () => {
    return new Promise((resolve, reject) => {
        wx.getStorage({
            key: LOCAL_STORAGE_KEY_HISTORY_DEVICES,
            success (res) {
                // console.log({res}, 'getHistoryDevices')
                resolve(res.data || [])
            },
            fail(res) {
                console.log({res}, 'getHistoryDevices err')
                resolve([])
            }
        })
    })
}

export const setHistoryDevices = (deviceList: IHistoryDeviceItem[]) => {
    return new Promise((resolve, reject) => {
        wx.setStorage({
            key: LOCAL_STORAGE_KEY_HISTORY_DEVICES,
            data: deviceList,
            success (res) {
                console.log({res}, 'setHistoryDevices')
                resolve(res)
            }
        })
    })
}

// 将字符串格式化为UTF8编码的字节
export const writeUTF = (
    str: string,
    isGetBytes: boolean = true,
) => {
    var back = [];
    var byteSize = 0;
    for (var i = 0; i < str.length; i++) {
        var code = str.codePointAt(i);
        if (0x00 <= code && code <= 0x7f) {
              byteSize += 1;
              back.push(code);
        } else if (0x80 <= code && code <= 0x7ff) {
              byteSize += 2;
              back.push((192 | (31 & (code >> 6))));
              back.push((128 | (63 & code)))
        } else if ((0x800 <= code && code <= 0xd7ff) 
                || (0xe000 <= code && code <= 0xffff)) {
              byteSize += 3;
              back.push((224 | (15 & (code >> 12))));
              back.push((128 | (63 & (code >> 6))));
              back.push((128 | (63 & code)))
        }else if((0x10000 <= code && code <= 0x10ffff)){
            byteSize+=4;
          back.push(240 |(7 & (code>>18)));
          back.push(128 |(63 & (code>>12)));
          back.push(128 |(63 & (code>>6)));
          back.push(128 |(63 & (code)));
        }
     }
     for (i = 0; i < back.length; i++) {
          back[i] &= 0xff;
     }
     if (isGetBytes) {
          return back
     }
     if (byteSize <= 0xff) {
          return [0, byteSize].concat(back);
     } else {
          return [byteSize >> 8, byteSize & 0xff].concat(back);
      }
};

// 读取UTF8编码的字节，并专为Unicode的字符串
export const readUTF = (arr: any) => {
  if (typeof arr === 'string') {
      return arr;
  }
  var UTF = '', _arr = this.init(arr);
  for (var i = 0; i < _arr.length; i++) {
      var one = _arr[i].toString(2),
              v = one.match(/^1+?(?=0)/);
      if (v && one.length == 8) {
          var bytesLength = v[0].length;
          var store = _arr[i].toString(2).slice(7 - bytesLength);
          for (var st = 1; st < bytesLength; st++) {
              store += _arr[st + i].toString(2).slice(2)
          }
          UTF += String.fromCharCode(parseInt(store, 2));
          i += bytesLength - 1
      } else {
          UTF += String.fromCharCode(_arr[i])
      }
  }
  return UTF
}

export const ab2str = (buf) => {
        const bytes = new Uint8Array(buf)
       let text = ''
       for (let i = 0; i < bytes.length; i++) {
       text += '%' + bytes[i].toString(16)
       }
         return decodeURIComponent(text)
    }
   
export const getLength = (str: string) => { 
    // console.log(str.replace(/[^\x00-\xff]/g,"OO"));
    return str.replace(/[^\x00-\xff]/g,"OO").length;
}

function gb2utf8(data)
 {
    var glbEncode = [];
    gb2utf8_data = data;
    execScript("gb2utf8_data = MidB(gb2utf8_data, 1)", "VBScript");
    var t = escape(gb2utf8_data).replace(/%u/g,"").replace(/(.{2})(.{2})/g,"%$2%$1").replace(/%([A-Z].)%(.{2})/g,"@$1$2");
    t = t.split("@");
    var i = 0, j = t.length, k;
    while( ++i < j )
    {
       k = t[i].substring(0,4);
       if(!glbEncode[k])
       {
          gb2utf8_char = eval("0x"+k);
          execScript("gb2utf8_char = Chr(gb2utf8_char)", "VBScript");
          glbEncode[k] = escape(gb2utf8_char).substring(1,6);
       }
       t[i] = glbEncode[k]+t[i].substring(4);
    }
    gb2utf8_data = gb2utf8_char = null;
    return unescape(t.join("%"));
 }
 
 function utf8(wide: string)
 {
   var c, s;
   var enc = "";
   var i = 0;
   while(i<wide.length)
   {
   c= wide.charCodeAt(i++);
   // handle UTF-16 surrogates
   if (c>=0xDC00 && c<0xE000) continue;
   if (c>=0xD800 && c<0xDC00)
   {
      if (i>=wide.length) continue;
      s= wide.charCodeAt(i++);
      if (s<0xDC00 || c>=0xDE00) continue;
      c= ((c-0xD800)<<10)+(s-0xDC00)+0x10000;
   }
   // output value
   if (c<0x80)
      enc += String.fromCharCode(c);
   else if (c<0x800)
      enc += String.fromCharCode(0xC0+(c>>6),0x80+(c&0x3F));
   else if (c<0x10000)
      enc += String.fromCharCode(0xE0+(c>>12),0x80+(c>>6&0x3F),0x80+(c&0x3F));
   else
      enc += String.fromCharCode(0xF0+(c>>18),0x80+(c>>12&0x3F),0x80+(c>>6&0x3F),0x80+
  
   (c&0x3F));
   }
   return enc;
 }
 
 var hexchars = "0123456789ABCDEF";  

 function toHex(n)
 {  
   return hexchars.charAt(n>>4)+hexchars.charAt(n & 0xF);  
 }
 
 var okURIchars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";
  
 export const encodeURIComponentNew = (str: string) => {  
  var s = utf8(str);  
  var c;  
  var enc = "";  
  for(var i= 0; i < s.length; i++)
  {  
  if(okURIchars.indexOf(s.charAt(i))==-1)  
     enc += "%"+toHex(s.charCodeAt(i));  
  else  
     enc += s.charAt(i);  
  }  
  return enc;  
 }

