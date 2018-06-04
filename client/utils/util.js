let timeago = require("../vendor/timeago/src/timeago.js");
const timeagoInstance = timeago(null, 'zh_CN'); 

const formatTime = date => {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  // var second = date.getSeconds()
  return [year, month, day].join('-') + " " + [hour, minute].map(n => {
    n = n.toString()
    return n[1] ? n : '0' + n
  }).join(':')
}

const formatTime2 = date => {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  // var hour = date.getHours()
  // var minute = date.getMinutes()
  // var second = date.getSeconds()
  return [year, month, day].join('-')
}

const formatTimeSimple = date => {
  return timeagoInstance.format(date);
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 显示繁忙提示
var showBusy = text => wx.showToast({
    title: text,
    icon: 'loading',
    duration: 10000
})

// 显示成功提示
var showSuccess = text => wx.showToast({
    title: text,
    icon: 'success'
})

// 显示失败提示
var showModel = (title, content) => {
    wx.hideToast();

    wx.showModal({
        title,
        content: JSON.stringify(content),
        showCancel: false
    })
}

module.exports = { formatTime, formatTime2, formatTimeSimple, showBusy, showSuccess, showModel }
