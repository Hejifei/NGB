// index.ts
// 获取应用实例
const app = getApp<IAppOption>()

Page({
    data: {
        titlePositionTop: 0,
    },
    onShow() {

        // this.deawCircleProcess()
        const that = this
        wx.getSystemInfo({
            success(res) {
                const { screenHeight, statusBarHeight, safeArea } = res
                // const barhHeight = screenHeight - windowHeight
                const barhHeight = screenHeight - safeArea.height
                let menu = wx.getMenuButtonBoundingClientRect()
                let navBarHeight = menu.height + (menu.top - statusBarHeight) * 2
                const navTopHeight = statusBarHeight + navBarHeight / 2 - 12
                that.setData({
                    titlePositionTop: navTopHeight,
                })
            }
        })
    },
    changePageToImgUpload() {
        wx.navigateTo({
            url: '/pages/index/img_upload/img_upload',
        })
    },
    changePageToTextUpload() {
        wx.navigateTo({
            url: '/pages/index/text_upload/text_upload',
        })
    }
})
