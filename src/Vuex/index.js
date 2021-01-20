import Vue from 'vue'
import Vuex from 'vuex'
import {getWxConfig} from '@/api/request'
import wx from 'weixin-js-sdk'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isShowMask: false,
    wxState: false,
    canUseWxOpen: false
  },
  mutations: {
    controlMask (state, payload) {
      state.isShowMask = payload.isShowMask
    },
    wxInit (state, payload) {
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: payload.appid, // 必填，公众号的唯一标识
        timestamp: payload.timestamp, // 必填，生成签名的时间戳
        nonceStr: payload.nonceStr, // 必填，生成签名的随机串
        signature: payload.signature,// 必填，签名
        jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData'], // 必填，需要使用的JS接口列表
        openTagList: ['wx-open-launch-app']
      });
      wx.ready(() => {
        state.wxState = true
        wx.checkJsApi({
          jsApiList: ['wx-open-launch-app'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
          success: (res) => {
            state.canUseWxOpen = true
          },
          fail: (err) => {
            // alert(err, '不可用')
            state.canUseWxOpen = false
          }
        })
      });
      wx.error((res) => {
        console.log(res)
        state.wxState = false
      });
    }
  },
  actions: {
    getWxConfig (context) {
      getWxConfig({
        url: window.location.href.split('#')[0]
      }).then(res => {
        console.log(res)
        context.commit('wxInit', res.data)
      }).catch(e => {
        console.log(e)
      })
    }
  }
})