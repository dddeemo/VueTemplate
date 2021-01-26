<template>
  <div class="home">
    <div class="liveWrap" @click="isWeiXin && canUseWxOpen ? '' : downLoad()">
      <wx-open-app v-if="isWeiXin && canUseWxOpen" :text="''" :extinfo="extinfo"></wx-open-app>
      <img :src="liveInfo.rectangle_cover_img" alt="">
      <div class="liveTips">
        <p>前往宝姐家APP，畅享超清直播体验</p>
        <p class="btn">前往宝姐家</p>
      </div>
    </div>
    <div class="logoWrap" @click="isWeiXin && canUseWxOpen ? '' : downLoad()">
      <wx-open-app v-if="isWeiXin && canUseWxOpen" :text="''" :extinfo="extinfo"></wx-open-app>
      <div class="bojem">
        <div class="logo">
          <img src="../../assets/images/bojem_logo.png" alt="">
        </div>
        <div class="bojemText">
          <p>宝姐家</p>
          <p>高端珠宝知识分享平台</p>
        </div>
      </div>
      <div class="enter">进入</div>
    </div>
    <div style="position: relative" @click="isWeiXin && canUseWxOpen ? '' : downLoad()">
      <wx-open-app v-if="isWeiXin && canUseWxOpen" :text="''" :extinfo="extinfo"></wx-open-app>
      <div v-if="liveInfo.status == 1" class="countDownWrap">
        <count-down :time="liveInfo.timeDiff * 1000" @finish="countDownFinished" format="距本场直播开始还剩：DD 天 HH 时 mm 分 ss 秒" />
      </div>
      <div v-else-if="liveInfo.status == 2" class="countDownWrap">
        <p style="color: #7B2C3F">{{liveInfo.dec}}</p>
      </div>
      <div v-else-if="liveInfo.status == 3" class="countDownWrap">
        <p style="color: #999">{{liveInfo.dec}}</p>
      </div>
    </div>
    <div class="moreLives" v-if="liveList.length">
      <p>更多精彩直播</p>
      <div class="liveList">
        <div class="live" v-for="(n, i) in liveList" :key="i">
          <div class="liveImgWrap">
            <div class="bookingIcon">
              <div class="clock"></div>
              <p>预约</p>
            </div>
            <img :src="n.rectangle_cover_img" alt="">
          </div>
          <div class="liveInfo">
            <div class="liveTitleWrap">
              <p class="liveTitle">{{n.name}}</p>
              <p>{{n.live_start_time | filterTime}}开始</p>
            </div>
            <div class="booking">
              <p>{{n.num}}人已预约</p>
              <p class="bookingBtn" v-if="isWeiXin && canUseWxOpen">立即预约<wx-open-app :text="''" :extinfo="extinfo"></wx-open-app></p>
              <p class="bookingBtn" v-else @click="downLoad">立即预约</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomBar" @click="isWeiXin && canUseWxOpen ? '' : downLoad()">
      <wx-open-app v-if="isWeiXin && canUseWxOpen" :text="''" :extinfo="extinfo"></wx-open-app>
      <div class="shoppingBag">
        <p>{{goodsNum || 0}}</p>
      </div>
      <div class="input">前往宝姐家APP参与互动</div>
      <div class="likeWrap">
        <div class="likes"><p>{{clickNum || 0}}</p></div>
        <div class="like"></div>
      </div>
    </div>
  </div>
</template>

