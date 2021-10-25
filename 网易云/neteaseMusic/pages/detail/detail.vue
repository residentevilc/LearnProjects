<template>
	<view class="detail">
		<!--虚化背景图-->
		<view class="fixbg" :style="{backgroundImage:'url('+songDetail.al.picUrl+')'}"></view>
		<!--头部-->
		<musichead :title="songDetail.name" :icon="true" color="white"></musichead>
		
		<!--内容区域 start-->
		<view class="container" v-show="!isloading">
			<!--滚动区域 start-->
			<scroll-view scroll-y="true" >
				<!--碟片播放图片和按钮-->
				<view class="detail-play">
					<image :src="songDetail.al.picUrl" :class="{'detail-play-run':isPlayRotate}" mode=""></image>
					<text class="iconfont" :class="iconPlay" @tap="handleToPlay"></text>
					<view class=""></view>
				</view>
				<!--歌词部分-->
				<view class="detail-lyric">
					<!---滚动区域-->
					<view class="detail-lyric-wrap" :style="{transform:'translateY('+ -(lyricIndex - 1) * 82+'rpx)'}">
						<!-- <view class="detail-lyric-item">往后余生</view> -->
						<view v-for="(item,index) in songLyric"class="detail-lyric-item" 
						:class="{active:lyricIndex == index}" :key="item.id">
						{{item.lyric}}</view>
					</view>
				</view>
				<!--喜欢这首歌的人也喜欢-->
				<view class="detail-like">
					<view class="detail-like-head">喜欢这首歌的人也听</view>
					<view class="detail-like-item" v-for="(item,index) in songSimi" :key="item.id" @tap="handleToSimi(item.id)">
						<view class="detail-like-left">
							<image :src="item.album.picUrl" mode=""></image>
						</view>
						<view class="detail-like-middle">
							<view>{{item.name}}</view>
							<view>
								<image v-if="item.privilege.flag > 60 &&item.privilege.flag <70" src="../../static/sq.png" mode=""></image>
								<image v-if="item.privilege.maxbr == '999000'" src="../../static/hq.png" mode=""></image>
								{{item.album.artists[0].name}} - {{item.name}}
							</view>
						</view>
						<text class="iconfont icon-bofang"></text>
					</view>
					<!-- <view class="detail-like-item">
						<view class="detail-like-left">
							<image src="../../static/logo.png" mode=""></image>
						</view>
						<view class="detail-like-middle">
							<view>蓝</view>
							<view>
								<image src="../../static/sq.png" mode=""></image>
								<image src="../../static/hq.png" mode=""></image>
								是七百 - 蓝
							</view>
						</view>
						<text class="iconfont icon-bofang"></text>
					</view> -->
				</view>
			    
				<!--评论区-->
				<view class="detail-comment">
					<view class="detail-comment-head">精彩评论</view>
					<!-- <view class="detail-comment-item">
						<view class="detail-comment-left">
							<image src="../../static/logo.png" mode=""></image>
						</view>
						<view class="detail-comment-right">
							<view class="detail-right-top">
								<view class="detail-right-top-name">
									<view>用户名</view>
									<view>2012年1月2日</view>
								</view>
								<view class="detail-right-top-like">800 <text class="iconfont icon-dianzan"></text></view>
							</view>
							<!--评论的内容-->
							<!-- <view class="detail-right-bottom">评论的具体内容评论的具体内容评论的具体内容评论的具体内容</view>
						</view>
					</view> -->
					<view class="detail-comment-item" v-for="(item,index) in songComment" :key="item.id">
						<view class="detail-comment-left">
							<image :src="item.user.avatarUrl" mode=""></image>
						</view>
						<view class="detail-comment-right">
							<view class="detail-right-top">
								<view class="detail-right-top-name">
									<view>{{item.user.nickname}}</view>
									<view>{{item.time | formatTime}}</view>
								</view>
								<view class="detail-right-top-like">{{item.likedCount | formatCount}} <text class="iconfont icon-dianzan"></text></view>
							</view>
							<!--评论的内容-->
							<view class="detail-right-bottom">{{item.content}}</view>
						</view>
					</view>
				</view>
				
				
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import musichead from '../../components/musichead/musichead.vue'
	import {getSongDetail,getSimi,getSongComment,getLyric,getSongUrl} from '../../common/api.js'
	export default {
		data() {
			return {
				songDetail:{
					al:{
						picUrl:''
					},
					name:'',
				},
				songSimi:[],
				songComment:[],
				songLyric:[],
				lyricIndex:0 ,//控制当前歌词选中状态
				iconPlay:'icon-zanting',//控制播放和暂停的图片，默认显示暂停
				isPlayRotate:true,//碟片是否旋转
				data:{},//开启计时器500ms监听一次歌词序号
				//timer:{}
				isloading:true
			}
		},
		methods: {
			getMusic(id){
				this.$store.commit('NEXT_ID',id)//将当前播放歌曲id存入vuex
				uni.showLoading({
					title:'加载中...'
				})
				this.isloading = true
				Promise.all([getSongDetail(id),getSimi(id),getSongComment(id),getLyric(id),getSongUrl(id)]).then((res) => {
					console.log(res)
					if(res[0][1].data.code == '200'){
						this.songDetail = res[0][1].data.songs[0]//获取数据：歌曲详情
					}
					if(res[1][1].data.code == '200'){
						this.songSimi = res[1][1].data.songs
					}
					if(res[2][1].data.code == '200'){
						this.songComment = res[2][1].data.hotComments
					}
					//对歌词的处理
					if(res[3][1].data.code == '200'){
						let lyric = res[3][1].data.lrc.lyric
						var result = []
						let re = /\[([^\]]+)\]([^\[]+)/g
						//console.log(lyric.match(re))
						lyric.replace(re,($0,$1,$2) => {
							result.push({"time" : this.formatTimeToSec($1), "lyric":$2})
						})
						this.songLyric = result
						console.log(result)
					}
					//歌曲mp3链接,分开处理h5和小程序端
					if(res[4][1].data.code == '200'){
						//官网查询如下语法：创建音乐实例对象
						// #ifdef MP-WEIXIN
						this.bgAudioManager = uni.getBackgroundAudioManager()
						this.bgAudioManager.title = this.songDetail.name
						// #endif
						
						// #ifdef H5
						if(!this.bgAudioManager){
						   this.bgAudioManager = uni.createInnerAudioContext();	
						   //this.innerAudioContext.autoplay = true;//部分浏览器不支持autoplay自动播放
						   //所以要设置成暂停状态
						   this.iconPlay='icon-bofang'
						   this.isPlayRotate=false
						}
						// #endif
						
						this.bgAudioManager.src = res[4][1].data.data[0].url || ''//获取歌曲mp3链接
						//this.lyricRoll()//防止onPlay一开始没调用而不能自动播放
						this.bgAudioManager.onPlay(() => {
							this.iconPlay='icon-zanting'
							this.isPlayRotate = true
							this.lyricRoll()
						})
						this.bgAudioManager.onPause(()=>{
							this.iconPlay='icon-bofang'
							this.isPlayRotate = false
							this.cancelLyricIndex()
						})
						//监听歌曲播放结束
						this.bgAudioManager.onEnded(()=>{
							this.getMusic(this.$store.state.nextId)//播放下一首
						})
					}
					//加载完成关闭提示框
					this.isloading = false
					uni.hideLoading()
				})
			},
			formatTimeToSec(value){
				let arr = value.split(':')
				//转换成秒
				return (Number(arr[0]*60) + Number(arr[1])).toFixed(1)//toFixed会将数字转成字符串，所以最后调用
			},
			handleToPlay() {
				if(this.bgAudioManager.paused){
					this.bgAudioManager.play()//会调用上面的onPause方法
				}else{
					this.bgAudioManager.pause()
				}
			},
			//歌词滚动:每隔500ms监听一次，判断lyricIndex是否应该变化
			lyricRoll(){
				
				clearInterval(this.timer)
				this.timer = setInterval(()=>{
					
					let currLyric = this.bgAudioManager.currentTime
					for(let i = 0; i<this.songLyric.length;i++){
						if(i == this.songLyric.length-1){
							this.lyricIndex = this.songLyric.length-1
							break
						}
						if(currLyric > this.songLyric[i].time && currLyric <=this.songLyric[i+1].time){
							this.lyricIndex = i
							break
						}
					}
					//console.log(this.lyricIndex)
				},500)
			},
			cancelLyricIndex(){
				clearInterval(this.timer)
			},
			//点击相似歌曲
			handleToSimi(id){
				this.getMusic(id)
			}
		},
		onLoad(options) {
			//console.log(options.songId)
			this.getMusic(options.songId)
		},
		//监听页面卸载
		onUnload() {
			this.cancelLyricIndex()
			
			// #ifdef H5
			this.bgAudioManager.destroy()
			// #endif
		},
		//监听页面隐藏
		onHide() {
			this.cancelLyricIndex()
			// #ifdef H5
			this.bgAudioManager.destroy()
			// #endif
		}
	}
