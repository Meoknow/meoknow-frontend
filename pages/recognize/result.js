// index.js
// 获取应用实例
const app = getApp()
var server=app.globalData.server;

Page({
  data: {
    returnCatPictures: "../../image/origin.jpg",
    showMask: false,
    recognizeCatPicture: "../../image/origin.jpg",
  },
  onLoad() {
    let mypage=this;
    mypage.setData({returnCatPictures:app.globalData.returnCatPictures});
    mypage.setData({recognizeCatPicture:app.globalData.recognizeCatPicture});
    console.log(app.globalData.returnCatPictures);
    console.log(mypage.data.returnCatPictures);
  },

  navi_to_detail:function(e)
  {
    var cat = e.currentTarget.dataset.cat;
    console.log(cat.cat_id);
    wx.navigateTo({
      url: "/pages/book/detail/detail?cat_id="+cat.cat_id
    })
  }

})
