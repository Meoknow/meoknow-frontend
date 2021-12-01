// pages/recognizereply.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 1,
    userimage: "http://39.104.59.169:3000/photos/public202111180245198051240148.jpeg",
    rescats: [
      {
        "cat_id": 2,
        "name" : "老二",
        "img_url": "http://39.104.59.169:3000/photos/public202111180245198051240148.jpeg",
        "confidence": "0.9"
      },

      
      {
        "cat_id": 2,
        "name" : "老二",
        "img_url": "http://39.104.59.169:3000/photos/public202111180245198051240148.jpeg",
        "confidence": "0.9"
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    this.setData({
      rescats:JSON.parse(options.rescats),
      userimage:options.userimage
    })
  },

  navi_to_detail:function(e)
  {
    var cat = e.currentTarget.dataset.cat;
    console.log(cat.cat_id);
    wx.navigateTo({
      url: "/pages/book/detail/detail?cat_id="+cat.cat_id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onChange(e) {
    console.log('onChange', e)
    this.setData({
        current: e.detail.current,
    })
  },
})