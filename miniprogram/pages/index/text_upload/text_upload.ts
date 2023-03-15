// index.ts
// 获取应用实例
// const app = getApp<IAppOption>()

Page({
    data: {
        text: undefined,
    },
    onShow() {

    },
    confirmUpload() {
        console.log({
            text: this.data.text,
        })
    }
})
