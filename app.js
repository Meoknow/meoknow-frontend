// app.js
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
  cdToMy()
  {
    wx.switchTab({
      url: '../my/my',
    })
  },
  globalData: {
    userinfo: null
  },
  globalData2: 'a'
})