</script>

<style scoped>
  .detail-play{width: 580rpx; height: 580rpx; background: url(../../static/disc.png); background-size: cover;
   margin: 214rpx auto 0 auto; position: relative;}
  .detail-play image{width: 370rpx; height: 370rpx; border-radius: 50%; position: absolute; top: 50%; left: 0; right: 0 ; top: 0; bottom: 0; margin: auto;
  animation: 10s linear move infinite; animation-play-state: paused;}
  .detail-play .detail-play-run{animation-play-state: running;}
  @keyframes move{
  	from{transform: rotate(0deg);}
  	to{transform: rotate(360deg);}
  }
  .detail-play text{font-size: 100rpx; position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); color: #FFFFFF;}
  .detail-play view{width: 230rpx; height: 360rpx; background: url(../../static/needle.png);
  position: absolute;left: 100rpx;right: 0; margin: auto;top: -200rpx; background-size: cover;}
  
  .detail-lyric{font-size: 32rpx; line-height: 82rpx; height: 246rpx; text-align: center;color: #6f6e73; overflow: hidden;}
  .detail-lyric-wrap{transition: .5s;}
  .detail-lyric-item{height: 82rpx;}
  .detail-lyric-item.active{color: #FFFFFF;}
  
  .detail-like{margin: 0 30rpx;}
  .detail-like-head{font-size: 36rpx; color: #FFFFFF; margin: 50rpx 0;}
  .detail-like-item{display: flex; margin-bottom: 38rpx;align-items: center;}
  .detail-like-left{width: 82rpx; height: 82rpx; border-radius: 20rpx; overflow: hidden; margin-right: 20rpx;}
  .detail-like-left image{width: 100%; height: 100%;}
  .detail-like-middle{flex: 1; font-size: 20rpx; color: #c6c2bf;}
  .detail-like-middle view:nth-child(1){font-size: 28rpx; color: #FFFFFF; }
  .detail-like-middle image{width: 26rpx; height: 20rpx; margin-right: 5rpx; vertical-align: middle;}
  .detail-like-item text{font-size: 50rpx;color: #c6c2bf;}
  
  .detail-comment{margin: 30rpx;}
  .detail-comment-head{color: #FFFFFF;font-size: 36rpx;margin: 50rpx 0;}
  .detail-comment-item{display: flex;margin-top: 30rpx;}
  .detail-comment-left{width: 82rpx; height: 82rpx; border-radius: 20rpx; overflow: hidden; margin-right: 20rpx;}
  .detail-comment-left image{width: 100%; height: 100%;}
  .detail-comment-right{flex: 1;}
  .detail-right-top{display: flex;justify-content: space-between;}
  .detail-right-top-name{font-size: 26rpx;color: #FFFFFF;}
  .detail-right-top-name view:nth-child(2){font-size: 20rpx; color: #cbcacf;}
  .detail-right-top-like{font-size: 28rpx;color: #cbcacf;}
  .detail-right-bottom{line-height: 40rpx; color: #FFFFFF;font-size: 28rpx;margin-top: 20rpx;border-bottom: 1px solid #e0e0e0;padding-bottom: 40rpx;}
</style>
