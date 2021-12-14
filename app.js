// app.js
const $api=require("./utils/api.js");

App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        $api.request("GET","/session",{"code":res.code,})
          .then(res=>{
            console.log("my login token is",res.data.data.token);
            wx.setStorageSync('token',res.data.data.token);
          })
          .catch(err=>{
            console.log("login error");
            console.log(res.code);
            console.log(err);
          })
      }
    })
  },

  cdToRecognize()
  {
    wx.switchTab({
      url: '../recognize/recognize',
    })
  },
  cdToBook()
  {
    wx.switchTab({
      url: '../book/book',
    })
  },
  cdToMap()
  {
    wx.navigateTo({
      url: '../map/index'
    })
  },
  cdToMy()
  {
    wx.switchTab({
      url: '../my/my',
    })
  },
  globalData: {
    server: "http://39.104.59.169:3000",
    baseUrl: "http://39.104.59.169:3000",
//      server: "http://localhost:5000",
  },
})
