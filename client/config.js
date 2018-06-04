/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
// var host = 'http://localhost:5757';
var host = 'https://119030051.haoxilifa.xyz'
// var host = 'http://cmquyomn.qcloud.la'
// 

var config = {
  serviceTypeEnable: false,

  loadingText: "拼命加载中...",
  networkErrorText: "啊哦..连接失败了~~!",
  pullRefreshNoNetworkText: "别扯了, 找个wifi先!",

  // 下面的地址配合云端 Demo 工作
  service: {
    host,

    // 登录地址，用于建立会话
    loginUrl: `${host}/weapp/login`,

    // 测试的请求地址，用于测试会话
    userUrl: `${host}/weapp/user`,

    // 测试的信道服务地址
    tunnelUrl: `${host}/weapp/tunnel`,

    // 上传图片接口
    uploadUrl: `${host}/weapp/upload`,
    reverseUrl: `${host}/weapp/reserve`,
    cancelReverse: `${host}/weapp/cancelReverse`,
    queryUserReservation: `${host}/weapp/queryUserReservation`,
    updateUser: `${host}/weapp/updateUser`,
    adminQueryReservation: `${host}/weapp/adminQueryReservation`,
    adminChangeStatus: `${host}/weapp/adminChangeStatus`,
    suUser: `${host}/weapp/suUser`,
  },
  //预约中1, 已接单2,已取消4,拒绝接单7,处理中9,已完成10
  reservation_status: [
    {
      name: '预约中',
      value: 1,
    },
    {
      name: '已取消',
      value: 4
    },
    {
      name: '已接单',
      value: 2,
      admin: true
    },
    {
      name: '拒绝接单',
      value: 7,
      admin: true
    },
    {
      name: '处理中',
      value: 9,
      admin: true
    },
    {
      name: '已完成',
      value: 10,
      admin: true
    },
  ]
};

module.exports = config;
