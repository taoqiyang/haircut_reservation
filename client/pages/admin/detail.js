// pages/admin/detail.js
let util = require('../../utils/util.js')
let Toast = require('../../utils/Toast.js')
let config = require('../../config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config: {
      serviceTypeEnable: config.serviceTypeEnable
    },
    requesting: false,
    reservation: null,
    newStatus: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let reservation = JSON.parse(options.reservation)
    if (!reservation) {
      wx.navigateBack()
      return;
    }
    let locationMarker = {}
    locationMarker.latitude = reservation.lat
    locationMarker.longitude = reservation.lng
    locationMarker.address = reservation.address

    this.setData({
      reservation: reservation,
      locationMarker,
      newStatus: {
        status: reservation.status,
        status_desc: reservation.status_desc
      }
    })
  },

  changeState: function () {
    if (this.data.requesting) {
      return;
    }
    let currentStatus = this.data.reservation.status
    if(currentStatus === 2){
      currentStatus = 7
    }
    let newStatusArray = config.reservation_status.filter(status => {
      return status.admin && status.value > currentStatus
    })
    if (newStatusArray.length === 0) {
      return;
    }
    let newStatusStr = newStatusArray.map(temp => {
      return temp.name
    })
    let that = this
    wx.showActionSheet({
      itemList: newStatusStr,
      success: function (res) {
        console.log(res.tapIndex)
        that.setData({
          newStatus: {
            status: newStatusArray[res.tapIndex].value,
            status_desc: newStatusArray[res.tapIndex].name
          }
        })
      }
    })
  },

  submit: function () {
    this.setData({
      requesting: true
    })
    let newStatus = this.data.newStatus
    let data = {
      userID: getApp().globalData.user.id,
      reservationID: this.data.reservation.id,
      newStatus: newStatus.status
    }
    let that = this
    wx.request({
      url: config.service.adminChangeStatus,
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        if (res.data.code == 0) {
          let reservation = that.data.reservation
          reservation.status = newStatus.status
          reservation.status_desc = newStatus.status_desc
          that.setData({
            reservation
          })
          Toast.showSuccessToast(res.data.msg)
        } else {
          Toast.showFailToast(res.data.msg)
        }
      },
      fail: function (res) { 
        Toast.showFailToast()
      },
      complete: function (res) {
        that.setData({
          requesting: false
        })
      },
    })

  }


})