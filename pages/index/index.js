//index.js
//获取应用实例
const app = getApp();
let util = require('../../utils/util.js');
const $api=require('../../utils/api.js');
var currentPage;

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
		currentPage=1;
		util.getPage(that,currentPage);
		
		//	获取评论+++++++++++++++++++完整方式==结束======================		
	},
	
	//上划查看更多
	scrollToLower: function(e){
		var that=this
		++currentPage
		util.commentAction.scrollToLower(that,currentPage)
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

	getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于发布评论', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
				console.log(res.userInfo);
				$api.request("POST","/userinfo",{"nickname":res.userInfo.nickName,"avatar":res.userInfo.avatarUrl})
				.then(res=>{
					console.log("用户授权成功")
				})
				.catch(err=>{
					console.log("用户授权失败")
					console.log(err);
				})
        this.setData({
					hasUserInfo: true
        })
      }
    })
  },
	/*************************评论/点赞组件->结束***************************/
})