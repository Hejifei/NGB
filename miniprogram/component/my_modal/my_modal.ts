
Component({
    properties: {
        model_type: {
            type: String,
            value: 'waiting'
        },
        title: {
            type: String,
            value: 'title',
        },
        content: {
            type: String,
            value: 'contentcontentcontentcontentcontentcontentcontent',
        },
        confirmText: {
            type: String,
            value: '确定'
        },
        handleClose: {
            type: Function,
            value: () => {},
        },
        handleConfirm: {
            type: Function,
            value: () => {},
        },
    },
    data: {
    },
    created() {
    },
    methods: {
    }
})
