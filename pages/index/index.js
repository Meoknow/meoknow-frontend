//index.js
//获取应用实例
const app = getApp();
let util = require('../../utils/util.js');
const $api=require('../../utils/api.js');
const PGSIZE=20;
const cat_id=3;

Page({
	data: {
		userInfo: app.globalData.userInfo,
		click: false, //是否显示弹窗内容 + + + + + + + + + + + 评论点赞插件专属
		opt: false, //显示弹窗或关闭弹窗的操作动画 + + + + + + 评论点赞插件专属
		min:2,	//输入框最少字数 + + + + + + + + + + + + + + + 评论点赞插件专属
		max:120,	//输入框最多字数 + + + + + + + + + + + + + 评论点赞插件专属
		form_value:'',	//输入框中的内容 + + + + + + + + + + + 评论点赞插件专属
		texts: "",	//当前输入的字数 + + + + + + + + + + + + + 评论点赞插件专属
		imgs1:[],	//当前图片资源 + + + + + + + + + + + + + + 评论点赞插件专属
		tempFilePaths: [],	//临时文件资源 + + + + + + + + + + 评论点赞插件专属
		disabled: true,		//按钮初始状态 + + + + + + + + + + 评论点赞插件专属
	},
	onLoad: function (options) {
		var that = this;		
		//	获取评论+++++++++++++++++++完整方式==开始======================
		var actParam = {
			aid: 1,
			nav_id: 2,
			type:1,
		}
		//	服务器段处理，并返回处理结果
		/*
		util.request('api/index', {
				'act': 'getCommentHub',   
				'param': util.parseParam(actParam),
			},function(res) {
				wx.setStorageSync('commentInfo', res.data.data)
				app.globalData.commentInfo = res.data.data
				that.setData({
					commentInfo: wx.getStorageSync('commentInfo')
				})
			}, "GET");*/
		
			//cat_id=1
		$api.request("GET","/cats/"+cat_id+"/comments/",{"page_size":PGSIZE,"page":1},1)
			.then(res=>{
				/*
				console.log("success on comments");
				console.log(res);
				//处理一下commentInfo
				var commentInfo;
				commentInfo.num=res.data.comments.length();
				commentInfo.list=[];
				let i;
				for(i=0;i<commentInfo.num;++i)
				{
					let y=res.data.comments[i];
					let x;
					x.avatar="../../image/camera.jpg";//for now
					x.content=y.content;
					x.pic=y.images;
					x.id=y.comment_id;
					x.aid=cat_id;//cat_id!
					x.nav_id=0;//?
					x.type=0;//?
					x.pid=x.id;//or 0?
					x.isThumbsup=y.is_liked;
					x.children=[];
					//x.children=...
					commentInfo.list.append(x);
				}*/
				wx.setStorageSync('commentInfo', commentInfo);
				app.globalData.commentInfo = commentInfo;
				that.setData({
					commentInfo: wx.getStorageSync('commentInfo')
				})
			})

			.catch(err=>{
				console.log("err on comments,start debugging");
				let commentInfo={

					"num":1,
					"list":[{
						"avatar":"../../image/camera.jpg",
						"content":"get comments fail,warning",
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
			})
		
		//	获取评论+++++++++++++++++++完整方式==结束======================		
	},
	
	/*************************评论/点赞组件->开始***************************/
	//点击打开弹窗
	replayAct: function(e){
		var that = this
		util.commentAction.replayAct(that,e)
	},
	//点击打开弹窗
	inputs: function(e){
		var that = this
		util.commentAction.inputs(that,e)
	},	
	//上传文件
	upload: function(){
		var that = this
		util.commentAction.upload(that)
	},
	//图片预览
	listenerButtonPreviewImage: function(e){
		var that = this
		util.commentAction.listenerButtonPreviewImage(that,e)
	},
	//长按删除文件
	deleteImage: function(e){
		var that = this
		util.commentAction.deleteImage(that,e)
	},
	//表单提交
	formSubmit: function(e){
		var that = this
		util.commentAction.formSubmit(that,e)
	},
	//表单提交
	formReset: function(e){
		var that = this
		util.commentAction.formReset(that,e)
	},
	
	thumbsupAct: function(e){
		var that = this
		util.commentAction.thumbsupAct(that,e)
	},
	/*************************评论/点赞组件->结束***************************/
})