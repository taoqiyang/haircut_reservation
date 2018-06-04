const {mysql} = require('../qcloud')
const debug = require('debug')('koa-weapp-demo')


function addLog(user_id, mark) {
    return mysql('cLoginLog').insert({user_id, mark})
}




module.exports = {
    addLog,
}