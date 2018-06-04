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

let getServiceTargetName = serviceTarget => {
  let newName = ''
  if (serviceTarget === 0){
    return newName
  }
  ServiceTargets.map(item => {
    if (serviceTarget & item.id) {
      if (newName === '') {
        newName = item.name
      } else {
        newName += " + " + item.name
      }
    }
  })
  return newName
}


module.exports = { ServiceTargets, getServiceTargetName }