// 登录授权接口
const userService = require('../db/UserService')
const loginLogService = require('../db/LoginLogService')
const debug = require('debug')('koa-weapp-demo')

module.exports = async (ctx, next) => {
    // 通过 Koa 中间件进行登录之后
    // 登录信息会被存储到 ctx.state.$wxInfo
    // 具体查看：
    if (ctx.state.$wxInfo.loginState) {
        //save user info if note exist
        // await saveUserIfNotExist(ctx.state.$wxInfo.userinfo)
        let userinfo = ctx.state.$wxInfo.userinfo.userinfo
        let open_id = userinfo.openId
        await userService.getUserByOpenID(open_id, true)
            .then(user => {
                if (!user) {
                    user = {
                        open_id,
                        name: userinfo.nickName,
                        nike_name: userinfo.nickName,
                        gender: userinfo.gender,
                        country: userinfo.country,
                        province: userinfo.province,
                        city: userinfo.city,
                        avatar_url: userinfo.avatarUrl
                    }
                    return userService.addUser(user)
                        .then(id => {
                            return userService.getUserByID(id, true)
                        })
                } else {
                    return user
                }
            })
            .then(user => {
                if(user){
                    return loginLogService.addLog(user.id, "login")
                        .then(temp => {
                            return user
                        })
                }else{
                    return null
                }
            })
            .then(user => {
                if (!user) {
                    ctx.state.code = -1;
                    ctx.state.msg = '服务器异常';
                } else {
                    if (!user.admin) {
                        delete user.admin
                    }

                    ctx.state.code = 0
                    ctx.state.data = {skey: ctx.state.$wxInfo.userinfo.skey, userinfo: user}
                    ctx.state.data['time'] = Math.floor(Date.now() / 1000)
                }
            }).catch(e => {
                ctx.state.code = -1;
                ctx.state.msg = '服务器异常';
                debug(e)
            })
    }
}
