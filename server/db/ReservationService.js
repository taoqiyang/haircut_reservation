const {mysql} = require('../qcloud')
const debug = require('debug')('koa-weapp-demo')

function getStatusTimeAndUserColumn(status) {
    status = Number(status)
    switch (status) {
        case 1:
            return null
        case 2:
            return {
                time: 'accept_time',
                user: 'accept_user_id'
            }
        case 4:
            return null
        case 7:
            return {
                time: 'deny_time',
                user: 'deny_user_id'
            }
        case 9:
            return {
                time: 'service_start_time',
                user: 'service_user_id'
            }
        case 10:
            return {
                time: 'finish_time',
                user: 'finish_user_id'
            }
        default :
            return null
    }
}

function getReservationStatusDesc(status) {
    status = Number(status)
    switch (status) {
        case 1:
            return '预约中'
        case 2:
            return '已接单'
        case 4:
            return '已取消'
        case 7:
            return '拒绝接单'
        case 9:
            return '处理中'
        case 10:
            return '已完成'
        case 11:
            return '已过期'
        default :
            return '无此状态'
    }
}

let ServiceTargets = [
    {
        id: 1,
        name: '小孩',
        cost: 30
    },
    {
        id: 1 << 1,
        name: '大人',
        cost: 40
    },
    {
        id: 1 << 2,
        name: '老人',
        cost: 20
    }
]

let getServiceTargetDescAndCost = serviceTargetID => {
    let temp = {desc: '', cost: 0}
    if (serviceTargetID === 0){
        return temp
    }
    ServiceTargets.map(item => {
        if (serviceTargetID & item.id) {
            if (temp.desc === '' && temp.cost === 0) {
                temp.desc = item.name
                temp.cost = item.cost
            } else {
                temp.desc += " + " + item.name
                temp.cost += item.cost
            }
        }
    })
    return temp
}

function addReservation(reservation) {
    // reservation['reservation_time'] = new Date();
    reservation['status'] = 1;
    reservation['status_desc'] = getReservationStatusDesc(1);
    return mysql('cReservation').returning('id').insert(reservation)
}

function getCurrentReservationOfUser(userID) {
    return mysql('cReservation').where({user_id: userID}).andWhere('status', 'in', [1, 2, 9]).first()
        .then(reservation => {
            if(reservation && reservation.status === 1 && reservation.reservation_time.getTime() <= new Date().getTime()){
                //如果当前时间已经超过预约时间，则无效了
                return updateReservationByID(reservation.id, {
                    status: 11,
                    status_desc: getReservationStatusDesc(11)
                }).then(num => {
                    return null
                })
            }else{
                return reservation
            }
        })
}

function getReservationByID(id) {
    return mysql('cReservation').where('id', id).first()
}

function updateReservationByID(id, data) {
    return mysql('cReservation').update(data).where('id', id)
}

function getReservationOfUserByPage(userID, page, pageSize) {
    return mysql('cReservation').where('user_id', userID).orderBy("id", "desc").limit(pageSize).offset((page - 1) * pageSize)
}

function adminQueryReservation(userID, status, isMy, page, pageSize) {
    var sql = mysql('cReservation').where('status', status).orderBy("reservation_time", "asc").limit(pageSize).offset((page - 1) * pageSize);
    sql.andWhere("reservation_time", '>', new Date())
    if (isMy && status !== '1' && status !== '4') {
        sql.andWhere(function () {
            this.where('deny_user_id', userID).orWhere('accept_user_id', userID).orWhere('service_user_id', userID).orWhere('finish_user_id', userID)
        })
    }
    return sql
}

module.exports = {
    getCurrentReservationOfUser,
    addReservation,
    getReservationByID,
    getReservationStatusDesc,
    updateReservationByID,
    getReservationOfUserByPage,
    adminQueryReservation,
    getStatusTimeAndUserColumn,
    getServiceTargetDescAndCost
}