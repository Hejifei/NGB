export const REQUEST_URL = 'https://bluetooth.dev.zhangxinkeji.com'

//  serviceId
export const SERVICE_ID_VALUE = 'serviceId'
//  characteristicId
export const CHARACTERISTIC_ID_VALUE = 'characteristicId'

export const LOCAL_STORAGE_KEY_HISTORY_DEVICES = 'history_device_list'

export const tabbar_home_value = "home"   //  首页
export const tabbar_device_list_value = "device_list"   //  设备列表
export const tabbar_record_list_value = "record_list"   //  上传列表

export const tabbar_data_list: {
    name: string
    value: string
    img_src: string
    url: string
    router: string
}[] = [
    {
        name: '首页',
        value: tabbar_home_value,
        img_src: '../assets/imgs/tab/home.png',
        url: 'pages/infoView/infoView',
        router: '../index/index',
    },
    {
        name: '设备列表',
        value: tabbar_device_list_value,
        img_src: '../assets/imgs/tab/device_list.png',
        url: 'pages/device_list/device_list',
        router: '../device_list/device_list',
    },
    {
        name: '上传列表',
        value: tabbar_record_list_value,
        img_src: '../assets/imgs/tab/record_list.png',
        url: 'pages/record_list/record_list',
        router: '../record_list/record_list',
    },
]