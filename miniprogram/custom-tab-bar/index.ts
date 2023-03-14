import { tabbar_data_list, tabbar_home_value } from '../common/index'


Component({
    properties: {
    },
    data: {
        tabbar_data_list,
        active: tabbar_home_value,
    },
    ready() {
        const pages = getCurrentPages() //获取加载的页面
        const currentPage = pages[pages.length - 1] //获取当前页面的对象
        var url = currentPage.route
        const active = tabbar_data_list.filter(item => item.url === url)[0]?.value
        this.setData({
            active,
        })
    }, 
    methods: {
        onChange(event: any) {
            const value: string = event.detail
            const router = tabbar_data_list.filter(item => item.value === value)[0]?.router
            wx.switchTab({
                url: router,
            })
        },
    }
})
