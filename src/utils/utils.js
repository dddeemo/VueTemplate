export const judgeEquipment = () => {
  let equipmentType = ""
  let agent = navigator.userAgent.toLowerCase()
  let android = agent.indexOf("android")
  let iphone = agent.indexOf("iphone")
  let ipad = agent.indexOf("ipad")
  if(android != -1){
      equipmentType = "android"
  }
  if(iphone != -1 || ipad != -1){
      equipmentType = "ios"
  }
  return equipmentType
}