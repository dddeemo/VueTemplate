<template>
    <div class="index">
      <div class="end" v-if="auction_stat == 3">
        <img :src="auction_end_pic" alt="">
        <div class="btn1" v-if="isWeiXin && canUseWxOpen"><wx-open-app  :extinfo="extinfo" :text="'前往宝姐家APP查看更多珠宝'"></wx-open-app></div>
        <div class="btn1" v-else @click="downLoad">前往宝姐家APP查看更多珠宝</div>
      </div>
      <div class="videoWrap"  @click="controlVideo">
        <div class="videoBtns" v-if="videoStatus !== 'playing'">
          <!-- <div class="videoBtn pause" v-if="videoStatus == 'pause'">
            <svg t="1611307914431" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2603" width="128" height="128"><path d="M735.9 128.9c-51.2 0-96 44.7-96 95.8v702.6c0 51.1 44.8 95.8 96 95.8s96-44.7 96-95.8V224.7c0-51.1-44.8-95.8-96-95.8z m-447.8 0c-51.2 0-96 44.7-96 95.8v702.6c0 51.1 44.8 95.8 96 95.8s96-44.7 96-95.8V224.7c-0.1-51.1-44.9-95.8-96-95.8z" p-id="2604"></path></svg>
          </div> -->
          <div class="videoBtn play" v-if="videoStatus == 'pause' || videoStatus == 'ready' || videoStatus == 'init' || videoStatus == 'ended'">
            <svg t="1611307960636" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3357" width="128" height="128"><path d="M291.986286 51.931429l582.948571 333.092571a146.285714 146.285714 0 0 1 0 253.952L291.986286 972.068571A146.285714 146.285714 0 0 1 73.142857 845.092571V178.907429A146.285714 146.285714 0 0 1 291.986286 51.931429z" p-id="3358"></path></svg>
          </div>
        </div>
        <div class="auctionInfo countDownWrap" v-if="auction_stat == 1">
          <p>离拍卖开始仅剩</p>
          <div class="countDown">
            <div class="clock"></div>
            <count-down :time="next_begin_time * 1000" format="DD 天 HH : mm : ss" />
          </div>
        </div>
        <div class="auctionInfo" v-else-if="auction_stat == 2">
          <div style="width: 70%">
            <p class="goodsName">{{currentGoods.name}}</p>
            <p>出价人 {{priceList.length == 0 ? '起拍' : priceList[0].nick}}</p>
          </div>
          <div style="text-align: right">
            <p>当前价 ￥<span>{{priceList.length == 0 ? currentGoods.initial_price : priceList[0].price}}</span></p>
            <p>市场价 ￥<span>{{currentGoods.market_price}}</span></p>
          </div>
        </div>
        <div class="auctionInfo countDownWrap" v-else-if="auction_stat == 4">
          <p>{{auction_plan_title}}</p>
        </div>
        <div  class="prism-player" id="J_prismPlayer"></div>
      </div>
      <div class="chatRoom" style="flex: 1;" ref="indexScroll">
        <div class="scrollWrap">
          <div class="item" v-for="(chat, index) in chatRecords" :key="index">
            <div class="time"><p>{{chat.time}}</p></div>
            <div class="content">
              <div class="itemInfo">
                <img @load="isLoadOK" class="avatar" :src="chat.head" alt="">
                <p class="name">{{chat.nick}}</p>
              </div>
              <div class="itemContent">
                <div v-if="chat.type == 3 || chat.type == 5 || chat.type == 102" class="textContent">
                  <div class="triangle"></div>
                  <p>{{chat.content}}</p>
                </div>
                <div v-if="chat.type == 4" class="textContent imgContent">
                  <div class="triangle"></div>
                  <img @load="isLoadOK" class="userImg" :src="chat.content" alt="">
                </div>
                <div v-if="chat.type == 7" class="redContent">
                  <div class="triangle"></div>
                  <div class="redTop">
                    <div class="_img"></div>
                    <div class="redTitle">
                      <p>{{chat.content}}</p>
                      <p>领取红包</p>
                    </div>
                  </div>
                  <div class="redBottom">
                    <p>红包</p>
                  </div>
                </div>
                <div v-if="chat.type == 1 || chat.type == 2" class="redContent">
                  <div class="triangle"></div>
                  <div class="redTop">
                    <div class="price">
                      <p>{{chat.type === 2 ? chat.content : ''}}</p>
                      <p>出价 ￥<span>{{chat.price}}</span></p>
                    </div>
                  </div>
                  <div class="redBottom">
                    <p v-if="chat.is_invalid == 1">无效出价</p>
                    <p v-else>本次加价  {{chat.money}}元</p>
                  </div>
                </div>
                <div v-if="chat.type == 6" class="textContent themeContent">
                  <div class="triangle"></div>
                  <div>
                    <img @load="isLoadOK" class="themeImg" :src="chat.subjectPic" alt="">
                  </div>
                  <div>
                    <p class="title">{{chat.content}}</p>
                    <p class="seeShow">查看预展</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="btn copyDiv">
        
      </div>
      <div v-if="isWeiXin && canUseWxOpen" class="btn">
        <wx-open-app :extinfo="extinfo" :text="'前往宝姐家APP参与拍卖'"></wx-open-app>
      </div>
      <div v-else class="btn" @click="downLoad">
        前往宝姐家APP参与拍卖
      </div>
    </div>
