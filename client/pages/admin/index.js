// pages/admin/index.js
let util = require('../../utils/util.js')
let Toast = require('../../utils/Toast.js')
let config = require('../../config.js')

let pageSize = 10
let page = 1
let hasMore = false

let needReload = false

let firstClickTime
let clickCount = 0

function loadData(that){
  let status = that.data.status
  let myProccessedItem = that.data.myProccessedItem
  let userID = getApp().globalData.user.id

  wx.request({
    url: config.service.adminQueryReservation,
    data: {
      userID,
      page: page,
      pageSize: pageSize,
      status,
      isMy: myProccessedItem === 1
    },
    method: "GET",
    success: function (res) {
      let data = res.data.data.reservations
      if (res.data.code === 0) {
        hasMore = data.length >= pageSize
        let reservations = that.data.reservations || []
        if (page === 1) {
          reservations = data
        } else {
          reservations.push.apply(reservations, data)
        }
        that.setData({ reservations })
        page++;
      } else {
        Toast.showFailToast(res.data.msg)
      }
    },
    fail: function (res) {
      Toast.showFailToast()
    }
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
    status: 1,
    myProccessedItem: 0,
    reservation_status: config.reservation_status,
    myProccessedItems: [
      {
        name: '所有的',
        value: 0,
      },
      {
        name: '我处理过的',
        value: 1
      }
    ]
  },

  onLoad: function(e){
    needReload = true
  },

  onShow: function () {
    if(!needReload){
      return;
    }
    this.reload();
  },

  reload: function(){
    page = 1
    hasMore = false
    loadData(this)
  },

  myProcessedChange: function(e){
    this.setData({
      myProccessedItem: Number(e.detail.value)
    })
    this.reload();
  },

  statusChange: function(e){
    let that = this
    this.setData({
      status: Number(e.detail.value),
    })
    this.reload()
  },

  reachBottom: function(){
    if (!hasMore) {
      return;
    }
    loadData(this)
  },

  itemClick: function(e){
    let index = e.currentTarget.dataset.index
    let reservation = this.data.reservations[index]
    if(!reservation){
      return;
    }
    needReload = reservation.status === 1 || reservation.status === 2 || reservation.status === 9
    wx.navigateTo({
      url: 'detail?reservation=' + JSON.stringify(reservation),
    })
  },

  suUser: function(){
    if(!firstClickTime || new Date().getTime() - firstClickTime > 1000){
      firstClickTime = new Date().getTime()
      clickCount = 1
    }else{
      clickCount ++
      if(clickCount > 5){
        clickCount = 0
        getApp().suChangeUser(false);
      }
    }
  }
})