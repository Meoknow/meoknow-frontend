// index.js
// 获取应用实例
const app = getApp()
var server=app.globalData.server;
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
    catPictures:[],

    Name: 'fds',
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
  // 事件处理函数
  cdToRecognize()
  {
    app.cdToRecognize();
  },
  cdToMy()
  {
    app.cdToMy();
  },
  cdToBook()
  {
    app.cdToBook();
  },
  cdToMap()
  {
    app.cdToMap();
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },

  onShow()
  {
    this.flush();
    this.setData({"PageBook":1})
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  flush()
  {
    var that = this;
    var tmp = new Array();
    wx.request({
      "url": server+'/cats/',
      "method": 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      //header: {}, // 设置请求的 header
      success: function(res){
      
        if(res.data.code==0)//get data success
        {
          wx.setStorageSync("cats", res.data.data)
          wx.getStorageInfo({
            success (res) {
              console.log(res.keys)
              console.log(res.currentSize)
              console.log(res.limitSize)
            }
          });
          var n = res.data.data.length;
          for(let i=0;i<n;i++)
            tmp.push(res.data.data[i]);
          console.log("loading to catpictures");
          for(let i=0;i<tmp.length;i++)
            console.log(tmp[i].name),tmp[i].img_url="http://"+tmp[i].img_url,tmp[i].url="detail/detail?cat_id"+tmp[i].cat_id;
          that.setData({catPictures:tmp});
        }
        else console.log("we find no cat_id");
      },
      fail: function(res) {
        console.log(res.errMsg);
      }
    })
  },
  Navigator:function(e)
  {
    var cat = e.currentTarget.dataset.cat;
    console.log(cat.cat_id);
    wx.navigateTo({
      url: "detail/detail?cat_id="+cat.cat_id
    })
  }

})
