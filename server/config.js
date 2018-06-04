const CONF = {
  port: '5757',
  rootPathname: '',

  // 微信小程序 App ID
  appId: 'wxb60e1ecbc97da594',

  // 微信小程序 App Secret
  appSecret: 'a7c9d4e48ec8a3aa00833293a8bcf6b2',

  // 是否使用腾讯云代理登录小程序
  useQcloudLogin: true,

  /**
   * MySQL 配置，用来存储 session 和用户信息
   * 若使用了腾讯云微信小程序解决方案
   * 开发环境下，MySQL 的初始密码为您的微信小程序 appid
   */
  mysql: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    db: 'cAuth',
    pass: 'DBA1ezhC',
    char: 'utf8mb4'
  },

  cos: {
    /**
     * 区域
     * 华北：cn-north
     * 华东：cn-east
     * 华南：cn-south
     * 西南：cn-southwest
     * 新加坡：sg
     * @see https://www.qcloud.com/document/product/436/6224
     */
    region: 'cn-south',
    // Bucket 名称
    fileBucket: 'qcloudtest',
    // 文件夹
    uploadFolder: ''
  },

  // 微信登录态有效期
  wxLoginExpires: 7200,
  wxMessageToken: 'abcdefgh',


 // 其他配置 ...local develop use
 //  serverHost: 'localhost',
 //  tunnelServerUrl: '',
 //  tunnelSignatureKey: '27fb7d1c161b7ca52d73cce0f1d833f9f5b5ec89',
 //  // 腾讯云相关配置可以查看云 API 秘钥控制台：https://console.cloud.tencent.com/capi
 //  qcloudAppId: '1255853687',
 //  qcloudSecretId: 'AKID78xd7hHPsIbmspILsIXaR7cyJXefk7e9',
 //  qcloudSecretKey: 'pUxDH8nKhsr4DAwe1IOHzysb8TfjcJxU',
 //  wxMessageToken: 'weixinmsgtoken',
 //  networkTimeout: 30000
}

 

module.exports = CONF
