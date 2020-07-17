<template>
  <div id="app">
    <transition name="router-fade" mode="out-in">
      <keep-alive v-if="$route.meta.keepAlive">
        <router-view></router-view>
      </keep-alive>
    </transition>
    <transition name="router-fade" mode="out-in">
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'App',
  data () {
    return {
      
    }
  },
}
</script>

<style lang="less" scoped>
#app {
  
  .router-fade-enter-active {
    transition: opacity 0.4s;
  }

  .router-fade-enter, .router-fade-leave-active {
    opacity: 0;
  }
}
</style>