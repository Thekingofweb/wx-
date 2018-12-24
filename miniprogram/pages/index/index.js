//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    tip: "第一次开发小程序",
    swiperCurrent: 0,
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 8000000,
    circular: true,
    imgUrls: [
      // '../../images/10.jpg',
      // '../../images/11.jpg',
      // '../../images/12.jpg',
      // '../../images/13.jpg'
    ],
    links: [

      '../user/user',

      '../user/user',

      '../user/user'
    ],
    mod: [
      'aspectFit',
      'widthFix',
    ],
    array:[]
  },
  // 实现下拉的loading事件
  onPullDownRefresh() {
    wx.showLoading({
      title: 'loading',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) {
        setTimeout(()=>{
          wx.hideLoading();
        },3000)
      },
    })
  },
  onLoad: function() {
    var arr = this.inintData();
    console.log(arr)
    this.setData({
      array: arr
    })
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },
  //轮播图的切换事件

  swiperChange: function (e) {

    this.setData({

      swiperCurrent: e.detail.current

    })

  },

  //点击指示点切换

  chuangEvent: function (e) {

    this.setData({

      swiperCurrent: e.currentTarget.id

    })

  },
  //点击图片触发事件
  swipclick: function (e) {

    console.log(this.data.swiperCurrent);

    wx.switchTab({

      url: this.data.links[this.data.swiperCurrent]

    })

  },
  imageLoad: function (e) {
    var res = wx.getSystemInfoSync();
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      ratio = imgwidth / imgheight;
    this.setData({
      bannerHeight: res.windowWidth / ratio
    })
  },
  inintData:function(){
    var array = [];

    var obj1 = new Object();
    obj1.img = "../../images/10.jpg";
    obj1.title = "爱心早餐";
    obj1.type = "健康养生";
    obj1.liulan = "11100浏览";
    obj1.pinlun = "7条评论";
    array[0] = obj1;

    var obj2 = new Object();
    obj2.img = "../../images/11.jpg";
    obj2.title = "困了只想喝咖啡";
    obj2.type = "家庭医生在线";
    obj2.liulan = "1100浏览";
    obj2.pinlun = "8条评论";
    array[1] = obj2;

    var obj3 = new Object();
    obj3.img = "../../images/13.jpg";
    obj3.title = "橘子吃多了会更加聪明";
    obj3.type = "家庭医生在线";
    obj3.liulan = "1100浏览";
    obj3.pinlun = "8条评论";
    array[2] = obj3;

    var obj4 = new Object();
    obj4.img = "../../images/12.jpg";
    obj4.title = "今日头条，广告";
    obj4.type = "广告";
    obj4.liulan = "1100浏览";
    obj4.pinlun = "12条评论";
    array[3] = obj4;
    console.log(array)
    return array;
  },
  // 跳转到其他页面通用函数
  jumto: function(e){
    console.log(e.currentTarget);
    let targetUrl = e.currentTarget.dataset.url
    wx.navigateTo({
      url: targetUrl
    })
  }
})
