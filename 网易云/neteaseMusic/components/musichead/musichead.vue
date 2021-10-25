<template>
	<view class="musichead" :style="{color: color}">
		<!--头部左侧 start-->
		<view  v-if="icon" class="head-left" :class="{'music-head-iconblack' : iconblack}">
			<text class="iconfont icon-zuojiantou" @click="handleToBack()"></text>
			|
			<text class="iconfont icon-shouye" @click="handleToHome()"></text>
		</view>
		<!--头部左侧 start-->
		
		{{title}}
		
		<!--头部右侧 start-->
		<!--头部右侧 end-->
	</view>
</template>

<script>
	export default {
		name:"musichead",
		props:['title','icon','color','iconblack'],
		data() {
			return {
				
			};
		},
		methods:{
		     handleToBack(){
				 uni.navigateBack({
				 	
				 })
			 },
			 handleToHome() {
				 uni.navigateTo({
				 	url: '../../pages/index/index'
				 })
			 }
		}
	}
</script>

<style scoped>
	.musichead{
		position: relative;
		width: 100%;
		height: 75px;
		font-size: 20px;
		line-height: 80px;
		text-align: center;
		color: #000000;
	}
	.head-left{
		position: absolute;
		left: 8px;
		top: 25px;
		width: 90px;
		height: 31px;
		font-size: 20px;
		background-color: rgba(0,0,0,.4);
		color: white;
		line-height: 33px;
		display: flex;
		justify-content: space-around;
		border-radius: 15px;
	}
	.iconfont {
		font-size: 20px;
	}
	.music-head-iconblack{
		color: black;
		border:1px solid #eaeaea;
		background-color: #FFFFFF;
	}

</style>
