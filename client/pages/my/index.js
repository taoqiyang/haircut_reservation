// pages/my/index.js
var util = require('../../utils/util.js')
var Toast = require('../../utils/Toast.js')
var config = require('../../config.js')

// var noop = function noop() { };
let pageSize = 10
let page = 1
let hasMore = false

function fail(msg) {
  Toast.showFailToast(msg)
}

function complete() {
  wx.hideLoading()
  wx.stopPullDownRefresh()
}

function loadData(that, options) {
  options = options || {}
  // options.success = options.success || noop
  options.fail = options.fail || fail
  options.complete = options.complete || complete

  let userID = getApp().globalData.user.id

  wx.request({
    url: config.service.queryUserReservation,
    data: {
      userID,
      page: page,
      pageSize: pageSize
    },
    method: "GET",
    success: function (res) {
      let data = res.data.data.reservations
      if (res.data.code === 0) {
        hasMore = data.length >= pageSize
        if (options.success) {
          options.success(data)
        } else {
          let reservations = that.data.reservations || []
          if (page === 1) {
            reservations = data
          } else {
            reservations.push.apply(reservations, data)
          }
          that.setData({reservations})
          page++;
        }
      } else {
        options.fail(res.data.msg)
      }
    },
    fail: function (res) {
      options.fail(config.networkErrorText)
    },
    complete: function (res) {
      options.complete()
    },
  })
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    config: {
      serviceTypeEnable: config.serviceTypeEnable
    },
    login: false,
    reservations: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let state = getApp().globalData.user && true
    if (this.data.login != state) {
      this.setData({login: state})
    } else {
      return;
    }
    if (!state) {
      return
    }
    Toast.showLoading()
    this.reload()
  },

  go2main: function () {
    wx.switchTab({
      url: '/pages/reservation/reservation',
    })
  },

  reload: function(options) {
    page = 1
    hasMore = false
    loadData(this, options)
  },

  onPullDownRefresh: function () {
    // wx.startPullDownRefresh({})
    this.reload()
  },

  onReachBottom: function () {
    if(!hasMore){
      return;
    }
    Toast.showLoading()
    loadData(this)
  }

})