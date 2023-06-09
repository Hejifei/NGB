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
export const array2Buffer = (str: string) => {
    let buffer = new ArrayBuffer(str.length)
    let dataView = new DataView(buffer)
    for (let i = 0; i < str.length; i++) {
      dataView.setUint8(i, str[i])
    }
    // const buffer = []
    // for (let i = 0; i < str.length; i = i + 2) {
    //     console.log(i)
    //     buffer.push('0x' + str.substring(i, i + 2))
    // }
  
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

 const base64ToBuffer = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
export const dataUrlToBuffer = (urlData: string) => {
    const [head, base64] = urlData.split(',')
    const type = head.match(/:(.*?);/)[1]
    
    return [base64ToBuffer(base64), type]
}


var base64EncodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
    base64DecodeChars = new Array((-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), 62, (-1), (-1), (-1), 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, (-1), (-1), (-1), (-1), (-1), (-1), (-1), 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, (-1), (-1), (-1), (-1), (-1), (-1), 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, (-1), (-1), (-1), (-1), (-1));
var base64encode = function (e) {
    var r, a, c, h, o, t;
    for (c = e.length, a = 0, r = ''; a < c;) {
        if (h = 255 & e.charCodeAt(a++), a == c) {
            r += base64EncodeChars.charAt(h >> 2),
                r += base64EncodeChars.charAt((3 & h) << 4),
                r += '==';
            break
        }
        if (o = e.charCodeAt(a++), a == c) {
            r += base64EncodeChars.charAt(h >> 2),
                r += base64EncodeChars.charAt((3 & h) << 4 | (240 & o) >> 4),
                r += base64EncodeChars.charAt((15 & o) << 2),
                r += '=';
            break
        }
        t = e.charCodeAt(a++),
            r += base64EncodeChars.charAt(h >> 2),
            r += base64EncodeChars.charAt((3 & h) << 4 | (240 & o) >> 4),
            r += base64EncodeChars.charAt((15 & o) << 2 | (192 & t) >> 6),
            r += base64EncodeChars.charAt(63 & t)
    }
    return r
}
var base64decode = function (e) {
    var r, a, c, h, o, t, d;
    for (t = e.length, o = 0, d = ''; o < t;) {
        do r = base64DecodeChars[255 & e.charCodeAt(o++)];
        while (o < t && r == -1);
        if (r == -1) break;
        do a = base64DecodeChars[255 & e.charCodeAt(o++)];
        while (o < t && a == -1);
        if (a == -1) break;
        d += String.fromCharCode(r << 2 | (48 & a) >> 4);
        do {
            if (c = 255 & e.charCodeAt(o++), 61 == c) return d;
            c = base64DecodeChars[c]
        } while (o < t && c == -1);
        if (c == -1) break;
        d += String.fromCharCode((15 & a) << 4 | (60 & c) >> 2);
        do {
            if (h = 255 & e.charCodeAt(o++), 61 == h) return d;
            h = base64DecodeChars[h]
        } while (o < t && h == -1);
        if (h == -1) break;
        d += String.fromCharCode((3 & c) << 6 | h)
    }
    return d
}
var hexToBytes = function (hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}
var bytesToHex = function (bytes) {
    for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
    }
    return hex.join("");
}
var bytesToString = function (arr) {
    var str = "";
    arr = new Uint8Array(arr);
    for (i in arr) {
        str += String.fromCharCode(arr[i]);
    }
    return str;
}
var stringToBytes = function (str) {
    var ch, st, re = [];
    for (var i = 0; i < str.length; i++) {
        ch = str.charCodeAt(i);
        st = [];
        do {
            st.push(ch & 0xFF);
            ch = ch >> 8;
        }
        while (ch);
        re = re.concat(st.reverse())
    }
    return re;
}
var bytesToBase64 = function (bytes) {

    // Use browser-native function if it exists
    // if (typeof btoa == "function") return btoa(bytesToString(bytes));

    for (var base64 = [], i = 0; i < bytes.length; i += 3) {
        var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
        for (var j = 0; j < 4; j++) {
            if (i * 8 + j * 6 <= bytes.length * 8)
                base64.push(base64EncodeChars.charAt((triplet >>> 6 * (3 - j)) & 0x3F));
            else base64.push("=");
        }
    }
    return base64.join("");
}
var base64ToBytes = function (base64) {

    // Use browser-native function if it exists
    // if (typeof atob == "function") return stringToBytes(atob(base64));

    // Remove non-base-64 characters
    base64 = base64.replace(/[^A-Z0-9+\/]/ig, "");

    for (var bytes = [], i = 0, imod4 = 0; i < base64.length; imod4 = ++i % 4) {
        if (imod4 == 0) continue;
        bytes.push(((base64EncodeChars.indexOf(base64.charAt(i - 1)) & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2)) |
            (base64EncodeChars.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
    }

    return bytes;

}
// var hexToString = function (hex) {
//     var arr = hex.split("")
//     var out = ""
//     for (var i = 0; i < arr.length / 2; i++) {
//         var tmp = "0x" + arr[i * 2] + arr[i * 2 + 1]
//         var charValue = String.fromCharCode(tmp);
//         out += charValue
//     }
//     return out
// }
// var stringToHex = function (str) {
//     var val = "";
//     for (var i = 0; i < str.length; i++) {
//         if (val == "")
//             val = str.charCodeAt(i).toString(16);
//         else
//             val += str.charCodeAt(i).toString(16);
//     }
//     val += "0a"
//     return val
// }
var hexToBase64 = function (str) {
    return base64encode(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
}
export var base64ToHex = function (str) {
    for (var i = 0,
             bin = base64decode(str.replace(/[ \r\n]+$/, "")), hex = []; i < bin.length; ++i) {
        var tmp = bin.charCodeAt(i).toString(16);
        if (tmp.length === 1) tmp = "0" + tmp;
        hex[hex.length] = tmp;
    }
    return hex.join("");
}