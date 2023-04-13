
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
            value: '',
        },
        confirmText: {
            type: String,
            value: '确定'
        },
        close: {
            type: Function,
            // value: () => {console.log('handleClose')},
        },
        confirm: {
            type: Function,
            // value: () => {console.log('handleConfirm')},
        },
    },
    data: {
    },
    created() {
    },
    methods: {
        handleConfirm () {
            this.triggerEvent('confirm');
        },
        handleClose () {
            this.triggerEvent('close');
        },
    }
})
