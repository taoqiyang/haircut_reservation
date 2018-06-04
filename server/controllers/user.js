let userService = require('../db/UserService')
const loginLogService = require('../db/LoginLogService')
const debug = require('debug')('koa-weapp-demo')
let user = async (ctx, next) => {
    // 通过 Koa 中间件进行登录态校验之后
    // 登录信息会被存储到 ctx.state.$wxInfo
    // 具体查看：
    if (ctx.state.$wxInfo.loginState === 1) {
        // loginState 为 1，登录态校验成功
        // ctx.state.data = ctx.state.$wxInfo.userinfo
        let user = await userService.getUserByOpenID(ctx.state.$wxInfo.userinfo.openId, true)
        if(user){
            if(!user.admin){
                delete user.admin
            }
            await loginLogService.addLog(user.id, "user")
            ctx.state.code = 0
            ctx.state.data = user
            ctx.state.data['time'] = Math.floor(Date.now() / 1000)
        }else{
            ctx.state.msg = "找不到对应用户"
        }
    } else {
        ctx.state.msg = "服务器异常"
    }
}

async function updateUser(ctx, next) {
    let changes = ctx.request.body
    let id = changes.id
    delete changes.id
    await userService.updateUser(id, changes)
        .then(num => {
            if(num === 1){
                ctx.state.code = 0
                ctx.state.msg = "更新成功"
                debug("更新成功 user:" + id)
            }
        }).catch(e => {
            ctx.state.msg = "更新失败"
            debug("更新失败:" + e)
        })
}

async function suUser(ctx, next) {
    let {userID, admin} = ctx.request.body
    if(!userID || !admin){
        ctx.state.msg = "缺少参数"
        debug("缺少参数: " + ctx.request.body)
        return
    }
        await userService.updateUser(userID, {admin})
        .then(num => {
            if(num === 1){
                ctx.state.msg = "角色切换成功"
                ctx.state.code = 0
            }
        })
}


module.exports = {
    user,
    updateUser,
    suUser
}
