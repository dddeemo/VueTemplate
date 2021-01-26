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

export const isWeiXin = () => {
  return window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger';
}
export const getQueryVariable = (variable) => {
  let num = window.location.href.indexOf('?')
  let query = window.location.href.substr(num + 1)
  let vars = query.split("&");
  for (let i=0; i < vars.length; i++) {
    let pair = vars[i].split("=");
    if(pair[0] == variable){
      return pair[1];
    }
  }
  return(false);
}