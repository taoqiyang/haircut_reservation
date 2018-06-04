const {mysql} = require('../qcloud')
const debug = require('debug')('koa-weapp-demo')
let {formatTime2} = require('../util/Date')
let reservationService = require('../db/ReservationService')
let userService = require('../db/UserService')


async function reserve(ctx, next) {
    let {userID, userName, phoneNumber, message, country, province, city, address, addressDetail, lat, lng, serviceType, serviceTypeDesc, reservationTime, serviceTargetID} = ctx.request.body
    let reservation = {
        user_id: userID,
        user_name: userName,
        phone_number: phoneNumber,
        address: address,
        address_detail: addressDetail,
        lat: lat,
        lng: lng,
        reservation_time: new Date(reservationTime),
        service_target: serviceTargetID
    }
    debug("必要参数:%o", reservation)

    for (var key in reservation) {
        if (!reservation[key] || reservation[key] === '') {
            ctx.state.code = -1;
            ctx.state.msg = '缺少参数:' + key;
            debug("缺少参数:%s", key)
            return;
        }
    }

    let currentReservation = await reservationService.getCurrentReservationOfUser(userID)
    if (currentReservation) {
        ctx.state.code = 100;
        ctx.state.msg = '已有预约订单';
        ctx.state.data = currentReservation;
        return
    }

    reservation['message'] = message;
    reservation['country'] = country;
    reservation['province'] = province;
    reservation['city'] = city;
    reservation['service_type'] = serviceType || 0;
    reservation['service_type_desc'] = serviceTypeDesc || "默认";

    let serviceDescAndCost = reservationService.getServiceTargetDescAndCost(Number(serviceTargetID))
    reservation['service_target_desc'] = serviceDescAndCost.desc;
    reservation['service_cost'] = serviceDescAndCost.cost;

    debug("所有字段:%o", reservation)

    await reservationService.addReservation(reservation)
        .then(id => {
            debug("添加预约成功:%o", id)
            return reservationService.getReservationByID(id)
        })
        .then(reservation => {
            ctx.state.code = 0;
            ctx.state.msg = '预约成功';
            ctx.state.data = {reservation}
        })
        .catch(e => {
            debug(e)
            ctx.state.code = -1;
            ctx.state.msg = '预约失败';
        })
}

/**
 * 获取用户当前的预约，理论上只会有一个进行中的
 */
async function currentReservation(ctx, next) {
    if (ctx.state.$wxInfo.loginState) {
        let userinfo = ctx.state.$wxInfo.userinfo.userinfo
        await userService.getUserByOpenID(userinfo.openId, false)
            .then(user => {
                return reservationService.getCurrentReservationOfUser(user.id)
            })
            .then(reservation => {
                ctx.code = 0
                ctx.msg = "success"
                ctx.data = reservation
            })
            .catch(e => {
                debug(e)
            })
    } else {
        ctx.state.code = -1
        ctx.state.msg = "登录失效，请退出小程序后重进"
    }
}

async function cancelReverse(ctx, next) {
    let {id, userID, needReturn} = ctx.request.body
    await reservationService.getReservationByID(id)
        .then(reservation => {
            if (reservation.user_id !== Number(userID)) {
                ctx.state.msg = "不是本人预约"
                debug("不是本人预约")
                return;
            }
            if (reservation.status !== 1) {
                ctx.state.code = 100
                ctx.state.msg = "预约状态异常"
                ctx.state.data = {reservation}
                debug("当前状态不能取消预约:" + reservation.status)
                return;
            }
            let updateData = {
                status: 4,
                status_desc: reservationService.getReservationStatusDesc(4),
                cancel_time: new Date()
            }
            return reservationService.updateReservationByID(id, updateData)
                .then(num => {
                    if (num === 1) {
                        ctx.state.code = 0
                        ctx.state.msg = "取消预约成功"
                        if (needReturn) {
                            reservation.status = updateData.status
                            reservation.status_desc = updateData.status_desc
                            reservation.cancel_time = updateData.cancel_time
                            ctx.data = reservation
                        }
                    } else {
                        debug("更新数据失败num:" + num)
                        ctx.state.msg = "取消预约失败"
                    }
                })
        })
        .catch(e => {
            debug(e)
        })
}

async function queryUserReservation(ctx, next) {
    let {userID, page = 1, pageSize = 10} = ctx.query
    if (!userID) {
        ctx.state.msg = "缺少用户标识参数"
        debug("缺少userID参数")
        return
    }
    await reservationService.getReservationOfUserByPage(userID, page, pageSize)
        // .andWhere('status', '<>', '1')
        .andWhere('status', 'not in', [1, 2, 9])
        .then(reservations => {
            let result = doSomeInitBeforReturn(reservations) || []
            ctx.state.code = 0
            ctx.state.data = {reservations: result}
        })
}

async function adminQueryReservation(ctx, next) {
    let {userID, status = 1, isMy = 'false', page = 1, pageSize = 10} = ctx.query
    if (!userID) {
        ctx.state.msg = "缺少用户标识参数"
        debug("缺少userID参数")
        return
    }
    await reservationService.adminQueryReservation(userID, status, isMy === 'true', page, pageSize)
        .then(reservations => {
            let result = doSomeInitBeforReturn(reservations) || []
            ctx.state.code = 0
            ctx.state.data = {reservations: result}
        })


}

function doSomeInitBeforReturn(reservations) {
    if(!reservations){
        return null
    }
    reservations.map(reservation => {
        reservation['code'] = pad(reservation.id, 10)
        for (let key in reservation) {
            if (reservation[key] && key.endsWith('_time')) {
                reservation[key] = formatTime2(reservation[key])
            }
        }
    })
    return reservations;
}

function pad(num, n) {
    var len = num.toString().length;
    while (len < n) {
        num = "0" + num;
        len++;
    }
    return num;
}


async function adminChangeStatus(ctx, next) {
    let {userID, reservationID, newStatus} = ctx.request.body
    if (!userID || !reservationID || !newStatus) {
        ctx.state.msg = "缺少参数"
        debug("缺少参数: " + ctx.request.body)
        return
    }

    let temp = reservationService.getStatusTimeAndUserColumn(newStatus)
    let updateData = {
        status: newStatus,
        status_desc: reservationService.getReservationStatusDesc(newStatus),
    }
    updateData[temp.time] = new Date()
    updateData[temp.user] = userID
    return reservationService.updateReservationByID(reservationID, updateData)
        .then(num => {
            if (num === 1) {
                ctx.state.code = 0
                ctx.state.msg = "状态变更成功"
            } else {
                debug("更新数据失败num:" + num)
                ctx.state.msg = "状态变更失败"
            }
        }).catch(e => {
            debug("更新数据失败" + e)
            ctx.state.msg = "状态变更失败"
        })

}




module.exports = {
    reserve,
    currentReservation,
    cancelReverse,
    queryUserReservation,
    adminQueryReservation,
    adminChangeStatus
}
