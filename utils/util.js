//获取应用实例
const app = getApp();
const $api=require("./api.js");
import { $wuxToptips } from '../dist/index'
const PGSIZE=10;

function setBinfo(that)
{
	let comment_bInfo={
		min: that.data.min,
		max: that.data.max,
		type: 0,
		aid: that.data.cat_id,
		nav_id: 0
	} 
	that.setData({"comment_bInfo":comment_bInfo})
}
function transComment(that,y)
{
    return {//获取评论信息
        //						"avatar":"../../image/camera.jpg",//for now
        "avatar":y.avatar,
        "content":y.content,
        "pic":y.images,
        "id":y.comment_id,
        "aid":that.data.cat_id,//cat_id!
        "nav_id":0,//?不知道怎么填
        "type":0,//?不知道怎么填
        "pid":y.comment_id,//?不太清楚填没填对
        "isThumbsup":y.is_liked,
        "children":[],
        //x.children=...
    }
}
function showTopTip(that) {
	$wuxToptips().error({
			hidden: false,
			text: '获取更多评论失败，请重试',
			duration: 3000,
			success() {},
	})
}

function getPage(that,pageNumber) 
{
	console.log("getpage")
	$api.request("GET","/cats/"+that.data.cat_id+"/comments/",{"page_size":PGSIZE,"page":pageNumber},1)
	.then(res=>{
		//处理一下commentInfo
		console.log(pageNumber)
		console.log(res);
		let commentInfo={//获取第一页评论信息
			list:[],
			num:res.data.total,
		};
		if(pageNumber!=1)
			commentInfo=that.data.commentInfo;
		let i;
		for(i=0;i<res.data.comments.length;++i)
		{
			let y=res.data.comments[i];
			let x=transComment(that,y);
			commentInfo.list.push(x);
		}
		that.setData({loading: false})
		that.setData({
			commentInfo: commentInfo
		})
		//如果返回的数据为空，那么就没有下一页了
		if (res.data.comments.length < PGSIZE) {
			that.setData({
				noMore: true
			})
		}
	})
	.catch(err=>{//在获取不到评论区信息的时候报错
		console.log("err on get comments")
		showTopTip(that);
		that.setData({loading: false})//获取评论区失败，重置加载评论

		/*静态页面元素
		console.log("err on comments,start debugging");
		console.log(err);
		let commentInfo={

			"num":1,
			"list":[{
				"avatar":"../../image/camera.jpg",
				"content":"if you see this,something wrong occurred",
				"id":1,
				"aid":3,
				"nav_id":0,
				"type":0,
				"pid":1,
				"isThumbsup":1,
				"children": [],
			}],
		};
			console.log(commentInfo);
		wx.setStorageSync('commentInfo', commentInfo);
		app.globalData.commentInfo = commentInfo;
		that.setData({
			commentInfo: wx.getStorageSync('commentInfo')
		})
		*/
	})
}

//Translate data method
function request(url, paramData, doSuccess, method="GET") {
	let host = app.globalData.baseUrl+'/api/';
	url = url || '';
	paramData = paramData||[];
	//console.log("++++++");
	let header={
		'content-type': 'application/json',
		'charset': "UTF-8",
		'Auth-Token': wx.getStorageSync('token'),
	}
	wx.request({
		url: host + url,
		header: header,
		method: method,
		data: paramData,
		success: function (res) {
			doSuccess(res);
		},
		fail: function () {
			wx.hideLoading();
			wx.showToast({
				title     :   '请求超时',
				icon      :   'loading',
				duration  :   2000
			})
		},
	})
}

function parseParam(param, key, encode) {
    if (param==null) return '';
    var paramStr = '';
    var t = typeof (param);
    if (t == 'string' || t == 'number' || t == 'boolean') {
		if(paramStr == ''){
			paramStr += '&' + key + '='  + ((encode==null||encode) ? encodeURIComponent(param) : param); 
		}else{
			paramStr += '&' + key + '='  + ((encode==null||encode) ? encodeURIComponent(param) : param); 			
		}
    } else {
        for (var i in param) {
            var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i)
            paramStr += parseParam(param[i], k, encode)
        }
    }
    return paramStr;
}

