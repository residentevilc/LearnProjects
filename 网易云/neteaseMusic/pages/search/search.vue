<template>
	<view class="search">
		<!--头部-->
		<musichead title="搜索" :icon="true" color="#000000" :iconblack="true"></musichead>
		<!--内容区域 start-->
		<view class="container">
			<!--滚动区域 start-->
			<scroll-view scroll-y="true" >
				<!--s搜索框 start-->
				<view class="search-search">
					<text class="iconfont icon-Magnifier"></text>
					<input type="text" placeholder="搜索歌曲" v-model="searchWord" @confirm="handleToSearch(searchWord)" @input="handleToSuggest"/>
					<text v-show="searchType!=1" class="iconfont icon-guanbi" @tap="handleToClose()"></text>
				</view>
				<!--每点击搜索显示的页面：热搜-->
				<block v-if="searchType == 1">
					<!--搜索历史-->
					<view class="search-history">
						<view class="search-history-head">
							<text>历史记录</text>
							<text class="iconfont icon-del" @tap="handleToClear()"></text>
						</view>
						<view class="search-history-list">
							<view v-for="(item,index) in searchHistory" :key="item.id" @tap="handleToWord(item)">{{item}}</view>
							
						</view>
					</view>
				</block>
				<!--点击搜索显示的内容页面-->
				<block v-else-if="searchType == 2">
					<view class="search-result">
						<!-- <view class="search-result-item">
							<view class="search-result-word">
								<view>少年测试</view>
								<view>许蔚 - 爱如少年</view>
							</view>
							<text class="iconfont icon-bofang"></text>
						</view> -->
						<view class="search-result-item" v-for="(item,index) in searchList" :key="item.id" @tap="handleToDetail(item.id)">
							<view class="search-result-word">
								<view>{{item.name}}</view>
								<view>{{item.artists[0].name}} - {{item.album.name}}</view>
							</view>
							<text class="iconfont icon-bofang"></text>
						</view>
					</view>
				</block>
				<!--搜索提示显示的内容页面-->
				<block v-else-if="searchType == 3">
					<view class="search-suggest">
						<view class="search-suggest-head">搜索“{{searchWord}}"</view>
					    <!-- <view class="search-suggest-item">
						    <text class="iconfont icon-Magnifier"></text>少年痘印测试
					    </view> -->
						<view class="search-suggest-item" v-for="(item,index) in searchSuggest" :key="item.id" @tap="handleToWord(item.keyword)">
						    <text class="iconfont icon-Magnifier"></text>{{item.keyword}}
						</view>
						
					</view>
				</block>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import musichead from "../../components/musichead/musichead.vue"
	import {getSearchWord,getSearchSuggest} from "../../common/api.js"
	export default {
		data() {
			return {
				searchWord:'',
				searchHistory:[],
				searchType:1,
				searchList:[],
				searchSuggest:[]
			}
		},
		methods: {
			handleToWord(word){
				this.searchWord = word
				this.handleToSearch(word)
			},
			handleToSearch(word){
				this.searchHistory.unshift((word))
				this.searchHistory = [...new Set(this.searchHistory)]
				//历史记录最多显示10条
				if(this.searchHistory.length>10){
					this.searchHistory.length = 10
				}
				//存储到localStorage
				uni.setStorage({
					key:'searchHistory',
					data:this.searchHistory
				})
				this.getSearchList((word))//展示搜索结果
			},
			//情空本地记录
			handleToClear(){
				uni.removeStorage({
				    key: 'searchHistory',
				    success:  (res) =>{
				        this.searchHistory = []
				    }
				});
			},
			getSearchList(word){
				getSearchWord(word).then((res) => {
					console.log(res)
					if(res[1].data.code == '200'){
						this.searchList = res[1].data.result.songs
						this.searchType = 2
					}
				})
			},
			handleToClose(){
				this.searchType = 1
				this.searchWord = ''
			},
			//点击歌曲跳到详情页
			handleToDetail(id){
				uni.navigateTo({
					url: '/pages/detail/detail?songId='+id
				})
			},
			//表单输入事件
			handleToSuggest(ev){
				let value = ev.detail.value
				//如果输入框为空，回到搜索页
				if(!value){
					this.searchType = 1
					return 
				}
				getSearchSuggest(value).then((res) => {
					if(res[1].data.code == '200'){
						this.searchSuggest = res[1].data.result.allMatch
						this.searchType = 3
					}
				})
			}
		},
		onLoad(){
			//取出历史记录
			uni.getStorage({
			    key: 'searchHistory',
			    success: (res) => {
			        this.searchHistory = res.data
			    }
			});
		}
	}
</script>

<style scoped>
.search-search{display: flex; align-items: center; height: 70rpx; margin: 70rpx 30rpx 30rpx 30rpx; background-color: #f7f7f7; border-radius: 50rpx;}
.search-search text{margin: 0 26rpx;}
.search-search input{flex: 1; font-size: 26rpx;}

.search-history{margin: 0 30rpx; font-size: 26rpx;}
.search-history-head{display: flex; justify-content: space-between; margin-bottom: 36rpx;}
.search-history-head text{}
.search-history-list{display: flex; flex-wrap: wrap;}
.search-history-list view{padding: 16rpx 28rpx; border-radius: 40rpx; margin-right: 30rpx; margin-bottom: 30rpx; background-color: #F7F7F7;}

.search-result{border-top: 2rpx #e4e4e4 solid;padding: 30rpx;}
.search-result-item{display: flex; justify-content: space-between; align-items: center; padding-bottom: 30rpx; margin-bottom: 30rpx; border-bottom: 2rpx #e4e4e4 solid;}
.search-result-word{}
.search-result-word view:nth-child(1){font-size: 28rpx; color: #235790; margin-bottom: 12rpx;}
.search-result-word view:nth-child(2){font-size: 22rpx; color: #898989;}
.search-result-word text{font-size: 50rpx;}

.search-suggest{border-top: 2rpx #e4e4e4 solid; padding: 30rpx; font-size: 26rpx;}
.search-suggest-head{color: #4574a5; margin-bottom: 74rpx;}
.search-suggest-item{color:#5d5d5d; margin-bottom: 74rpx;}
.search-suggest-item head{color: #bdbdbd; margin-right: 28rpx; position: relative; top: 2rpx;}
</style>
