
const app = getApp()
const $api= require("../../../utils/api.js");
let util = require('../../../utils/util.js');
var currentPage;
import { $wuxToptips } from '../../../dist/index'
// pages/book/detail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
      /* 导航栏data */
      tabs: ["图鉴", "评论区"],
      activeIndex: 0,
      sliderOffset: 0,

      /* 图鉴data */
      cat_id: "",
      gender: "",
      Name: "",
      img_url: "",
      health: "",
      desexing: "",
      color: "好看",
      Namefrom: "好听",

      /* 评论区data */
      userInfo: app.globalData.userInfo,
      click: false, //是否显示弹窗内容 + + + + + + + + + + + 评论点赞插件专属
      opt: false, //显示弹窗或关闭弹窗的操作动画 + + + + + + 评论点赞插件专属
      min:1,	//输入框最少字数 + + + + + + + + + + + + + + + 评论点赞插件专属
      max:120,	//输入框最多字数 + + + + + + + + + + + + + 评论点赞插件专属
      form_value:'',	//输入框中的内容 + + + + + + + + + + + 评论点赞插件专属
      texts: "",	//当前输入的字数 + + + + + + + + + + + + + 评论点赞插件专属
      imgs1:[],	//当前图片资源 + + + + + + + + + + + + + + 评论点赞插件专属
      tempFilePaths: [],	//临时文件资源 + + + + + + + + + + 评论点赞插件专属
      disabled: true,		//按钮初始状态 + + + + + + + + + + 评论点赞插件专属

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

      /* 导航栏onLoad */
      var that = this;
      wx.getSystemInfo({
          success: function (res) {
              that.mTabWidth = res.windowWidth / that.data.tabs.length;
          }
      });

      /* 图鉴onLoad */
      console.log(options.cat_id);
      this.setData({cat_id:options.cat_id});


      /* 评论区onLoad */
      //	获取评论+++++++++++++++++++完整方式==开始======================
		  currentPage=1;
		  util.setBinfo(that);//在page.data.comment_bInfo中存放发布评论的格式
		  util.getPage(that,currentPage);//获取第一页

		  //	获取评论+++++++++++++++++++完整方式==结束======================		
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

      var that = this;


      /* 图鉴操作 */
      $api.request("GET","/cats/"+that.data.cat_id,"")
        .then(res=>{
          console.log("request =end");
        
//          if(res.data.code==0)//get data success
//          {
            var r = res.data.data;
            console.log(r);
             that.setData({
               Name:r.name,
               img_url:"http://"+r.img_url,
               gender:r.gender,
               health:r.health_status,
               desexing:r.desexing_status
              });
//          }
//          else console.log("we find no cat_idW");
        })
        .catch(err=>{
          console.log("we find no cat_idQ");
        })
    },

    /* 导航栏function */
    bindChange: function (e) {
      var that = this;
      var curIndex = e.detail.current;
      that.setData({
          sliderOffset: curIndex * that.mTabWidth,
          activeIndex: curIndex
      });
    },
    tabClick: function (e) {
        var that = this;
        var cIndex = e.currentTarget.id;
        that.setData({
            sliderOffset: cIndex * that.mTabWidth,
            activeIndex: cIndex
        });
    },

    /* 评论区function */
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
      console.log(e)
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
    formReset: function(e,cat_id){
      var that = this
      util.commentAction.formReset(that,e,cat_id)
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
            console.error("用户授权失败")
            console.error(err);
          })
          this.setData({
            hasUserInfo: true
          })
        }
      })
    },
    /*************************评论/点赞组件->结束***************************/
})