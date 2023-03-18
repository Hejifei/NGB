import WeCropper from '@we-cropper/index.js'
// 获取应用实例
// const app = getApp<IAppOption>()

Page({
  data: {
    src:'',
    width: 128,//宽度
    height: 128,//高度
  },
  onLoad: function (options) {
    //获取到image-cropper实例
        this.cropper = this.selectComponent("#image-cropper");
        //开始裁剪
        // this.setData({
        //     src:"../../../assets/imgs/demo2.jpg",
        // });
        // wx.showLoading({
        //     title: '加载中'
        // })
    },
    cropperload(e){
        console.log("cropper初始化完成");
    },
    loadimage(e){
        console.log("图片加载完成",e.detail);
        // wx.hideLoading();
        //重置图片角度、缩放、位置
        this.cropper.imgReset();
    },
    clickcut(e) {
        console.log({
            detail: e.detail
        });
        //点击裁剪框阅览图片
        wx.previewImage({
            current: e.detail.url, // 当前显示图片的http链接
            urls: [e.detail.url] // 需要预览的图片http链接列表
        })
    },
//   onShow() {
        
//     },
//     confirmUpload() {
//     }
})
