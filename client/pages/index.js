// pages/index.js
let Toast = require('../utils/Toast.js')
let util = require('../utils/util.js')
var config = require('../config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logining: false
  },

  onReady: function() {
    //try to login
    this.requestLogin();
  },

  requestLogin: function () {
    let that = this
    this.setData({
      logining: true
    })
    getApp().login(
      function (user) {
        that.loginSuccess(user)
      },
      function (error) {
        console.log("登录失败:" + error)
      },
      function (result) {
        if (!result) {
          that.setData({
            logining: false
          })
          Toast.showFailToast("登录失败")
        }
      }
    )
  },

  loginSuccess: function(u) {
    let user = u || getApp().globalData.user
    if (user.admin) {
      wx.redirectTo({
        url: 'admin/index',
      })
    } else {
      wx.switchTab({
        url: 'reservation/reservation',
      })
    }
  },

  login: function() {
    if(getApp().globalData.user){
      this.loginSuccess();
      return;
    }
    this.requestLogin()
  }
})