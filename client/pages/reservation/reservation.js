// pages/reservation/reservation.js
let Toast = require('../../utils/Toast.js')
let util = require('../../utils/util.js')
var config = require('../../config.js')

let firstClickTime
let clickCount = 0

function showCurrentReservation(user, that){
  let currentReservation = null
  let locationMarker = null
  if (user.currentReservation) {
    currentReservation = user.currentReservation.clone()
    currentReservation.reservation_time = util.formatTime(new Date(currentReservation.reservation_time))
    locationMarker = {}
    locationMarker.latitude = currentReservation.lat
    locationMarker.longitude = currentReservation.lng
    locationMarker.address = currentReservation.address
  }
  
  that.setData({
    login: true,
    currentReservation,
    locationMarker
  })
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    serviceTypeEnable: config.serviceTypeEnable,
    login: false,
    currentReservation: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let user = getApp().globalData.user
    if(user){
      showCurrentReservation(user, this)
    }else{
      this.requestLogin();
    }
  },

  onShow: function() {
    //如果是检测到原来没有当前预约，但是重新显示时发现用户有当前预约，则显示当前预约
    if(this.data.currentReservation){
      return
    }
    let gd = getApp().globalData
    if (!gd.user || gd.user && !gd.user.currentReservation){
      return;
    }
    showCurrentReservation(gd.user, this)
  },

  go2Reserve: function (e) {
    if (!this.data.login) {
      this.requestLogin()
    } else {
      wx.navigateTo({
        url: 'index',
      })
    }
  },

  requestLogin: function () {
    let that = this
    wx.showLoading({
      title: '登录中，请稍候...',
    })
    getApp().login(
      function (user) {
        showCurrentReservation(user, that)
      },
      function (error) {
        console.log("登录失败:" + error)
      },
      function (result) {
        wx.hideLoading()
        if (!result) {
          Toast.showFailToast("登录失败:")
        }
      }
    )
  },

  cancelReserve: function(){
    let that = this
    wx.showModal({
      title: '确定取消预约?',
      content: '预约取消后立刻失效,无法恢复!',
      cancelText: '我在想想',
      confirmText: '确定',
      confirmColor: '#e64340',
      success: function(res){
        if (!res.confirm) {
          return
        } 
        that.setData({
          requesting: true
        })
        wx.request({
          url: config.service.cancelReverse,
          data: {
            id: that.data.currentReservation.id,
            userID: getApp().globalData.user.id
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          success: function (res) {
            if (res.data.code == 0) {
              getApp().removeUserCurrentReservation()
              that.setData({
                currentReservation: null
              })
            } else {
              Toast.showFailToast(res.data.msg)
            }
          },
          fail: function (res) {
            Toast.showFailToast('请求失败')
          },
          complete: function (res) {
            that.setData({
              requesting: false
            })
          },
        })
      }
    })
  },
  suAdmin: function(){
    if (!firstClickTime || new Date().getTime() - firstClickTime > 1000) {
      firstClickTime = new Date().getTime()
      clickCount = 1
    } else {
      clickCount++
      if (clickCount > 5) {
        clickCount = 0
        getApp().suChangeUser(true);
      }
    }
  }
})