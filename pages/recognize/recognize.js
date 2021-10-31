// index.js
// 获取应用实例
const app = getApp()
import { $wuxToptips } from '../../dist/index'
var catPictures;//saving Get cat informaiton data, use data.image_url to get url
var currentPicture;

Page({
  data: {
    landscapeVisible: false,
    returnPicture: "../../image/origin.jpg",
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
  landscapeClose()
  {
    this.setData({landscapeVisible:false,});
  },
  landscapeOpen()
  {
    this.setData({landscapeVisible:true,});
  },
  tipFindNoCat() {
    $wuxToptips().error({
        hidden: false,
        text: 'find no cat',
        duration: 3000,
        success() {},
    })
  },
  tipNoMorePictures() {
    $wuxToptips().error({
        hidden: false,
        text: 'no more pictures',
        duration: 3000,
        success() {},
    })
  },
  returnPictureTurn(mode)
  {
    if(mode==0)//left
    {
      if(currentPicture==0) this.tipNoMorePictures('no more left cats');
      else
        --currentPicture;
    }
    else//right
    {
      if(currentPicture==catPictures.length-1) this.tipNoMorePictures('no more right cats');
      else
        ++currentPicture;
    }
    returnPicture=catPictures[currentPicture].image_url;
  },
  verifyCatInformation()
  {
    if(catPictures.length==0)
    {
      this.tipFindNoCat();
    }
    else
    {
      currentPicture=0;
      mypage.setData({landscapeVisible:true});//showing cats
    }
  },
  getCatInformation(cat_id)
  {
    wx.request({
      url: 'http://localhost:5000/cats/{{cat_id}}/',
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      //header: {}, // 设置请求的 header
      success: function(res){
        if(res.data.code==0)//find cat_id
          catPictures.push(res.data.data);
        else console.log("we find no cat_id"); 
      },
      fail: function(res) {
        console.log(res.errMsg);
      },
     })
  },
  addCatInformation(myBase64Img)
  {
    console.log("in add cat");
    console.log(myBase64Img);
    wx.request({
      url: 'http://localhost:5000/cats/',
      data: {
        "name": "ass", // 冒菜妈
        "image": myBase64Img,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      //header: {}, // 设置请求的 header
      success: function(res){
        console.log(res.statusCode);
        if(res.statusCode==200)//加入猫
        console.log('build cat information success');
      },
      fail: function(res) {
        console.log("res.errMsg");
      },
     })
  },
  postMyImg(myBase64Img)
  {
    let mypage=this;
    wx.request({
      url: 'http://localhost:5000/identify/',
      data: {"image":myBase64Img},
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      //header: {}, // 设置请求的 header
      success: function(res){
       // 识图成功
       if(res.statusCode==200)//找到猫
       {
          let i;
          for(i=0;i<res.data.data.cat.length;++i)
          {
            let cat=res.data.data.cat[i];
            let cat_id=cat.cat_id;//get cat_id
            console.log(cat);
            console.log(cat_id);
            getCatInformation(cat_id);//transform it into information and push to cat Pictures.
          }
       }
       //否则没找到猫，catPictures为空
      },
      fail: function(res) {
        console.log(res.errMsg);
      },
     })
  },
  showActionSheet() {
    let mypage=this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'], 
      sourceType: ['camera', 'album'], 
      success: function(res) {
        
        let myBase64Img;
        catPictures=[];//clear catPictures;
        var FSM = wx.getFileSystemManager();//获取全局文件管理系统
        FSM.readFile({//读本地暂存图
          filePath: res.tempFilePaths[0],
          encoding: "base64",//base64格式解码
          success: function(data) {
            myBase64Img = 'data:image/png;base64,'+data.data;//解码后放在这
            mypage.addCatInformation(myBase64Img);
            mypage.getCatInformation(1);
    //        mypage.postMyImg(myBase64Img);
            mypage.verifyCatInformation();
          }
        });

      },
      fail: function(res){
        console.log(res.errMsg);
      }
    })
  },

})
