<template>
  <div class="wxOpen">
    <p>{{text}}</p>
    <div class="wrap">
      <wx-open-launch-app
        id="launch-btn"
        appid="wxc2499f5f82aebb1d"
        @ready="openLabelReady"
        @error="handleErrorFn"
        @launch="handleLaunchFn"
        >
        <script type="text/wxtag-template">
          <style>.btn {font-size: 30px; text-align: center; width: 10000px; height: 100px; color: transparent}
          </style>
            <div class="btn"></div>
        </script>
      </wx-open-launch-app>
    </div>
  </div>
</template>
<script>
export default {
  name: 'wxOpenApp',
  data () {
    return {

    }
  },
  props: {
    text: {
      type: String,
      default: '打开宝姐家App'
    }
  },
  methods: {
    openLabelReady () {
      console.log('ready')
    },
    // 监听error 函数
    handleErrorFn (e) {
      // 跳转失败
      console.log(JSON.stringify(e), '跳转失败')
      if (this.judgeEquipment() == 'ios') {
        window.location.href = 'https://apps.apple.com/cn/app/id1073905498'
      } else {
        window.location.href = 'https://www.bojem.com/app'
      }
    },
    // 监听launch 函数
    handleLaunchFn (e) {
      // 跳转成功
      console.log(JSON.stringify(e), '跳转成功')
    },
  }
}
</script>
<style lang="less" scoped>
 #launch-btn{
   position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
 }
 .wxOpen{
   position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
 }
</style>