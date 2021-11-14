// index.js
// 获取应用实例
const app = getApp()
import { $wuxToptips } from '../../dist/index'
var catPictures;//saving Get cat informaiton data, use data.image_url to get url
var totalRequest;

Page({
  data: {
    returnCatPictures: "../../image/origin.jpg",
    showMask: false,
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
  verifyCatInformation()
  {
    let mypage=this;
    console.log("start verify");
    let i;
    for(i=catPictures.length;i>=0;--i)
      if(catPictures[i]==1)
      {
        catPictures.splice(i,1);
      }

    if(catPictures.length==0) {
      console.log('catPictureLength=0');
      this.tipFindNoCat();
    }
    else {
      mypage.setData({returnCatPictures:catPictures});
      console.log('catPicturelength!=0');
      mypage.setData({showMask:true});//showing cats
    }
  },
  getCatInformation(cat_id,index,confidence)
  {
    let mypage=this;
    wx.request({
      "url": 'http://localhost:5000/cats/'+cat_id,
//      "url": 'http://localhost:5000/cats/',
      "method": 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      //header: {}, // 设置请求的 header
      success: function(res){
//        console.log(res.data.data[0]);
        console.log("request =end");
        if(res.data.code==0)//find cat_id
        {
          catPictures[index]=res.data.data;
          catPictures[index].confidence=confidence;
          catPictures[index].img_url="http://"+catPictures[index].img_url;
        }
        else console.log("we find no cat_id"); 
        --totalRequest;
        if(totalRequest==0)
          mypage.verifyCatInformation();
      },
      fail: function(res) {
        console.log(res.errMsg);
        --totalRequest;
        if(totalRequest==0)
          mypage.verifyCatInformation();
      },
     })
  },
  updatePhotos(myBase64Img)
  {
    myBase64Img=myBase64Img.toString();
    wx.request({
      url: 'http://localhost:5000/photos/',
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
        console.log("res.errMsg");
      },
     })
  },
  addCatInformation(myBase64Img)
  {
    console.log("ax");
    let test={name:'asttfd6',data:myBase64Img};
    wx.request({
      url: 'http://localhost:5000/cats/',
      data: {
        "name": "asttfd6", // 冒菜妈
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
        totalRequest=0;
        if(res.statusCode==200)//找到猫
        {
          let i;
          catPictures=[];
          totalRequest=res.data.data.cats.length;
          for(i=0;i<totalRequest;++i)
          catPictures.push(1);
          for(i=0;i<res.data.data.cats.length;++i)
          {
            let cat=res.data.data.cats[i];
            let cat_id=cat.cat_id;//get cat_id
            console.log(cat);
            console.log(cat_id);
            confidence.push(cat.confidence);
            getCatInformation(cat_id,i,cat.confidence);//transform it into information and push to cat Pictures.
          }
        }
       else mypage.verifyCatInformation();
       //否则没找到猫，catPictures为空
      },
      fail: function(res) {
        console.log(res.errMsg);
      },
     })
  },
  showActionSheet() {
    console.log("aa");
    let mypage=this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'], 
      sourceType: ['camera', 'album'], 
      success: function(res) {
        
        catPictures=[];//clear catPictures;
        var FSM = wx.getFileSystemManager();//获取全局文件管理系统
        FSM.readFile({//读本地暂存图
          filePath: res.tempFilePaths[0],
          encoding: "base64",//base64格式解码
          success: function(data) {
            let myBase64Img;
            myBase64Img = 'data:image/png;base64,'+data.data;//解码后放在这
//            mypage.updatePhotos(myBase64Img);
//            mypage.addCatInformation(myBase64Img);

            totalRequest=3;
            let i;
            for(i=0;i<totalRequest;++i)
            catPictures.push(1);
            mypage.getCatInformation(1,0,0.5);
            mypage.getCatInformation(1,1,0.4);
            mypage.getCatInformation(1,2,0.3);

//            mypage.postMyImg(myBase64Img);
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

})
