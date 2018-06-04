// pages/reservation/index.js
var util = require('../../utils/util.js')
var Toast = require('../../utils/Toast.js')
var verifys = require('../../utils/verifys.js')
var config = require('../../config.js')
var { ServiceTypes, getServiceTypeName } = require('../../utils/ServiceType.js')
var { ServiceTargets, getServiceTargetName } = require('../../utils/ServiceTarget.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    time: '09:00',
    startTime: '09:00',
    endTime: '18:00',
    requesting: false,
    reserveSuccessed: false,
    serviceTypeEnable: config.serviceTypeEnable,
    serviceTypes: {
      id: 0,
      name: '默认'
    },
    serviceTarget: {
      id: ServiceTargets[1].id,
      name: ServiceTargets[1].name
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var ts = new Date();
    ts.setDate(ts.getDate() + 1);
    var start = util.formatTime2(ts);
    ts.setDate(ts.getDate() + 31);
    var end = util.formatTime2(ts);

    let user = getApp().globalData.user
    let simpleUser = {
      id: user.id,
      name: user.name,
      phone_number: user.phone_number,
      address: user.address,
      address_detail: user.address_detail,
      lat: user.lat,
      lng: user.lng,
    }

    var locationMarker
    if (simpleUser.address && simpleUser.lat && simpleUser.lng) {
      locationMarker = {}
      locationMarker.latitude = simpleUser.lat
      locationMarker.longitude = simpleUser.lng
      locationMarker.address = simpleUser.address
    }
    this.setData({
      date: start,
      startDate: start,
      endDate: end,
      user: simpleUser,
      locationMarker,
      items: ServiceTypes,
      serviceTargets: ServiceTargets,
    })
  },

  chooseLocation: function () {
    if (this.data.requesting || this.data.reserveSuccessed) {
      return;
    }
    var that = this
    wx.chooseLocation({
      success: function (res) {
        var locationMarker = that.data.locationMarker || {}
        locationMarker.latitude = res.latitude
        locationMarker.longitude = res.longitude
        locationMarker.address = res.address
        that.setData({
          locationMarker
        })
      },
      fail: function (e) {
        Toast.showWarnToast('选取位置失败')
      }
    })
  },

  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },

  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },

  reverseSubmit: function (e) {
    var formData = e.detail.value;
    if (!this.isValid(formData)) {
      return;
    }
    let checkChange = this.checkBaseInfo(formData)
    if (!checkChange) {
      this.doReverse(formData);
    }else {
      let that = this
      wx.showModal({
        title: '是否更新?',
        content: '基本信息有变，是否进行更新？',
        cancelText: '不更新',
        confirmText: '更新',
        success: function (res) {
          if (!res.confirm && res.cancel) {
            that.doReverse(formData)
            return
          }
          Toast.showLoading("请求更新中...")
          checkChange['id'] = that.data.user.id
          wx.request({
            url: config.service.updateUser,
            data: checkChange,
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            success: function (res) {
              wx.hideLoading()
              if (res.data.code == 0) {
                getApp().updateUser(checkChange)
                Toast.showSuccessToast("更新成功")
                that.doReverse(formData)
              } else {
                Toast.showFailToast(res.data.msg)
              }
            },
            fail: function (res) {
              wx.hideLoading()
              Toast.showFailToast('更新失败')
            },
            complete: function (res) {
            },
          })
        }
      })
    }
  },

  checkBaseInfo: function (formData) {
    let user = this.data.user
    let locationMarker = this.data.locationMarker
    let temp = {}
    let hasChanges = false
    if(user.name !== formData.user_name){
      temp['name'] = formData.user_name
      hasChanges = true
    }
    if (user.phone_number !== formData.phone_number) {
      temp['phone_number'] = formData.phone_number
      hasChanges = true
    }
    if (user.address_detail !== formData.address_detail) {
      temp['address_detail'] = formData.address_detail
      hasChanges = true
    }
    if (user.address !== locationMarker.address) {
      temp['address'] = locationMarker.address
      hasChanges = true
    }
    if (user.lat !== locationMarker.latitude) {
      temp['lat'] = locationMarker.latitude
      hasChanges = true
    }
    if (user.lng !== locationMarker.longitude) {
      temp['lng'] = locationMarker.longitude
      hasChanges = true
    }
    return hasChanges ? temp : null
  },

  doReverse: function (formData) {
    var that = this;
    this.setData({
      requesting: true
    })
    let data = {
      userID: getApp().globalData.user.id,
      userName: formData.user_name,
      phoneNumber: formData.phone_number,
      message: formData.message,
      address: this.data.locationMarker.address,
      addressDetail: formData.address_detail,
      lat: this.data.locationMarker.latitude,
      lng: this.data.locationMarker.longitude,
      reservationTime: formData.date + ' ' + formData.time,
      serviceType: this.data.serviceTypes.id,
      serviceTypeDesc: this.data.serviceTypes.name,
      serviceTargetID: this.data.serviceTarget.id
    }
    wx.request({
      url: config.service.reverseUrl,
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        if (res.data.code == 0) {
          Toast.showSuccessToast('预约成功')
          that.setData({
            reserveSuccessed: true
          })
          if (typeof res.data.data === 'object' && res.data.data.reservation) {
            getApp().setUserCurrentReservation(res.data.data.reservation)
          }
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
  },

  isValid: function (formData) {
    let locationMarker = this.data.locationMarker
    if (formData.user_name == '') {
      Toast.showWarnToast("请输入姓名");
      return false;
    } else if (formData.phone_number == '') {
      Toast.showWarnToast("请输入手机号");
      return false;
    } else if (!verifys.mobileValidate(formData.phone_number)) {
      Toast.showWarnToast("手机号不正确");
    } else if (!locationMarker || !locationMarker.address || !locationMarker.latitude) {
      Toast.showWarnToast("请选择所有位置");
      return false;
    } else if (!formData.address_detail) {
      Toast.showWarnToast("请输入位置详情");
      return false;
    } else if (this.data.serviceTypeEnable && this.data.serviceTypes.id === 0) {
      Toast.showWarnToast("请选择服务类型");
      return false;
    } else if (this.data.serviceTarget.id === 0) {
      Toast.showWarnToast("请选择服务对象");
      return false;
    } else if (formData.time == '' || formData.date == '') {
      Toast.showWarnToast("请选择预约时间");
      return false;
    }
    return true;
  },

  serviceTypeChange: function (e) {
    let ids = 0;
    e.detail.value.map(v => {
      ids += new Number(v)
    })
    this.setData({
      serviceTypes: {
        id: ids,
        name: getServiceTypeName(ids)
      }
    })
  },
  serviceTargetChange: function(e){
    let id = Number(e.detail.value)
    this.setData({
      serviceTarget: {
        id,
        name: getServiceTargetName(id)
      }
    })
  }
})