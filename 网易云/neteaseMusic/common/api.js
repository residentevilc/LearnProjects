import { baseUrl } from "./config.js"

//获取所有榜单内容摘要
export function getTopList() {
	return new Promise((resolve,reject) =>{
		uni.request({
			url: `${baseUrl}/toplist/detail`,
			method: 'GET',
			data: {},
			success: res => {
				let result = res.data.list
				result.length = 4
				resolve(result)
			},
			fail: () => {},
			complete: () => {}
		});
	})
}
//获取歌单/榜单详情，注意，如果是歌单即id指向的歌单，需要登录
//榜单即id指向的榜单，不需要登录
export function getList(listId){
	return uni.request({
		url: `${baseUrl}/playlist/detail?id=${listId}`,
		method:'GET'
	})
}

//获取歌曲详细信息： http://localhost:3000/song/detail?ids=347230
export function getSongDetail(songId){
	return uni.request({
		url:`${baseUrl}/song/detail?ids=${songId}`,
		method:'GET'
	})
}
//获取相似歌曲：/simi/song?id=347230 
export function getSimi(songId){
	return uni.request({
		url:`${baseUrl}/simi/song?id=${songId}`,
		method:'GET'
	})
}
//歌曲晴天评论: /comment/music?id=186016&limit=1 
export function getSongComment(songId){
	return uni.request({
		url:`${baseUrl}/comment/music?id=${songId}`,
		method:'GET'
	})
}
//获取歌词：/lyric?id=33894312
export function getLyric(songId){
	return uni.request({
		url:`${baseUrl}/lyric?id=${songId}`,
		method:'GET'
	})
}
//获取歌曲url播放声音: /song/url?id=33894312
//注意有些歌曲的url是空的
export function getSongUrl(songId){
	return uni.request({
		url:`${baseUrl}/song/url?id=${songId}`,
		method:'GET'
	})
}

//获取搜索结果
export function getSearchWord(word){
	return uni.request({
		url:`${baseUrl}/search?keywords=${word}`,
		method:'GET'
	})
}

//搜索建议
// /search/suggest?keywords=海阔天空&type=mobile
export function getSearchSuggest(word){
	return uni.request({
		url:`${baseUrl}/search/suggest?keywords=${word}&type=mobile`,
		method:'GET'
	})
}