let commentAction = {
	// 用户点击评论显示弹窗
	replayAct: function(_that,e) {
		//let _that = this
		if(!_that.data.click) {
			_that.setData({
				click: true,
			})
		}
		if(_that.data.opt){
			_that.setData({
				opt: false,
			})
			// 关闭显示弹窗动画的内容，不设置的话会出现：点击任何地方都会出现弹窗，就不是指定位置点击出现弹窗了
			setTimeout(() => {
				_that.setData({
					click: false,
				})
			}, 500)
		}else{
			_that.setData({
				opt: true
			})
		}
		
		//	查验数据是否存在
		if(e!==undefined){
			//	传递数据到from表单
			var ed = e.target.dataset
			if(ed.aid!==undefined){
				this._ssWindow(_that, ed)
			}
		}
	},
	
	/***开关窗口***/
	_ssWindow: function(_that, ed) {
		let comment_bInfo = {
			aid:ed.aid,
			pid:ed.pid,
			type:ed.type||'',
			nav_id:ed.nav_id,
			min:_that.data.min,
			max:_that.data.max,
			unionID:wx.getStorageSync('openId'),
			avatar:wx.getStorageSync('avatarUrl'),
		}
		console.log(comment_bInfo)
		_that.setData({
			comment_bInfo:comment_bInfo
		})
	},
	
	/*** 字数限制*/ 
	inputs: function (that,e) {
		//let that = this;
		// 获取输入框的内容
		var value = e.detail.value	
		// 获取输入框内容的长度
		var len = parseInt(value.length)
		//最少字数限制
		if (len <that.data.min){
			that.setData({
				texts: "加油，至少要输入5个字哦",
				disabled: true
			})
		}else if (len >= that.data.min){
			that.setData({
				texts: "",
				disabled: false
			})
		}
		//最多字数限制
		if (len > that.data.max) return
		// 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
		that.setData({
			currentWordNumber: len //当前字数  
		})
	},
	/*** 上传图片方法*/
	upload: function (that) {
		//let that = this;
		wx.chooseImage({
			count: 3, // 默认9
			sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
			success: res => {
				wx.showToast({
					title: '正在上传...',
					icon: 'loading',
					mask: true,
					duration: 500
				})
				// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
				let tempFilePaths = res.tempFilePaths;
				that.setData({
					tempFilePaths: tempFilePaths
				});
				/**
				 * 上传完成后把文件上传到服务器
				**/
				//转化成base64
				var FSM = wx.getFileSystemManager();//获取全局文件管理系统
        FSM.readFile({//读本地暂存图
          filePath: res.tempFilePaths[0],
          encoding: "base64",//base64格式解码
          success: function(data) {
						let imgs1=that.data.imgs1;
						let i,j;
						for(j=0;j<res.tempFilePaths.length;++j)
						{
							let myBase64Img;
							let suffix;
							for(i=res.tempFilePaths[j].length;i>=0;--i)
							if(res.tempFilePaths[j][i]=='.')
							{
								suffix=res.tempFilePaths[0].slice(i+1);
								break;
							}
							console.log(suffix);
							myBase64Img = 'data:image/'+suffix+';base64,'+data.data;//解码后放在这
							imgs1.push(myBase64Img);
						}
						that.setData({
							imgs1: imgs1
						});
          }
        });

				/*
				var count = 0;
				for (var i = 0, h = tempFilePaths.length; i < h; i++){
				  //上传文件
					wx.uploadFile({
						url: app.globalData.baseUrl+'/api/api/uploads?act=image',
						filePath: tempFilePaths[i],
						name: 'file',
						header: {"Content-Type":"multipart/form-data"},
						success: function (res) {
							let imgs1=that.data.imgs1;
							res=res.data.startsWith("\ufeff")?res.data.slice(1):res.data;	//去除bom
							let newImgData=JSON.parse(res);								
							imgs1.push(newImgData.data.imgurl);
							that.setData({
								imgs1: imgs1
							});
							count++;
							//如果是最后一张,则隐藏等待中  
							if (count == tempFilePaths.length) {
								wx.hideToast();
							}
						},
						fail: function (res) {
							wx.hideToast();
							wx.showToast({
								title: '图片上传失败...',
								icon: 'loading',
								mask: true,
								duration: 500
							})
						}
					});
				}*/
			}
		})
	},
	/*** 预览图片方法*/
	listenerButtonPreviewImage: function (that,e) {
		//let that = this
		let index = e.target.dataset.index
		console.log(that.data.tempFilePaths[index])
		console.log(that.data.tempFilePaths)
		wx.previewImage({
			current: that.data.tempFilePaths[index],
			urls: that.data.tempFilePaths,
			//这根本就不走
			success: function (res) {
			//console.log(res);
			},
			//也根本不走
			fail: function () {
			//console.log('fail')
			}
		})
	},
	/*** 长按删除图片*/
	deleteImage: function (that,e) {
		//let that = this
		var tempFilePaths = that.data.tempFilePaths
		var imgs1 = that.data.imgs1
		var index = e.currentTarget.dataset.index	//获取当前长按图片下标
		wx.showModal({
			title: '提示',
			content: '确定要删除此图片吗？',
			success: function (res) {
				if (res.confirm) {
					console.log('点击确定了');
					tempFilePaths.splice(index, 1);
					imgs1.splice(index, 1);
				} else if (res.cancel) {
					console.log('点击取消了');
					return false;
				}
				that.setData({
					tempFilePaths:tempFilePaths,
					imgs1:imgs1
				});
			}
		})
	},
	//表单提交按钮
	formSubmit: function (that,e) {
		//let that = this
		e.detail.value.pic=that.data.imgs1	//加入图片数据到form数据数组中
		let x={};
		x.content=e.detail.value.content;
		x.images=e.detail.value.pic;
		$api.request("POST","/cats/"+that.data.cat_id+"/comments/",x,1)
		.then(res=>{
			if(res.code==0)
			{
				console.log("submit comment success");
				getPage(that,1);
				wx.setStorageSync('handleStatus',true);
			}
			else 
				console.log("submit fail1");
		})
		.catch(err=>{
			console.log("submit comment fail");
		})
		if(wx.getStorageSync('handleStatus')){
			this.replayAct(that)
			that.setData({
				form_value: '',
				allValue: ''
			})
			wx.removeStorageSync('handleStatus')
		}
		that.setData({"click":false})
		//console.log('form发生了submit事件，携带数据为：', e.detail.value)*/
	},
	//表单重置按钮
	formReset: function (that,e) {
		//console.log('form发生了reset事件，携带数据为：', e.detail.value)
		this.replayAct(that)
		that.setData({
			allValue: ''
		})
	},
	
	//---------------点赞--------------
	
	/***点赞***/
	thumbsupAct: function (that,e) {
		var ed = e.target.dataset
		let thumbsupData = {
			cmid:ed.id,
			aid:ed.aid,
			type:ed.type,
			nav_id:ed.nav_id,
			unionID:wx.getStorageSync('openId'),
			isThumbsup:ed.isthumbsup,
		}
		console.log(thumbsupData)
		
		//	本地 检索json数组并 修改数据
		var commentInfo = that.data.commentInfo
		commentInfo.list=this.findle(that, ed.id)

		//	是否点赞
		request('api/handleData', {
				'act': 'thumbsUpDone',   
				'param': parseParam(thumbsupData),
			},function(res) {
				if(res.data.data.result==1){
					//修正数据
					that.setData({
						commentInfo: commentInfo
					})
				}
			}, "POST")
	},
	
	/***查找**多维数组***开始***/
	findle: function(that, str){
		if(JSON.stringify(str) == "" || typeof(str) == "object"){
			return;
		}else{
			var commentInfo = that.data.commentInfo, obj=commentInfo.list;
			return this.traverse(obj, str);
		}
	},

	/***查找json数组-最多四维数组***/	//（这部分太臃肿，如果有哪位朋友有更好的无限级递归修改json数据的方法，希望留言指导一下，谢谢！）
	traverse: function (obj, str) {
		//obj 就是json对象
		if(typeof(obj)=="object" && obj.length){
			for(var a=0, le=obj.length; a<le; a++){
				if(obj[a].id==str){	//	第一层判断，成立则修改属性值
					obj[a].isThumbsup = obj[a].isThumbsup ? 0 : 1
				}else{
					let _arr0 = obj[a].children
					if(typeof(_arr0)==="object" && _arr0.length){
						for(var b=0,len=_arr0.length; b<len; b++){
							if(_arr0[b].id==str){	//	第二层判断，成立则修改属性值
								_arr0[b].isThumbsup = _arr0[b].isThumbsup ? 0 : 1
							}else{
								let _arr1 = _arr0[b].children
								if(typeof(_arr1)==="object" && _arr1.length){
									for(var c=0,leng=_arr1.length; c<leng; c++){
										if(_arr1[c].id==str){	//	第三层判断，成立则修改属性值
											_arr1[c].isThumbsup = _arr1[c].isThumbsup ? 0 : 1
										}else{
											let _arr2 = _arr2[c].children
											if(typeof(_arr2)==="object" && _arr2.length){
												for(var d=0,lengt=_arr2.length; d<lengt; d++){
													if(_arr2[d].id==str){	//	第四层判断，成立则修改属性值
														_arr2[d].isThumbsup = _arr2[d].isThumbsup ? 0 : 1
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
		return obj
	},

	//到达底部
  scrollToLower: function (that,pageNumber) {
    if (!that.data.loading && !that.data.noMore){
      that.setData({
        loading: true,
      })
      getPage(that,pageNumber);
    }
  },
	

	/***查找**多维数组-最多为四维数组***结束***/
}
module.exports = {
	request: request,
	parseParam: parseParam,
	commentAction: commentAction,
	getPage:getPage,
	setBinfo:setBinfo,
}