<script>
import wx from 'weixin-js-sdk'
import { CountDown } from 'vant';
import {getLiveInfo} from '@/api/request'
import moment from 'moment'
import { mapState } from 'vuex'
import wxOpenApp from '@/components/WxOpenLaunchApp/index'
import {judgeEquipment, getQueryVariable} from '@/utils/utils'
export default {
  name: 'Home',
  data () {
    return {
      goodsNum: 0,
      clickNum: 0,
      liveInfo: {},
      liveList: [],
      liveId: '',
      extinfo: ''
    }
  },
  components: {
    CountDown, wxOpenApp
  },
  computed: {
    isWeiXin () {
      return window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger';
    },
    ...mapState({
      canUseWxOpen: state => state.canUseWxOpen,
    })
  },
  watch: {
    '$store.state.wxState' (val) {
      if (val) {
        this.wxInit()
      }
    }
  },
  filters: {
    filterTime (val) {
      if (val) {
        return moment(val * 1000).format("M月D日  kk:mm")
      }
    }
  },
  async mounted () {
    this.liveId = await this.getLiveId().catch(e => {
      console.log(e)
    })
    if (this.liveId) {
      this.getLiveInfo()
    }
  },
  methods: {
    countDownFinished () {
      this.getLiveInfo()
    },
    getLiveId () {
      return new Promise((resolve, reject) => {
        let liveId = getQueryVariable('liveId')
        if (liveId) {
          resolve(liveId)
        } else {
          reject('no liveId')
        }
      })
    },
    downLoad () {
      if (judgeEquipment() == 'ios') {
        window.location.href = 'https://apps.apple.com/cn/app/id1073905498'
      } else {
        window.location.href = 'https://www.bojem.com/app'
      }
    },
    getLiveInfo () {
      getLiveInfo({
        liveId: this.liveId
      }).then(res => {
        console.log(res)
        let data = res.data
        this.clickNum = data.clickNum
        this.goodsNum = data.goodsNum
        this.liveList = data.liveList
        this.liveInfo = data.liveInfo
        document.title = data.liveInfo.name
        this.extinfo = JSON.stringify({
          type: this.liveInfo.status == 2 ? 2 : 1,
          session: this.liveInfo.id,
          streamUrl: this.liveInfo.stream_url
        })
      }).catch(e => {
        console.log(e)
      })
    },
    wxInit (data) {
      wx.ready(() => {
        wx.updateAppMessageShareData({ 
          title: this.liveInfo.name, // 分享标题
          desc: this.liveInfo.intro, // 分享描述
          link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: this.liveInfo.main_image, // 分享图标
          success: () => {
            // 设置成功
          }
        })
        wx.updateTimelineShareData({ 
          title: this.liveInfo.name, // 分享标题
          link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: this.liveInfo.main_image, // 分享图标
          success: function () {
            // 设置成功
          }
        })
      });
      wx.error((res) => {
        console.log(res)
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
      });
    },
  }
}
</script>
<style lang="less" scoped>
  .home{
    width: 100%;
    moz-user-select: -moz-none;
    -moz-user-select: none;
    -o-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;

    .liveWrap{
      position: relative;
      width: 100%;
      height: 4rem;
      >img{
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .liveTips{
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
        background: rgba(0,0,0,0.7);

        p{
          font-size: 0.3rem;
          color: #fff;
          text-align: center;
          line-height: 1;
        }
        p:first-child{
          margin: 1.25rem auto 0.36rem;
        }
        .btn{
          position: relative;
          width: 2.5rem;
          line-height: 0.68rem;
          border: 0.02rem solid #fff;
          border-radius: 0.34rem;
          margin: 0 auto;
        }
      }
    }
    .logoWrap{
      position: relative;
      height: 1.38rem;
      padding: 0 0.3rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 0.2rem solid #F5F5F5;
      .bojem{
        display: flex;
        .logo{
          width: 0.9rem;
          height: 0.9rem;

          img{
            display: block;
            width: 100%;
            height: 100%;
          }
        }
        .bojemText{
          margin-left: 0.2rem;

          p:first-child{
            font-size: 0.3rem;
            color: #000;
            margin-bottom: 0.04rem;
          }
          p:last-child{
            font-size: 0.26rem;
            color: #999;
          }
        }
        
      }
      .enter{
        position: relative;
        flex-shrink: 0;
        width: 1.56rem;
        height: 0.6rem;
        border: 0.02rem solid #7B2C3F;
        color: #7B2C3F;
        font-size: 0.3rem;
        text-align: center;
        line-height: 0.6rem;
        border-radius: 0.3rem;
        overflow: hidden;
      }
    }
    .countDownWrap{
      padding: 0.66rem 0;
      text-align: center;
      p{
        font-size: 0.28rem;
        
      }
      /deep/ .van-count-down{
        font-size: 0.28rem;
        color: #7B2C3F;
        font-family: Helvetica Neue,Consolas, Monaco, monospace;
      }
    }
    .moreLives{
      padding: 0.1rem 0.3rem;
      margin-bottom: 1.6rem;
      >p {
        font-size: 0.3rem;
        color: #000000;
        margin-bottom: 0.23rem;
      }
      .liveList{
        .live{
          position: relative;
          display: flex;
          margin-bottom: 0.6rem;

          .liveImgWrap{
            position: relative;
            flex-shrink: 0;
            width: 3rem;
            height: 1.92rem;
            border-radius: 0.15rem;
            overflow: hidden;
            .bookingIcon{
              display: flex;
              justify-content: center;
              align-items: center;
              position: absolute;
              left: 0;
              top: 0;
              width: 1.13rem;
              height: 0.46rem;
              background: linear-gradient(90deg, #419AF7 0%, #59C8FA 100%);
              opacity: 1;
              border-radius: 0.15rem 0 0.15rem 0;
              font-size: 0.24rem;
              color: #fff;
              line-height: 0.46rem;

              .clock{
                width: 0.25rem;
                height: 0.22rem;
                background: url(../../assets/images/clock_share.png) no-repeat;
                background-size: 100%;
                margin-right: 0.08rem;
              }
            }
            img{
              display: block;
              object-fit: cover;
              width: 100%;
              height: 100%;
            }
          }
          .liveInfo{
            margin-left: 0.17rem;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .liveTitleWrap {
              .liveTitle{
                font-size: 0.3rem;
                color: #000;
                margin-bottom: 0.12rem;
              }
              >p{
                font-size: 0.26rem;
                color: #383838;
              }
            }
            .booking{
              display: flex;
              justify-content: space-between;
              align-items: flex-end;

              >p:first-child{
                font-size: 0.22rem;
                color: #999999;
                margin-bottom: 0.02rem;
              }
              .bookingBtn{
                position: relative;
                color: #459CEE;
                font-size: 0.26rem;
                width: 1.56rem;
                height: 0.54rem;
                border-radius: 0.27rem;
                text-align: center;
                line-height: 0.54rem;
                border: 0.02rem solid #459CEE;
              }
            }
          }
        }
        .live::after{
          position: absolute;
          bottom: -0.3rem;
          content: "";
          width: 100%;
          height: 0.01rem;
          background: #F5F5F5;
        }
      }
    }
    .bottomBar{
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1.3rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 0.14rem 0 0.2rem;
      background: #fff;

      .shoppingBag{
        flex-shrink: 0;
        width: 0.88rem;
        height: 0.98rem;
        background: url(../../assets/images/shoppingBag.png) no-repeat;
        background-size: 100%;

        p{
          font-size: 0.24rem;
          color: #fff;
          line-height: 0.33rem;
          margin-top: 0.47rem;
          text-align: center;
        }
      }
      .input{
        flex: 1;
        height: 0.7rem;
        background: #F5F5F5;
        border-radius: 0.35rem;
        font-size: 0.24rem;
        color: #999999;
        padding-left: 0.47rem;
        line-height: 0.7rem;
        margin: 0 0.23rem;
      }
      .likeWrap{
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 1rem;
        .likes{
          color: #fff;
          text-align: center;
          min-width: 0.7rem;
          line-height: 0.25rem;
          border-radius: 0.125rem;
          height: 0.25rem;
          background: linear-gradient(91deg, #E04183 0%, #EF3E5B 100%);
          p{
            font-size: 0.24rem;
            transform-origin: center;
            transform: scale(0.75);
          }
        }
        .like{
          width: 0.59rem;
          height: 0.52rem;
          background: url(../../assets/images/like.png) no-repeat;
          background-size: 100%;
          margin-top: 0.1rem;
        }
      }
    }
    .bottomBar::before{
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      content: "";
      width: 100%;
      height: 0.01rem;
      background: #C9C9C9;
    }
  }
</style>