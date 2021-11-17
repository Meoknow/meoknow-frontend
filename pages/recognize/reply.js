// pages/recognizereply.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 1,
    userimage: "",
    rescats: null
  },

  getCatInfo: function(options) {
    console.log(options.cat_id);
    let retcat = {};
    let stocats = wx.getStorageSync("cats");
    /*wx.getStorage({
      key: "cats",
      success (res) {
        console.log(res.data);
        let stocats = res.data;
      }
    })*/
    console.log(stocats);
    let i;
    for(i=0;i<stocats.length;i++) {
      if (options.cat_id == stocats[i].cat_id) {
        retcat = JSON.parse(JSON.stringify(stocats[i]));
        console.log(retcat);
      }
    }
    return retcat;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel();
    let mypage = this;
    
    eventChannel.on('replyCats', function(data) {
      console.log(data);
      let i;
      let tmp_cats = new Array();
      mypage.setData({userimage:data.data.img_url});
      console.log(data.data.cats.length);
      for (i=0; i<data.data.cats.length; i++) {
        // console.log(mypage.getCatInfo(data.data.cats[i].cat_id));
        tmp_cats.push(mypage.getCatInfo({
          cat_id:data.data.cats[i].cat_id
        }));
      }
      console.log(tmp_cats);
      mypage.setData({rescats:tmp_cats});
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