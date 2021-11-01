Page({
  data: {
      category: [
          {name:'A',id:'1'},
          {name:'B',id:'2'},
          {name:'C',id:'3'},
          {name:'D',id:'4'},
          {name:'E',id:'5'},
          {name:'F',id:'6'}
      ],
      detail:[],
      curIndex: 0,
      isScroll: false,
      toView: 'guowei'
  },
  onReady(){
      var self = this;
      wx.request({
          url:'http://www.gdfengshuo.com/api/wx/cate-detail.txt',
          success(res){
              self.setData({
                  detail : res.data
              })
          }
      });
      
  },
  switchTab(e){
    const self = this;
    this.setData({
      isScroll: true
    })
    setTimeout(function(){
      self.setData({
        toView: e.target.dataset.id,
        curIndex: e.target.dataset.index
      })
    },0)
    setTimeout(function () {
      self.setData({
        isScroll: false
      })
    },1)
      
  }
  
})