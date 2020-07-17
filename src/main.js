// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './Vuex/index'
import VueConfig from './config/VueConfig'
import './assets/css/common.less'
import '@/assets/js/rem'
import toastMessage from './components/ToastMessage'
Vue.use(toastMessage)

Vue.use(VueConfig)

Vue.config.productionTip = false

global.Form = function (data, opt = {}) {
  let queryString = ''
  let form = typeof URLSearchParams !== 'undefined' ? new URLSearchParams() : new FormData()
  if (data) {
    for (let i in data) {
      if ((data[i] === null || data[i] === undefined) && opt.ignore) continue
      if (data[i] instanceof Array) {
        for (let j = 0; j < data[i].length; j++) {
          queryString = queryString + (i + (opt.arrayKey || '') + '=' + (data[i][j] === undefined ? '' : data[i][j]) + '&')
          form.append(i + (opt.arrayKey || ''), (data[i][j] === undefined ? '' : data[i][j]))
        }
      } else {
        queryString = queryString + (i + '=' + data[i] + '&')
        form.append(i, (data[i] === undefined ? '' : data[i]))
      }
    }
  }
  form.queryString = function () {
    return queryString.length > 0 ? queryString.substr(0, queryString.length - 1) : ''
  }
  return form
}

/* eslint-disable no-new */
global._vm = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
