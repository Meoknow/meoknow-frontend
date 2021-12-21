// index.js
// 获取应用实例
const app = getApp()
const $api= require("../../utils/api.js");
import { $wuxToptips } from '../../dist/index'
var catPictures;//saving Get cat informaiton data, use data.image_url to get url
var totalRequest;
var server=app.globalData.server;
var returnPicture;
Page({
  data: {
    returnCatPictures: "../../image/origin.jpg",
    showMask: false,
    loadingHidden: true,
    loadingText: "加载中",
  },

  cdToRecognize()
  {
    app.cdToRecognize();
  },
  cdToMy()
  {
    app.cdToMy();
  },
  cdToBook()
  {
    app.cdToBook();
  },
  cdToMap()
  {
    app.cdToMap();
  },
  landscapeClose()
  {
    this.setData({landscapeVisible:false,});
  },
  tipFindNoCat() {
    let page=this;
    $wuxToptips().error({
        hidden: false,
        text: 'find no cat',
        duration: 3000,
        success() {},
    })
    page.setData({"loadingText":"识别出错"})//单元测试的标记
    this.setData({"loadingfail":1})
  },
  tipNoMorePictures() {
    $wuxToptips().error({
        hidden: false,
        text: 'no more pictures',
        duration: 3000,
        success() {},
    })
  },
  verifyCatInformation(invalid=0)//检验并保留合法的请求猫咪信息，存在有效信息则唤醒返回结果
  {
    let mypage=this;
    mypage.setData({loadingHidden:true});
    let i;
    if(invalid)
    {
      console.log('catPictureLength=0');
      this.tipFindNoCat();
      return
    }
    console.log(catPictures)
    //现在传来的猫照片是合法且非零的
    for(i=catPictures.length;i>=0;--i)
      if(catPictures[i]==1)
        catPictures.splice(i,1);
    console.log(catPictures)
    if(catPictures.length==0)
    {
      console.log('catPictureLength=0');
      this.tipFindNoCat();
      return
    }
    wx.navigateTo({
      url: "/pages/recognize/reply?rescats="+JSON.stringify(catPictures)+"&userimage="+returnPicture
    })
  },
  getCatInformation(cat_id,index,confidence)//请求获得cat_id的猫信息,index为本次识图中返回的猫index,confidence为得分
  {
    let mypage=this;
    $api.request("GET","/cats/"+cat_id,"")
      .then(res=>{
        catPictures[index]=res.data.data;
        catPictures[index].confidence=confidence;
        catPictures[index].img_url="http://"+catPictures[index].img_url;
        --totalRequest;
        if(totalRequest==0)
          mypage.verifyCatInformation();
      })
      .catch(err=>{
        console.log("we find no cat_id"); 
        --totalRequest;
        if(totalRequest==0)
          mypage.verifyCatInformation();
      })
  },
  updatePhotos(myBase64Img)
  {
    myBase64Img=myBase64Img.toString();
    wx.request({
      url: server+'/photos/',
      data: {
        "image": myBase64Img,
        "owner": "public",
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      /*header: {
        "content-type": "application/json; charset=UTF-8"
      }, // 设置请求的 header*/
      success: function(res){
        if(res.statusCode==200)//加入照片
        console.log('build photo information success');
      },
      fail: function(res) {
        console.log(res.errMsg);
      },
     })
  },
  addCatInformation(myBase64Img)
  {
    let test={name:'asttfd6',data:myBase64Img};
    wx.request({
      url: server+'/cats/',
      data: {
        "name": "asttfd6", // 冒菜妈
        "image": myBase64Img,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      //header: {}, // 设置请求的 header
      success: function(res){
        if(res.statusCode==200)//加入猫
        console.log('build cat information success');
      },
      fail: function(res) {
        console.log("res.errMsg");
      },
     })
  },
  postMyImg(x)
  {
    let mypage=this;
    mypage.setData({
      loadingHidden: false,
      loadingText: "正在识猫"
    });
    let myBase64Img
    if(x.constructor == Object)
      myBase64Img=x.myBase64Img
    else myBase64Img=x
    $api.request("POST","/identify/",{"image":myBase64Img})
    .then(res=>{
      totalRequest=0;
      if(res.statusCode==200)//找到猫
      {
        mypage.setData({loadingText: "正在获取结果"});
        let i;
        catPictures=[];
        totalRequest=res.data.data.cats.length;
        if(!totalRequest)
        {
          //请求表示找到猫，但猫列表为空
          mypage.verifyCatInformation(1);
        }
        for(i=0;i<totalRequest;++i)
        catPictures.push(1);
        for(i=0;i<res.data.data.cats.length;++i)
        {
          let cat=res.data.data.cats[i];
          let cat_id=cat.cat_id;//get cat_id
          mypage.getCatInformation(cat_id,i,cat.confidence);//transform it into information and push to cat Pictures.
        }
      }
      else mypage.verifyCatInformation(1);
      //否则没找到猫，catPictures为空
    })
    .catch(err=>{//请求失败
      console.log(err.errMsg);
      mypage.verifyCatInformation(1)
    })
  },
  showActionSheet() {
    let mypage=this;
    var pages = getCurrentPages()    //获取加载的页面
    var currentPage = pages[pages.length-1]    //获取当前页面的对象
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'], 
      sourceType: ['camera', 'album'], 
      success: function(res) {
        
        catPictures=[];//clear catPictures;
        returnPicture = res.tempFilePaths[0];
        var FSM = wx.getFileSystemManager();//获取全局文件管理系统
        FSM.readFile({//读本地暂存图
          filePath: res.tempFilePaths[0],
          encoding: "base64",//base64格式解码
          success: function(data) {
            let myBase64Img;
            let suffix;
            let i;
            for(i=res.tempFilePaths[0].length;i>=0;--i)
            if(res.tempFilePaths[0][i]=='.')
            {
              suffix=res.tempFilePaths[0].slice(i+1);
              break;
            }
            myBase64Img = 'data:image/'+suffix+';base64,'+data.data;//解码后放在这
            mypage.postMyImg(myBase64Img);
          }
        });

      },
      fail: function(res){
        console.log(res.errMsg);
      }
    })
  },

  close_mask: function () {
    this.setData({
      showMask: false
    })
  },

  navi_to_detail:function(e)
  {
    var cat = e.currentTarget.dataset.cat;
    console.log(cat.cat_id);
    wx.navigateTo({
      url: "/pages/book/detail/detail?cat_id="+cat.cat_id
    })
  }
  
  /*
  使用navi_to_detail的时候放在标签里
  <text class=... bindtap="Navigator" data-cat="{{item}}> </text>
  
  data-cat={{item}}中的item就是
    wx:for="{{returnCatPictures}}"
  循环中获取的item
  */

})
