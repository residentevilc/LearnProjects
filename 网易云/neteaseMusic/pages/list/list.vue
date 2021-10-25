<template>
	<view class="list">
		<!--背景图-->
		<view class="fixbg" :style="{backgroundImage: 'url('+listDetail.coverImgUrl+')'}"></view>
		<!--头部-->
		<musichead title="歌单" :icon="true" color="white"></musichead>
		<!--内容区域 start-->
		<view class="container" :v-show="!isLoading">
			<!--滚动区域 start-->
			<scroll-view scroll-y="true" >
				<view class="list-head">
					<view class="list-head-left">
						<image :src="listDetail.coverImgUrl" mode="coverImgUrl"></image>
						<text class="iconfont icon-yousanjiao">{{listDetail.playCount | formatCount}}</text>
					</view>
					<view class="list-head-right">
						<view>{{listDetail.name}}</view>
						<view>
							<image :src="listDetail.creator.avatarUrl" mode=""></image>
							网易云音乐
						</view>
						<view>{{listDetail.description}}</view>
					</view>
				</view>
				<!--分享,仅在微信小程序中执行这段代码-->
				<!-- #ifdef MP-WEIXIN -->
				<button class="list-share" open-type="share">
					<text class="iconfont icon-fenxiang"></text>分享给微信好友
				</button>
				<!-- #endif -->
				<!--音乐列表-->
				<view class="list-music">
					<view class="list-music-head">
						<text class="iconfont icon-bofang"></text>
						<text>播放全部</text>
						<text>(共{{listDetail.trackCount}}首)</text>
					</view>
					<!-- <view class="list-music-item">
						<view class="list-music-index">1</view>
						<view class="list-music-song">
							<view class="">与我无关</view>
							<view>
								<image src="../../static/hq.png" mode=""></image>
								<image src="../../static/sq.png" mode=""></image>
								阿容-与我无关
							</view>
						</view>
						<text class="iconfont icon-bofang"></text>
					</view> -->
					<view class="list-music-item" v-for="(item,index) in listDetail.tracks" :key="item.id" @tap="handleToDetail(item.id)">
						<view class="list-music-index">{{index + 1 }}</view>
						<view class="list-music-song">
							<view class="">{{item.name}}</view>
							<view>
								<image v-if="privileges[index].flag >60&&privileges[index].flag <70" src="../../static/hq.png" mode=""></image>
								<image v-if="privileges[index].playMaxbr == '999000'" src="../../static/sq.png" mode=""></image>
								{{item.ar[0].name}}-{{item.name}}
							</view>
						</view>
						<text class="iconfont icon-bofang"></text>
					</view>
					
				</view>
			</scroll-view>
			<!--滚动区域 end-->
		</view>
		<!--内容区域 start-->
	</view>
</template>

<script>
	import {getList} from "../../common/api.js"
	import musichead from "../../components/musichead/musichead.vue"
	export default {
		data() {
			return {
				listDetail:{
					coverImgUrl:'',
					creator:{
						avatarUrl:''
					}
				},
				privileges:[],//对象数组
				isLoading:true
			}
		},
		components:{
			musichead
		},
		methods:{
			handleToDetail(songId) {
				uni.navigateTo({
					url: '/pages/detail/detail?songId='+songId
				})
			}
			
		},
		onLoad(options) {
			//加载中就提示
			uni.showLoading({
				title:'加载中...'
			})
			getList(options.listId).then((result) =>{
				//console.log(result)
				if(result[1].data.code == 200){
					//成功时赋值
					this.listDetail = result[1].data.playlist
					this.privileges = result[1].data.privileges
					this.$store.commit('INIT_TOPLISTIDS',result[1].data.playlist.trackIds)
					this.isLoading = false
					uni.hideLoading()
				}
			})
		},
	}
</script>

<style scoped>
.list-head{
	width: 100%;
	padding-left: 30rpx;
	display: flex;
	align-items: center;
	/*color: #FFFFFF;*/
}
.list-head-left{width: 264rpx; height: 264rpx; position: relative; border-radius: 30rpx; overflow: hidden;margin-right: 42rpx;}
.list-head-left image{width: 100%; height: 100%;}
.list-head-left text{position: absolute; top: 10rpx; right: 20rpx; font-size: 26rpx; color: #FFFFFF;}
.list-head-right {flex: 1; color: #f0f2f7;}
.list-head-right view:nth-child(1){}
.list-head-right view:nth-child(2){display: flex; margin: 20rpx 0; font-size: 24rpx; align-items: center;}
.list-head-right view:nth-child(2) image{width: 54rpx; height: 54rpx; border-radius: 50%; margin-right: 14rpx;}
.list-head-right view:nth-child(3){font-size: 16rpx; line-height: 34rpx; font-size: 22rpx;width: 400rpx;}

.list-share{width: 330rpx; height: 74rpx; background: rgba(0,0,0,.4); margin-top: 20rpx;border-radius: 37rpx; color: #FFFFFF;font-size: 28rpx;}
.list-share text{margin-right: 16rpx;}

.list-music{background-color: #FFFFFF; border-radius: 50rpx; margin-top: 40rpx;}
.list-music-head{height: 50rpx; padding: 30rpx 0 70rpx 22rpx; margin-bottom: 22rpx;}
.list-music-head text:nth-child(1){font-size: 50rpx; height: 50rpx;}
.list-music-head text:nth-child(2){font-size: 30rpx; margin: 0 10rpx 0 26rpx;}
.list-music-head text:nth-child(3){font-size: 26rpx; color: #b2b2b2;}
.list-music-item{display: flex; margin: 0 32rpx 66rpx 46rpx;}
.list-music-index{width: 58rpx; font-size: 30rpx; }
.list-music-song{flex: 1;}
.list-music-song view:nth-child(1){color: #000000;font-size: 28rpx;width: 70vw; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}
.list-music-song view:nth-child(2){font-size: 16rpx; color: #b2b2b2; width: 70vw; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}
.list-music-song view:nth-child(2) image{width: 32rpx; height: 20rpx;margin-right: 5rpx; vertical-align: middle;}
.list-music-item text{font-size: 50rpx; color: #c7c7c7c7;}
</style>
