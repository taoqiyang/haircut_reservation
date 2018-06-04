//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')
var util = require('utils/util.js')
var Toast = require('utils/Toast.js')

function doSomeInit(){
  Object.prototype.clone = function () {
    var Constructor = this.constructor;
    var obj = new Constructor();
    for (var attr in this) {
      if (this.hasOwnProperty(attr)) {
        if (typeof (this[attr]) !== "function") {
          if (this[attr] === null) {
            obj[attr] = null;
          }
          else {
            obj[attr] = this[attr].clone();
          }
        }
      }
    }
    return obj;
  };
  /* Method of Array*/
  Array.prototype.clone = function () {
    var thisArr = this.valueOf();
    var newArr = [];
    for (var i = 0; i < thisArr.length; i++) {
      newArr.push(thisArr[i].clone());
    }
    return newArr;
  };
  /* Method of Boolean, Number, String*/
  Boolean.prototype.clone = function () { return this.valueOf(); };
  Number.prototype.clone = function () { return this.valueOf(); };
  String.prototype.clone = function () { return this.valueOf(); };
  /* Method of Date*/
  Date.prototype.clone = function () { return new Date(this.valueOf()); };
  /* Method of RegExp*/
  RegExp.prototype.clone = function () {
    var pattern = this.valueOf();
    var flags = '';
    flags += pattern.global ? 'g' : '';
    flags += pattern.ignoreCase ? 'i' : '';
    flags += pattern.multiline ? 'm' : '';
    return new RegExp(pattern.source, flags);
  };

  // Number.prototype.pad = function(n){
  //   let len = this.toString().length;
  //   let ret = this
  //   while (len < n) {
  //     ret = "0" + ret;
  //     len++;
  //   }
  //   return ret;
  // }
}

App({
  login: function(onSuccess, onFail, onComplete) {
    var that = this
    this.globalData.logining = true
    // 调用登录接口
    qcloud.login({
      success: function (result) {
        if (result) {
          // util.showSuccess('登录成功')
          console.log('登录成功')
          that.globalData.user = result
          that.globalData.logining = false
          if(onSuccess && typeof onSuccess === 'function'){
            onSuccess(result)
          }
          if (onComplete && typeof onComplete === 'function') {
            onComplete(true)
          }
        } else {
          // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
          qcloud.request({
            url: config.service.userUrl,
            login: true,
            success: function (result) {
              // util.showSuccess('登录成功')
              console.log('获取用户信息完成:' + result.data)
              let success = result.data.code === 0
              that.globalData.user = result.data.data
              that.globalData.logining = false
              if (success && onSuccess && typeof onSuccess === 'function') {
                onSuccess(result.data.data)
              } else if (!success && onFail && typeof onFail === 'function') {
                onFail(result.data.msg ? result.data.msg : '登录异常')
              }
              if (onComplete && typeof onComplete === 'function') {
                onComplete(success)
              }
            },
            fail: function (error) {
              // util.showModel('请求失败', error)
              console.log('request fail', error)
              that.globalData.logining = false
              if (onFail && typeof onFail === 'function') {
                onFail(error)
              }
              if (onComplete && typeof onComplete === 'function') {
                onComplete(false)
              }
            }
          })
        }
      },
      fail: function (error) {
        // util.showModel('登录失败', error)
        console.log('登录失败', error)
        that.globalData.logining = false
        if (onFail && typeof onFail === 'function') {
          onFail(error)
        }
        if (onComplete && typeof onComplete === 'function') {
          onComplete(false)
        }
      }
    })
  },
  
  onLaunch: function () {
    qcloud.setLoginUrl(config.service.loginUrl)
    doSomeInit()
    // this.login()
    // var that = this
    // wx.onNetworkStatusChange(function(res){
    //   if(!that.globalData.user && res.isConnected){
    //     that.login()
    //   }
    // })
  },

  setUserCurrentReservation: function(reservation){
    if(this.globalData.user && reservation){
      this.globalData.user['currentReservation'] = reservation
    }
  },

  removeUserCurrentReservation: function(){
    if (this.globalData.user && this.globalData.user.currentReservation){
      delete this.globalData.user.currentReservation
    }
  },

  updateUser: function(changing) {
    let user = this.globalData.user
    for(let key in changing){
      user[key] = changing[key]
    }
  },

  suChangeUser: function(admin){
    Toast.showLoading("切换至" + (admin ? "管理员": "用户") + "模式")
    wx.request({
      url: config.service.suUser,
      data: {
        userID: getApp().globalData.user.id,
        admin: admin ? 1 : 0
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        wx.hideLoading()
        if (res.data.code === 0) {
          wx.reLaunch({
            url: '/pages/index',
          })
          Toast.showSuccessToast(res.data.msg)
        }else{
          Toast.showFailToast(res.data.msg)
        }
      },
      fail: function (res) {
        wx.hideLoading()
        Toast.showFailToast()
      },
    })
  },

  globalData: {
    logining: false,
    user: null
  }
})