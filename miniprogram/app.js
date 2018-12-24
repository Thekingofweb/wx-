//app.js
App({
  // 监听小程序初始化
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    this.globalData = {}
  },
  // onShow 监听小程序显示
  onShow: function(){
    console.log(getCurrentPages())
  },
  // onHide 监听小程序隐藏
  onHide: function(){
    console.log(getCurrentPages())
  }
})
