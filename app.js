// app.js
App({
  "navigationBarTitleText": "Meoknow",
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  cdToRecognize(){
    wx.navigateTo({
      url: '../recognize/recognize'
    })
  },
  cdToMy(){
    wx.navigateTo({
      url: '../my/my'
    })
  },
  cdToBook(){
    wx.navigateTo({
      url: '../pages/book/book'
    })
  },
  globalData: {
    userInfo: null
  },
})
