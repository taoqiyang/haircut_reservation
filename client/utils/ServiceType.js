let ServiceTypes = [
  {
    id: 1,
    name: '理发'
  },
  {
    id: 1 << 1,
    name: '护发'
  },
  {
    id: 1 << 2,
    name: '染发'
  },
  {
    id: 1 << 3,
    name: '烫发'
  },
]

let getServiceTypeName = serviceType => {
  let newName = ''
  if(serviceType == 0){
    return newName
  }
  ServiceTypes.map(item => {
    if (serviceType & item.id) {
      if (newName === '') {
        newName = item.name
      } else {
        newName += " + " + item.name
      }
    }
  })
  return newName
}


module.exports = { ServiceTypes, getServiceTypeName }