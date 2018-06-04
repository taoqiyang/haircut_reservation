let formatNumbers = numbers => {
    return numbers.map(n => {
        n = n.toString()
        return n[1] ? n : '0' + n
    })
}

const formatTime = date => {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()
    return formatNumbers([year, month, day]).join('-') + " " + formatNumbers([hour, minute, second]).join(':')
}

const formatTime2 = date => {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    // var second = date.getSeconds()
    return formatNumbers([year, month, day]).join('-') + " " + formatNumbers([hour, minute]).join(':')
}


module.exports = { formatTime, formatTime2}
