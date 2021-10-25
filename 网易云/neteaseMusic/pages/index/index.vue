<template>
	<view class="index">
		<musichead title="网易云音乐" :icon="false"></musichead>
		<!--内容区域 start-->
		<view class="container">
			<scroll-view scroll-y="true" >
				<!--s搜索框 start-->
				<view class="index-search" @tap="handleToSearch()">
					<text class="iconfont icon-Magnifier"></text>
					<input type="text" placeholder="搜索歌曲" />
				</view>
				<!--s搜索框 end>
				
				<!--榜单 start-->
				<view class="index-list">
					<!-- <view class="index-list-item">
						<view class="index-list-left">
							<image src="../../static/logo.png" mode=""></image>
							<text>每天更新</text>
						</view>
						<view class="index-list-rigth">
							<view>1.与我无关 - 阿荣</view>
							<view>2.模仿 - 紫薇</view>
							<view>3.北极的企鹅 - 阿未</view>
						</view>
					</view> -->
					<view class="index-list-item" v-for="(item,index) in topList" :key="item.id" @tap="handleToList(item.id)">
						<view class="index-list-left">
							<image :src="item.coverImgUrl" mode=""></image>
							<text>{{item.updateFrequency}}</text>
						</view>
						<view class="index-list-rigth">
							<view v-for="(item,index) in item.tracks" :key="item.id">{{index + 1}}.{{item.first}} - {{item.second}}</view>
						</view>
					</view>
				</view>
				<!--榜单 end-->
			</scroll-view>
		</view>
		<!--内容区域 end-->
	</view>
</template>

<script>
	import musichead from '../../components/musichead/musichead.vue'
	import {getTopList} from '../../common/api.js'
	export default {
		data() {
			return {
				topList: []
			}
		},
		components: {
			musichead,
		},
		//页面加载完毕触发,请求数据，相当于vue中created
		onLoad() {
			getTopList().then((res) => {
				this.topList = res
			})
		},
		methods: {
            handleToList(id){
				uni.navigateTo({
					url: '/pages/list/list?listId=' + id,
				});
			},
			handleToSearch(){
				uni.navigateTo({
					url:"/pages/search/search"
				})
			}
		}
	}
</script>

<style scoped>
	.index-search{
		display: flex;
		align-items: center;
		border: 1px solid #000000;
		height: 70rpx;
		margin: 70rpx 30rpx 30rpx 30rpx;
		background-color: #f7f7f7;
		border-radius: 50rpx;
	}
	.index-search text{font-size: 30rpx; margin-right: 26rpx; margin-left: 20rpx;}
	.index-search input{font-size: 28rpx; flex: 1;}
	
	.index-list{margin-left: 30rpx;}
	.index-list-item{display: flex; margin-bottom: 34rpx;}
	.index-list-left{position: relative; width: 212rpx; height: 212rpx; border-radius: 30rpx; overflow: hidden;}
	.index-list-left image{height: 100%; width: 100%;}
	.index-list-left text{position: absolute; left: 12rpx; bottom: 16rpx; color: #FFFFFF; font-size: 20rpx;}
	.index-list-rigth{margin-left: 22rpx;}
	.index-list-rigth view{font-size: 24rpx; line-height: 66rpx;}
</style>
