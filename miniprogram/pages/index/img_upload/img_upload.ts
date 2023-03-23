import WeCropper from '@we-cropper/index.js'
// 获取应用实例
// const app = getApp<IAppOption>()

Page({
  data: {
    src:'',
    width: 128,//宽度
    height: 128,//高度
    imgCropperVisible: false,
    fileList: [],
    imgBase64Str: '',
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
    onShow() {
        // const query = wx.createSelectorQuery()
        // query.select('.canvasItem')
        // .fields({node: true, size: true})
        // .exec(res => {
        //     console.log({
        //         res,
        //     })
        //     const canvas = res[0].node;
        //     const ctx = canvas.getContext('2d')
        //     console.log({
        //         ctx,
        //     })
        // })
        
    },
    cropperload(e){
        console.log("cropper初始化完成");
    },
    loadimage(e){
        console.log("图片加载完成",e.detail);
        // wx.hideLoading();
        //重置图片角度、缩放、位置
        // this.cropper.imgReset();
    },
    clickcut(e) {
        console.log({
            e,
            detail: e.detail
        });
        const url = e.detail.url;
        const query = wx.createSelectorQuery()
        query.select('.canvasItem')
        .fields({node: true, size: true})
        .exec(res => {
            console.log({
                res,
            })
            const canvas = res[0].node;
            const ctx = canvas.getContext('2d')
            console.log({
                ctx,
            })
            console.log({url});
            const img = canvas.createImage()
            img.src = url
            img.onload = () => {
                const width = 128;
                const height = 128;
                canvas.width = width
                canvas.height = height
                ctx.drawImage(img, 0, 0, width, height)
                const dataUrl = canvas.toDataURL();
                this.setData({
                    imgBase64Str: dataUrl,
                })
                console.log({
                    dataUrl,
                })

                const smallImg = canvas.createImage()
                smallImg.src = dataUrl
                smallImg.onload = () => {
                    ctx.clearRect(0,0,128,128);
                    ctx.height=128;
                    ctx.width=128;
                    ctx.drawImage(smallImg, 0, 0);
                    const myImageData = ctx.getImageData(0, 0, 128, 128);
                    console.log('myImageData', myImageData);
                    const rgb565ImageData = ctx.createImageData(128, 128);
                    for(let i = 0; i < 128; i++) {
                        for(let j = 0; j < 128; j++) {
                            const index = ((j * (myImageData.width * 4)) + (i * 4));
                            const r = myImageData.data[index];
                            const g = myImageData.data[index + 1];
                            const b = myImageData.data[index + 2];
                            const a = myImageData.data[index + 3];
                            rgb565ImageData.data[index] = r >> 3 << 3;
                            rgb565ImageData.data[index + 1] = g >> 2 << 2;
                            rgb565ImageData.data[index + 2] = b >> 3 << 3;
                            rgb565ImageData.data[index + 3] = a;
                        }
                    }
                    ctx.putImageData(rgb565ImageData, 0, 0);const dataUrl = canvas.toDataURL();
                    this.setData({
                        imgBase64Str: dataUrl,
                    })

                    const fileList = this.data.fileList
                    //  @ts-ignore
                    this.setData({
                        fileList: [
                            {
                                ...fileList[0],
                                // url: e.detail.url,
                                // thumb: e.detail.url,
                                url: dataUrl,
                                thumb: dataUrl,
                            }
                        ],
                        // src: e.detail.url,
                        src: dataUrl,
                        imgCropperVisible: false,
                    }, () => {
                        console.log({
                            fileList: this.data.fileList,
                        })
                    });
                }

                
            }
            
                // imageEl.src = url;
                
                // const img = new Image();
                // img.src=url;
                // img.onload = () => {
                    
        
        
                // }
        })
        
        //点击裁剪框阅览图片
        // wx.previewImage({
        //     current: e.detail.url, // 当前显示图片的http链接
        //     urls: [e.detail.url] // 需要预览的图片http链接列表
        // })
        
    },
    handlePreview(e) {
        console.log({e})
        wx.previewImage({
            current: e.detail.url, // 当前显示图片的http链接
            urls: [e.detail.url] // 需要预览的图片http链接列表
        })
    },
    produceImg() {
        this.setData({

        })
        console.log({
            imgCropperVisible: false,
        })
    },
    afterRead(event) {
        const { file } = event.detail;
        // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
            this.setData({
                fileList: [
                    { ...file, }
                ],
                src: file.url,
                imgCropperVisible: true,
            });
        console.log({
            event,
        })
        // wx.uploadFile({
        //   url: 'https://example.weixin.qq.com/upload', // 仅为示例，非真实的接口地址
        //   filePath: file.url,
        //   name: 'file',
        //   formData: { user: 'test' },
        //   success(res) {
        //     // 上传完成需要更新 fileList
        //     const { fileList = [] } = this.data;
        //     fileList.push({ ...file, url: res.data });
        //     this.setData({ fileList });
        //   },
        // });
    },
    handleDelte(event) {
        // const index = event.detail.index
        console.log({
            event,
        })
        this.setData({
            fileList: []
        })
    },
//   onShow() {
        
//     },
    confirmUpload() {
    }
})
