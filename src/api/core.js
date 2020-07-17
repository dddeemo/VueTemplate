import Vue from 'vue'
import axios from 'axios'
import { VueAxios } from './axios'
import store from '@/Vuex/index'

function getQueryVariable (variable) {
  let num = window.location.href.indexOf('?')
  let query = window.location.href.substr(num + 1)
  let vars = query.split("&");
  for (let i=0; i < vars.length; i++) {
    let pair = vars[i].split("=");
    if(pair[0] == variable){
      sessionStorage.setItem('token', pair[1])
      return pair[1];
    }
  }
  return(false);
}
// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.API_BASE_URL,
  timeout: 30000 // 请求超时时间
})

const err = (error) => {
  if (error.message.includes('timeout')) {
    alert('网络超时')
  }
  if (error.response) {
    const data = error.response.data
    const token = Vue.ls.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      alert(data.message)
    }
    
  }
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(config => {
  config.headers['token'] = getQueryVariable('token') || sessionStorage.getItem('token')
  config.params['token'] = getQueryVariable('token') || sessionStorage.getItem('token')
  return config
}, err)

// response interceptor
service.interceptors.response.use((response) => {
  store.commit('SAVE_SERVER_TIME', new Date(response.headers.date))
  if (response.data.code && response.data.code === '0000') {
    return response.data.data
  } else if (response.data.code && response.data.code !== '0000') {
    throw new Error(response.data.msg)
  }
}, err)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}
