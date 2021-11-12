// pages/book/detail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
      cat_id: "",
      gender: "",
      Name: "",
      img_url: "",
      health: "",
      desexing: "",
      color: "好看",
      Namefrom: "好听",
        array: [
            {
              "message": "/image/neko-image/neko1.png"
            },
            {
              "message": "/image/neko-image/neko2.png"
            },
            {
              "message": "/image/neko-image/neko3.png"
            },
            {
              "message": "/image/neko-image/neko4.png"
            },
            {
              "message": "/image/neko-image/neko5.png"
            },
            {
              "message": "/image/neko-image/neko6.png"
            },
            {
              "message": "/image/neko-image/neko7.png"
            }
          ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      console.log(options.cat_id);
      this.setData({cat_id:options.cat_id});
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

      var that = this;
      wx.request({
        "url": 'http://localhost:5000/cats/'+that.data.cat_id,
  //      "url": 'http://localhost:5000/cats/',
        "method": 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        //header: {}, // 设置请求的 header
        success: function(res){
  //        console.log(res.data.data[0]);
          console.log("request =end");
        
          if(res.data.code==0)//get data success
          {
            var r = res.data.data;
            console.log(r);
             that.setData({
               Name:r.name,
               img_url:r.img_url,
               gender:r.gender,
               health:r.health_status,
               desexing:r.desexing_status
              });
          }
          else console.log("we find no cat_id");
        },
        fail: function(res) {
          console.log(res.errMsg);
        }
      })
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

    }
})