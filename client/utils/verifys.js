function mobileValidate(phone) {
  var re = /(^1[3|5|8|7][0-9]{9}$)/
  return re.test(phone)
}

module.exports = {
  mobileValidate: mobileValidate
}