import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isShowMask: false
  },
  mutations: {
    controlMask (state, payload) {
      state.isShowMask = payload.isShowMask
    }
  }
})