/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    userInfo?: WechatMiniprogram.UserInfo,
    isDebugModel?: boolean
    connected?: boolean
    reConnectedTimes: number
    deviceName?: string
    deviceId?: string,
    serviceId?: string,
    characteristicId?: string,
    deviceNotify?: {
        serviceId?: string,
        characteristicId?: string,
    },
    deviceWrite?: {
        serviceId?: string,
        characteristicId?: string,
    }
  }
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback,
}

interface IHistoryDeviceItem {
  name: string
  nickName?: string
  deviceId: string
  notify?: {
      serviceId: string
      characteristicId: string
  }
  write?: {
      serviceId: string
      characteristicId: string
  }
}
