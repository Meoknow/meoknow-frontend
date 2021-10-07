let timeId = null;
Page({
    data: {
        history: [],
        hot: ['cat', 'meo', 'neko'],
        result: [
            {
                id: 1,
                url: '../details/details',
                thumb: '/image/neko-image/neko1.png',
                title: 'cute cat'
            },
            {
                id: 2,
                url: '../details/details',
                thumb: '/image/neko-image/neko2.png',
                title: 'cute cat'
            }
        ],
        showKeywords: false,
        keywords: ['cat', 'meo', 'neko', 'cute'],
        value: '',
        showResult: false,
    },
    cancelSearch() {
        this.setData({
            showResult: false,
            showKeywords: false,
            value: ''
        })
    },

    searchInput(e) {
        if(!e.detail.value){
            this.setData({
                showKeywords: false
            })
        }else{
            if(!this.data.showKeywords){
                timeId && clearTimeout(timeId);
                timeId = setTimeout(() => {
                    this.setData({
                        showKeywords: true
                    })
                }, 1000)
            }
        }
    },
    keywordHandle(e) {
        const text = e.target.dataset.text;
        this.setData({
            value: text,
            showKeywords: false,
            showResult: true
        })
        this.historyHandle(text);
    },
    historyHandle(value) {
        let history = this.data.history;
        const idx = history.indexOf(value);
        if (idx === -1) {
            if (history.length > 7) {
                history.pop();
            }
        } else {
            history.splice(idx, 1);
        }
        history.unshift(value);
        wx.setStorageSync('history', JSON.stringify(history));
        this.setData({
            history
        });
    },
    historyDelete(value) {
        console.log("access in!")
        let history = this.data.history;
        while(this.data.history.length > 0)
            this.data.history.pop();
        wx.setStorageSync('history', JSON.stringify(history));
        this.onLoad();
    },
    onLoad() {
        const history = wx.getStorageSync('history');
        if (history) {
            this.setData({
                history: JSON.parse(history)
            })
            console.log(this.data.history);
        }
    }
})