import Vue from 'vue'
import axios from 'axios'
import { VueAxios } from './axios'

// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.API_BASE_URL,
  timeout: 30000 // 请求超时时间
})

const service2 = axios.create({
  baseURL: process.env.API_BASE_URL_2,
  timeout: 30000 // 请求超时时间
})

const err = (error) => {
  if (error.message.includes('timeout')) {
    alert('网络超时')
  }
  if (error.response) {
    const data = error.response.data
    if (error.response.status === 403) {
      alert(data.message)
    }
    
  }
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(config => {
  return config
}, err)
service2.interceptors.request.use(config => {
  return config
}, err)

// response interceptor
service.interceptors.response.use((response) => {
  if (response.data.code && response.data.code === '0000') {
    return response.data
  } else if (response.data.code && response.data.code !== '0000') {
    throw new Error(response.data.msg)
  }
}, err)
service2.interceptors.response.use((response) => {
  if (response.data.code && response.data.code === '0000') {
    return response.data
  } else if (response.data.code && response.data.code !== '0000') {
    throw new Error(response.data.msg)
  }
}, err)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, service, service2)
  }
}

export {
  installer as VueAxios,
  service as axios,
  service2 as axios2
}
