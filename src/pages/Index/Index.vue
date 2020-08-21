<template>
    <div class="index">
      <div class="videoWrap">
        <div class="auctionInfo">
          <div style="width: 70%">
            <p class="goodsName">{{currentGoods.name}}</p>
            <p>出价人 {{priceList.length == 0 ? '起拍' : priceList[0].nick}}</p>
          </div>
          <div style="text-align: right">
            <p>当前价 ￥<span>{{priceList.length == 0 ? currentGoods.initial_price : priceList[0].price}}</span></p>
            <p>市场价 ￥<span>{{currentGoods.market_price}}</span></p>
          </div>
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
      <div class="btn" @click="downLoad">
        下载APP参加拍卖
      </div>
    </div>
</template>
<script>
  import BScroll from '@better-scroll/core'
  
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
        skinLayout: [
          {
            name: "bigPlayButton", align: "cc"
          }, {
            name: "H5Loading", align: "cc"
          }, {
            name: "controlBar", align: "blabs", x: 0, y: 0,
            children: [
              {name: "playButton", align: "tl", x: 15, y: 12},
              {
                "name": "liveDisplay",
                "align": "tlabs",
                "x": 40,
                "y": 6
              },
              {name: "fullScreenButton", align: "tr", x: 10, y: 12}
            ]
          }
        ],
        currentGoods: {},
        priceList: [],
        player: null
      }
    },
    created () {
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
      downLoad () {
        window.location.href = 'https://home.bojem.com/'
      },
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
          probeType: 3,
          momentum: false,
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
          this.player.setCover(this.cover)
          this.player.on('ready', this.playerReady)
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
      showTip (e) {
        console.log(e)
        this.$toastMessage({message: '下载APP体验更流畅'})
      },
      dealError (err) {
        console.log(err)
        this.$toastMessage({message: '获取直播数据失败'})
      },
      initWebSocket () { //初始化weosocket 
        const wsuri = 'wss://hometest.bojem.com/wss'
        if (this.websocket) {
          this.setWebsocketClose = true
          this.websocket.close() // 如果不手动关闭的话会导致重连时初始化多个websocket，同一条消息多次显示
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
            this.currentGoods = resData.current_goods
            this.priceList = resData.price_list
            if (resData.bid_config) {
              let cover = ''
              if (resData.bid_config.auction_stat == 4 || resData.bid_config.auction_stat == 2) {
                cover = resData.current_goods.pic
              } else {
                cover = resData.bid_config.prepare_pic
              }
              this.cover = cover
              if (resData.bid_config.video || resData.bid_config.prepare_video) {
                let url = ''
                if (resData.bid_config.video) {
                  let reg = /(rtmp):\/\/S*/gi
                  if (resData.bid_config.video.match(reg)) {
                    url = resData.bid_config.video.replace(reg, 'http://') + '.m3u8'
                  } else {
                    url = resData.bid_config.video
                  }
                }
                this.source = url || resData.bid_config.prepare_video  // url 'http://ivi.bupt.edu.cn/hls/cctv6hd.m3u8'
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
              this.chatRecords = resData.chat_record
              this.priceList = resData.price_list
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
    }
  }
</script>
<style lang="less">
  .prism-cover{
    z-index: 9 !important;
  }
  .index{
    width: 100%;
    height: calc(100vh - constant(safe-area-inset-top));
    height: calc(100vh - env(safe-area-inset-top));
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .videoWrap{
    width: 100%;
    height: 4.22rem;
    position: relative;
    .auctionInfo{
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 10;
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
        margin-bottom: .5rem;
      }
    }
  }
  .btn{
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 1rem;
    background: #7B2D3E;
    font-size: 0.34rem;
    color: #fff;
    text-align: center;
    line-height: 1rem;
  }
  .copyDiv{
    position: relative;
    background: transparent;
  }
</style>