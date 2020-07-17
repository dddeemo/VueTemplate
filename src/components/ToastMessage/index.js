import Vue from 'vue'
import vueToastMessage from './index.vue'

let ToastTem = Vue.extend(vueToastMessage)
let instance
let timer = null

let toastMessage = (options) => {
  if (!instance) {
    instance = new ToastTem()
    instance.vm = instance.$mount()
    console.log(instance)
    document.body.appendChild(instance.vm.$el)
  }
  console.log(options)
  if (timer) {
    clearTimeout(timer)
    timer = null
    instance.show = false
    instance.message = ''
  }
  let time = 3000
  if (typeof options === 'string') {
    instance.message = options
  } else if (typeof options === 'object') {
    let {message, time} = options
    instance.message = message
    time = time || 3000
  } else {
    return
  }
  instance.show = true
  timer = setTimeout(() => {
    instance.show = false
    clearTimeout(timer)
    timer = null
    instance.message = ''
  }, time)
}

toastMessage.close = () => {
  if (timer) {
    clearTimeout(timer)
    timer = null
    instance.show = false
    instance.message = ''
  }
}
export default toastMessage.install = (Vue) => {
  Vue.prototype.$toastMessage = toastMessage
}