var storage = require('../../utils/storage.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    freehero: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.fetchData();
  },

  onShareAppMessage: function () {
    return {
      title: '猫咪图鉴',
      path: 'pages/book/detail'
    }
  },

  fetchData: function () {
    var self = this;

    storage.init();
    storage.queryFreehero(function (data) {
      if (data.status === 400) {
        wx.showModal({
          title: '网络错误',
          content: '数据获取失败，请重新尝试',
          success: function (res) {
            if (res.confirm) {
              self.fetchData();
            }
          }
        });
        return;
      }
      
      var freeheroData = data.data[0].attributes.freehero;
      self.setData({
        freehero: freeheroData
      })
    });
  }
})