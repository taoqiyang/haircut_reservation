const {mysql} = require('../qcloud')
const debug = require('debug')('koa-weapp-demo')
const reservationService = require('./ReservationService')

function addUser(user) {
    return mysql('cUser').returning('id').insert(user)
}

function getUserByOpenID(openID, needUserCurrentReservation) {
    return mysql('cUser').where({open_id: openID}).first()
        .then(user => {
            return initUserCurrentReservation(user, needUserCurrentReservation)
        })
}

function initUserCurrentReservation(user, needLastReservation) {
    if(!user || !needLastReservation || user.admin){
        return user;
    }
    return reservationService.getCurrentReservationOfUser(user.id)
        .then(reservation => {
            if(reservation && reservation.valid){
                user['currentReservation'] = reservation
            }
            return user;
        })
}

function getUserByID(userID, needUserCurrentReservation) {
    return mysql('cUser').where('id', userID).first()
        .then(user => {
            return initUserCurrentReservation(user, needUserCurrentReservation)
        })
}

function updateUser(id, changes) {
    return mysql('cUser').update(changes).where('id', id)
}

module.exports = {
    getUserByOpenID,
    getUserByID,
    addUser,
    updateUser
}