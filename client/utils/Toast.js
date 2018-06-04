let { loadingText, networkErrorText} = require('../config.js')
let showSuccessToast = title => {
  wx.showToast({
    title: title,
    icon: 'success'
  })
}

let showFailToast = title => {
  wx.showToast({
    title: title ? title : networkErrorText,
    image: '/images/icon_fail.png'
  })
}

let showWarnToast = title => {
  wx.showToast({
    title: title,
    image: '/images/icon_warn.png'
  })
}

let showLoading = title => {
  wx.showLoading({
    title: title ? title : loadingText,
    mask: true,
  })
}

module.exports = { showSuccessToast, showFailToast, showWarnToast, showLoading}