</template>
<script>
  import BScroll from '@better-scroll/core'
  import wx from 'weixin-js-sdk'
  import { CountDown, Toast } from 'vant';
  import { mapState } from 'vuex'
  import wxOpenApp from '@/components/WxOpenLaunchApp/index'
  import {judgeEquipment, isWeiXin} from '@/utils/utils'

  export default {
    name: 'index',
    data () {
      return {
        scroll: null,
        websocket: null,
        interval: null,
        timer: null,
        chatRecords: [],
        source: '', // http://ivi.bupt.edu.cn/hls/cctv6hd.m3u8   http://pull.bojem.com/Zhibo/Zhibo3.m3u8
        cover: '', // 封面图
        // skinLayout: [
        //   {
        //     name: "bigPlayButton", align: "cc"
        //   }, {
        //     name: "H5Loading", align: "cc"
        //   }, {
        //     name: "controlBar", align: "blabs", x: 0, y: 0,
        //     children: [
        //       {name: "playButton", align: "tl", x: 15, y: 12}
        //     ]
        //   }
        // ],
        skinLayout: false,
        currentGoods: {},
        priceList: [],
        player: null,
        auction_stat: -1,
        auction_plan_title: '',
        auction_end_pic: '',
        next_begin_time: 0,
        extinfo: {
          from_id: 2
        }
      }
    },
    computed: {
      isWeiXin () {
        return window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger';
      },
      ...mapState({
        canUseWxOpen: state => state.canUseWxOpen,
      }),
      videoStatus () {
        if (this.player) {
          return this.player.getStatus()
        }
      }
    },
    watch: {
      '$store.state.wxState' (val) {
        if (val) {
          this.wxInit()
        }
      }
    },
    components: {
      CountDown, wxOpenApp
    },
    created () {
      console.log(wx)
      this.initWebSocket()
    },
    destroyed() {
      this.websocket.close() //离开路由之后断开websocket连接
    },
    mounted () {
      this.$nextTick(() => {
        this.BScrollInit()
      })
    },
    methods: {
      isLoadOK() {
        if (this.timer) {
          clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
          this.scroll.refresh()
        }, 50);
			},
      BScrollInit () {
        this.scroll = new BScroll(this.$refs.indexScroll, {
          scrollY: true,
          scrollX: false,
          momentum: true,
        })
      },
      AliplayerInit () {
        if (this.player) {
          this.player.play()
          return
        }
        this.player = new Aliplayer({
          "id": 'J_prismPlayer',
          "width": '100%',
          "controlBarVisibility": 'click',
          "showBarTime": '2000',
          "source" : this.source,
          "cover": this.cover,
          "autoplay": false,
          "rePlay": false,
          "playsinline": true,
          "preload": true,
          "useH5Prism": true,
          "skinLayout": this.skinLayout
          }, (player) => {
              console.log('播放器创建好了。')
          });
          this.player.on('ready', this.playerReady)
          this.player.on('pause', () => {
            this.player.setCover(this.cover)
          })
          this.player.on('liveStreamStop', this.reload)
          this.player.on('onM3u8Retry', this.reload)
          this.player.on('error', this.dealError)
          this.player.on('waiting', this.showTip)
      },
      playerReady (e) {
        console.log('ready')
      },
      reload (e) {
        console.log('reload')
        // window.location.reload()
      },
      controlVideo () {
        console.log(this.player.getStatus())
        if (this.player) {
          switch (this.videoStatus) {
            case 'init':
              this.player.play()
              break
            case 'ready':
              this.player.play()
              break
            case 'playing':
              this.player.pause()
              break
            case 'pause':
              this.player.play()
              break
            case 'ended':
              this.player.play()
              break
          }
        }
      },
      showTip (e) {
        console.log(e)
        Toast('下载APP体验更流畅')
      },
      dealError (err) {
        console.log(err)
        this.player.setCover(this.cover)
        Toast('获取直播数据失败')
      },
      initWebSocket () { //初始化weosocket 
        console.log(process.env)
        const wsuri = process.env.WSS_URL
        if (this.websocket) {
          this.setWebsocketClose = true
          this.websocket.close() // 如果不主动关闭的话会导致重连时初始化多个websocket，同一条消息多次显示
        }
        this.websocket = new WebSocket(wsuri); 
        this.websocket.onopen = this.websocketonopen;
        this.websocket.onerror = this.websocketonerror;
        this.websocket.onmessage = this.websocketonmessage; 
        this.websocket.onclose = this.websocketclose;
      }, 
      websocketonopen () {
        console.log("WebSocket连接成功");
        this.websocketsend('{"type":100, "user_id":0, "room_id":1}')
        if (this.interval) {
          clearInterval(this.interval)
        }
        this.interval = setInterval(() => {
          this.websocketsend('{"type":200, "user_id":0, "room_id":1}');
        },30000);
      },
      websocketonmessage (e){ //数据接收 
        if (e.data) {
          const resData = JSON.parse(e.data);
          console.log(resData)
          if (resData.type && resData.type == 100) {
            this.chatRecords = resData.chat_record
            this.priceList = resData.price_list
            if (resData.bid_config) {
              this.auction_stat = resData.bid_config.auction_stat
              this.auction_end_pic = resData.bid_config.auction_end_pic
              this.next_begin_time = resData.bid_config.next_begin_time
              this.cover = resData.bid_config.prepare_pic
              // 准备 4    拍卖中2
              if (this.auction_stat == 4) {
                this.auction_plan_title = resData.bid_config.auction_plan_title
              } else if (this.auction_stat == 2) {
                this.currentGoods = resData.current_goods
              } else if (this.auction_stat == 1) { // 预展
  
              } else if (this.auction_stat == 3) { // 拍卖结束
                // auction_end_pic
                
              }
              if (resData.bid_config.video || resData.bid_config.prepare_video) {
                let url = ''
                if (resData.bid_config.video) {
                  let reg = /(rtmp):\/\/S*/gi
                  let reg2 = /_2000/gi
                  if (resData.bid_config.video.match(reg)) {
                    url = resData.bid_config.video.replace(reg, 'http://') + '.m3u8'
                  } else {
                    url = resData.bid_config.video
                  }
                  if (resData.bid_config.video.match(reg2)) {
                    url = url.replace(reg2, '_1500')
                  }
                }
                this.source = resData.bid_config.next_begin_time > 0 ? resData.bid_config.prepare_video : url   // url 'http://ivi.bupt.edu.cn/hls/cctv6hd.m3u8'
                this.AliplayerInit()
              } else {
                
              }
            }
            setTimeout(() => {
              this.$nextTick(() => {
                this.scroll ? this.scroll.refresh() : ''
                this.scroll ? this.scroll.scrollTo(0, this.scroll.maxScrollY, 1000) : ''
              })
            }, 600);
          } else {
            if (resData.type == 8) {
              if (resData.itemInfo.stat == 2) {
                this.chatRecords = []
                this.priceList = []
              }
            } else if (resData.type == 1 || resData.type == 2 || resData.type == 3 || resData.type == 4 || resData.type == 5 || resData.type == 6 || resData.type == 7 || resData.type == 102) {
              this.chatRecords = this.chatRecords.concat(resData)
              if (this.chatRecords.length > 100) {
                this.chatRecords.shift()
              }
              // 重新计算高度并滚动到最新位置
              this.$nextTick(() => {
                setTimeout(() => {
                  this.scroll ? this.scroll.refresh() : ''
                  this.scroll ? this.scroll.scrollTo(0, this.scroll.maxScrollY, 400) : ''
                }, 200);
              })
              if (resData.type == 1 || resData.type == 2) {
                this.priceList = resData.price_list
              }
            } else if (resData.type == 13) {
              window.location.reload()
            } else if (resData.type == 10) {
              window.location.reload()
            }
          }
        }
      }, 
      websocketsend (agentData){//数据发送 
        this.websocket.send(agentData); 
      }, 
      websocketonerror (e) { //错误
        console.log("WebSocket连接发生错误");
        setTimeout(() => {
          this.initWebSocket()
        }, 1000)
      },
      websocketclose (e) { //关闭 
        console.log('连接断开', e)
        if (this.setWebsocketClose) {
          this.setWebsocketClose = false
        } else {
          setTimeout(() => {
            this.initWebSocket()
          }, 1000)
        }
        // console.log("connection closed (" + e.code + ")"); 
      },
      wxInit (data) {
        // wx.config({
        //   debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        //   appId: data.appid, // 必填，公众号的唯一标识
        //   timestamp: data.timestamp, // 必填，生成签名的时间戳
        //   nonceStr: data.nonceStr, // 必填，生成签名的随机串
        //   signature: data.signature,// 必填，签名
        //   jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData'], // 必填，需要使用的JS接口列表
        //   openTagList: ['wx-open-launch-app']
        // });
        wx.ready(() => {
          wx.updateAppMessageShareData({ 
            title: '我正在看宝姐珠宝拍卖', // 分享标题
            desc: '宝姐家为每一位女性提供优质、优雅的珠宝，让每一位女性都能遇见更好的自己', // 分享描述
            link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'https://osssaloon.bojem.com/uplaod/image/20210118/20210118174532399.png', // 分享图标
            success: () => {
              // 设置成功
            }
          })
          wx.updateTimelineShareData({ 
            title: '我正在看宝姐珠宝拍卖', // 分享标题
            link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'https://osssaloon.bojem.com/uplaod/image/20210118/20210118174532399.png', // 分享图标
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
      downLoad () {
        if (judgeEquipment() == 'ios') {
          window.location.href = 'https://apps.apple.com/cn/app/id1073905498'
        } else {
          window.location.href = 'https://www.bojem.com/app'
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .index{
    width: 100%;
    height: calc(100vh - constant(safe-area-inset-top));
    height: calc(100vh - env(safe-area-inset-top));
    overflow: hidden;
    display: flex;
    flex-direction: column;

    moz-user-select: -moz-none;
    -moz-user-select: none;
    -o-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;

    .end{
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 9999;

      img{
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .btn1{
        position: fixed;
        bottom: 1rem;
        left: 0;
        right: 0;
        margin: auto;
        width: 6rem;
        height: 1rem;
        border-radius: 0.5rem;
        background: #fae5ce;
        font-size: 0.34rem;
        color: #140405;
        text-align: center;
        line-height: 1rem;
        font-weight: 500;
      }
    }
    .van-count-down{
      color: #fff;
      font-family: Helvetica Neue,Consolas, Monaco, monospace;
    }
    .videoWrap{
      width: 100%;
      height: 4.22rem;
      position: relative;

      .videoBtns{
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 12;
        svg{
          width: 60%;
          height: 60%;
          fill: #fff;
        }

        .videoBtn{
          position: absolute;
          left: 50%;
          top: 40%;
          transform: translate(-50%, -50%);
          display: flex;
          justify-content: center;
          align-items: center;
          width: 1rem;
          height: 1rem;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 0.5rem;
        }
        .play svg{
          margin-left: 10%;
        }
      }
      .auctionInfo{
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 20;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 0.3rem;
        background: rgba(0, 0, 0, 0.6);
        height: 1rem;

        p{
          font-size: 0.24rem;
          color: #fff;
        }
        .goodsName{
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
          white-space: nowrap;
        }
      }
      .countDownWrap{
        font-size: 0.26rem;
        justify-content: center;
        p{
          color: #fff;
          font-size: 0.26rem;
        }
        .countDown{
          position: relative;
          background:  #909090;
          height: 0.4rem;
          border-radius: 0.2rem;
          padding: 0 0.2rem;
          // width: 2.4rem;
          padding-left: 0.56rem;
          margin-left: 0.1rem;
          .clock{
            position: absolute;
            left: 0;
            top: -0.36rem;
            width: 0.56rem;
            height: 0.72rem;
            background: url(../../assets/images/clock.png) no-repeat;
            background-size: contain;
          }
        }
      }
      .prism-player{
        height: 100% !important;
      }
    }
    .chatRoom{
      flex: 1;
      background: #E9E9E9;
      overflow: hidden;

      .scrollWrap{
        padding: 0.4rem 0;
        .item{
          margin-bottom: 0.5rem;
          .time{
            display: flex;
            justify-content: center;
            margin-bottom: 0.3rem;
            p{
              display: inline-block;
              height: 0.36rem;
              padding: 0 0.2rem;
              background: rgba(0, 0, 0, 0.2);
              font-size: 0.22rem;
              color: #fff;
              text-align: center;
              line-height: 0.36rem;
              border-radius: 5px;
            }
          }
          .content{
            display: flex;
            .itemInfo{
              width: 1.2rem;
              display: flex;
              flex-direction: column;
              align-items: center;
              margin-right: 0.2rem;
              margin-left: 0.36rem;
              .avatar{
                width: 0.7rem;
                height: 0.7rem;
                border-radius: 0.35rem;
              }
              .name{
                width: 100%;
                font-size: 0.22rem;
                color: #5C5C5C;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                text-align: center;
              }
            }
            .itemContent{
              .textContent{
                background: #fff;
                padding: 0.23rem 0.24rem;
                border-radius: 10px;
                border: 1px solid #D3D3D3;
                position: relative;
                max-width: 4.8rem;

                .triangle{
                  position: absolute;
                  top: 0.25rem;
                  left: -0.24rem;
                  width: 0.24rem;
                  height: 0.24rem;
                  background: url(../../assets/images/triangle.png) no-repeat;
                  background-size: contain;
                  background-position: center right;
                }
                p{
                  font-size: 0.28rem;
                  color: #212121;
                }
                .userImg{
                  max-width: 4.2rem;
                  max-height: 4.2rem;
                  width: auto;
                  height: auto;
                }
              }
              .imgContent{
                display: flex;
                align-items: center;
                max-width: 4.2rem;
              }
              .themeContent{
                max-width: 4.2rem;
                .themeImg{
                  width: 4.2rem;
                  height: 2.24rem;
                  margin-bottom: 0.24rem;
                }
                >div{
                  display: flex;
                  justify-content: space-between;

                  .title{
                    font-size: 0.3rem;
                    color: #000000;
                    font-weight: 500;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    flex: 1;
                    white-space: nowrap;
                  }
                  .seeShow{
                    height: 0.42rem;
                    border: 1px solid #7B2C3F;
                    border-radius: 0.21rem;
                    text-align: center;
                    line-height: 0.42rem;
                    font-size: 0.22rem;
                    color: #7B2C3F;
                    padding: 0 0.3rem;
                  }
                }
              }
            }
            .redContent{
              position: relative;
              .triangle{
                position: absolute;
                top: 0.25rem;
                left: -0.12rem;
                width: 0;
                height: 0;
                border-top: 0.12rem solid transparent;
                border-right: 0.12rem solid #fc9b3f;
                border-bottom: 0.12rem solid transparent;
              }
              .redTop{
                padding: 0.2rem 0.26rem;
                display: flex;
                align-items: center;
                background: #fc9b3f;
                border-radius: 10px 10px 0 0;
                min-width: 4rem;
                min-height: 1rem;

                ._img{
                  width: 0.62rem;
                  height: 0.73rem;
                  background: url(../../assets/images/red.png) no-repeat;
                  background-size: contain;
                  margin-right: 0.23rem;
                }
                .redTitle{
                  flex: 1;
                  p{
                    font-size: 0.3rem;
                    color: #fff;
                  }
                  p:last-child{
                    font-size: 0.24rem;
                    color: #fff;
                    opacity: 0.5;
                  }
                }
                .price{
                  font-size: 0.3rem;
                  color: #fff;

                  span{
                    font-size: 0.48rem;
                    font-weight: 500;
                  }
                }
              }
              .redBottom{
                background: #fff;
                border: 1px solid #D3D3D3;
                border-top: 0;
                border-radius: 0 0 10px 10px;

                p{
                  height: 0.4rem;
                  line-height: 0.4rem;
                  font-size: 0.22rem;
                  color: #7C7C7C;
                  padding: 0 0.26rem;
                }
              }
            }
          }
        }
        .item:last-child{
          margin-bottom: 1.5rem;
        }
      }
    }
    .btn{
      position: fixed;
      bottom: 0;
      width: 100%;
      height: 1rem;
      background: #7B2D3E;
      font-size: 18px;
      color: #fff;
      text-align: center;
      line-height: 1rem;
    }
    .copyDiv{
      position: relative;
      background: transparent;
    }
  }
  
</style>