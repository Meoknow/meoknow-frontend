const app = getApp()
var server=app.globalData.server;
var server_old=app.globalData.server_old;
const $api= require("../../utils/api.js");
function Marker(latitude,longitude,name,marker_id ) {
  this.id= marker_id,
  this.latitude= latitude,
  this.longitude= longitude,
  this.iconPath= "/image/location.png",
  this.callout= {
    content: name,
    color: '#ff0000',
    fontSize: 10,
    borderWidth: 2,
    borderRdius: 10,
    borderColor: '#000000',
    bgColor: '#fff',
    padding: 3,
    display: 'ALWAYS',
    textAlign: 'center'
  }
  this.width=20,  
  this.height=20,
  this.info = {}
  
}

function Marker_info_show(marker,name ) {
  this.marker_info = marker,
  this.name = name
  
}
Page({
  data: {
    latitude: 23.096994,//中心坐标，仅load地图时用
    longitude: 113.324520,
    center_latitude:23.096994, //实时地图中心坐标
    center_longitude: 113.324520,
   
    modalHidden: true,
    select_chosen :false, // 显示了窗口后是false,进行了选择后为true，当点击确定时候变为false,用于确定是否在窗口里完成了选择，选择了就添加marker
    marker_id : 0 ,
    cat_select_image :  server+'photos/public202111170051145228330006.jpeg',
    window_id : null,
    //需要从服务器获得的信息
    cat_info : [],/*猫的id对应的名字和img_url ，由 catRequest 产生*/
    selectArray: [], // 选择框对应的id和text,由 catRequest 产生
    markers: [], //元素为Marker()
    markers_info : [],//包含marker具体信息如创建者，时间，序号与marker对应,并且可由用户添加
    /*弹框data */
    hideModal: true,
    /*底部弹框 */
    showMarkderInfo : null,
  },
  reset:function(){
    var that = this 
    that.setData({
      cat_select_image : '/image/location.png',
    })
  },
  getDate:function(e){
    console.log(e.detail)
    let id = e.detail.id+3 // 超参 3 
    var that = this 
    let img_url = that.catid_to_info(id).img_url.split('/')
    that.setData({
      window_id :id,
      select_chosen :true ,
      cat_select_image : server +'/'+img_url[1]+'/'+img_url[2]
    })
  } ,
  onLoad: function () {
    var that=this;
    wx.getLocation({
      type: 'wgs84',
      //altitude: true,
      success: function(res) {
        that.setData({
          latitude:res.latitude,        
          longitude:res.longitude,
        })
      },
    })
    that.catRequest()
    
  },
  
  onReady: function (e) {
    this.mapCtx = wx.createMapContext('myMap')
    
  },
  chooseLocation: function () {
    var that = this
    let markers = that.data.markers
    wx.chooseLocation({
      success: function (res) {
        console.log(res);
        that.setData({
          markers : markers.concat([new Marker(res.latitude,res.longitude,10)])
        })
       
      },
    })
  },
  catid_to_info : function(id){
    var that = this 
    let array = that.data.cat_info
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      if (element['cat_id'] === id ) {
        return {"img_url":element["img_url"],"name":element["name"],"id":String(id)}
      }
    }
    return {"img_url":"image\location.png","name":"1"}
  },
  /*底部弹框*/ 
  showModal: function() {
    var that = this;
    console.log(that.data.showMarkerInfo)
    that.setData({
      hideModal: false
    })
    var animation = wx.createAnimation({
      duration: 600, //动画的持续时间 默认400ms 数值越大，动画越慢 数值越小，动画越快 
      timingFunction: 'ease', //动画的效果 默认值是linear 
    })
    this.animation = animation
    setTimeout(function() {
      that.fadeIn(); //调用显示动画 
    }, 200)
  },
  callouttap(e) {
    console.log('@@@ callouttap', e)
    var that = this 
    let marker_id = e.markerId
    let markers_info = that.data.markers_info[marker_id]
    let img_url = that.catid_to_info(markers_info.cat_id).img_url.split('/')
    if (markers_info.img_url === null || !markers_info.hasOwnProperty(img_url)) {
      markers_info.img_url = server +'/'+img_url[1]+'/'+img_url[2]
    }
    let temp = markers_info
    console.log(markers_info)
    that.setData({
      showMarkerInfo : new Marker_info_show(temp,that.catid_to_info(temp.cat_id).name),
    })
    that.showModal()
    
  },
  // 隐藏遮罩层 
  hideModal: function() {
    var that = this;
    var animation = wx.createAnimation({
      duration: 800, //动画的持续时间 默认400ms 数值越大，动画越慢 数值越小，动画越快 
      timingFunction: 'ease', //动画的效果 默认值是linear 
    })
    this.animation = animation
    that.fadeDown(); //调用隐藏动画 
    setTimeout(function() {
      that.setData({
        hideModal: true
      })
    }, 720) //先执行下滑动画，再隐藏模块 
  },
  //动画集 
  fadeIn: function() {
    this.animation.translateY(0).step()
    this.setData({
      animationData_bottom: this.animation.export() //动画实例的export方法导出动画数据传递给组件的animation属性 
    })
  },
  fadeDown: function() {
    this.animation.translateY(300).step()
    this.setData({
      animationData_bottom: this.animation.export(),
    })
  },
  /*显示弹窗*/
  buttonTap: function() {
    this.setData({
      modalHidden: false,
      select_chosen : false
    })
    this.reset()
  },

  /* 点击取消 */
  modalCandel: function() {
    // do something
    this.setData({
      modalHidden: true,
      select_chosen : false
    })
    this.selectComponent('#select').init()
  },

  /*点击确认*/
  modalConfirm: function() {
    var that = this 
    if (that.data.select_chosen === true ){
      that.myAddMarker();
      that.mapSend()
    }
    that.setData({
      modalHidden: true,
      select_chosen : false,
      })
    this.selectComponent('#select').init()
    },

  
  getCurentTime :function (isTime=true) {
    var now = new Date();
    var clock = "";
    var year = now.getFullYear();       // 年
    clock += year + "-";
    var month = now.getMonth() + 1;     // 月
    if (month < 10) {
        clock += "0";
    }
    clock += month + "-";
    var day = now.getDate();            // 日
    if (day < 10) {
        clock += "0";
    }
    if (isTime == true) {
        clock += day + " ";
        var hh = now.getHours();            // 时
        if (hh < 10) {
            clock += "0";
        }

        clock += hh + ":";
        var mm = now.getMinutes();     // 分
        if (mm < 10) {
            clock += '0';
        }
        clock += mm + ":";
        var ss = now.getSeconds();     // 秒
        if (ss < 10) {
            clock += '0';
        }
        clock += ss;
    }
    if (isTime == false) {
        clock += day;
    }
    return clock;
  },
  showText:function(){
    wx.showToast({
      title: "成功", // 提示的内容
      icon: "success", // 图标，默认success
      image: "/image/location.png", // 自定义图标的本地路径，image 的优先级高于 icon
      duration: 3000, // 提示的延迟时间，默认1500
      mask: false, // 是否显示透明蒙层，防止触摸穿透
      success: function () {
          console.log("接口调用成功的回调函数");
      },
      fail: function () {
          console.log("接口调用失败的回调函数");
      },
      complete: function () {
          console.log("接口调用结束的回调函数（调用成功、失败都会执行）");
      }
    })
  },
  mapRequest: function() {
    var that = this;
    var tmp = new Array();
    $api.request("GET",'/map/',"")
    .then(res=>{
      let data = res.data.data
      let markers  = []
      let markers_info = []
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        let cat_info = that.catid_to_info(element.cat_id)
        markers = markers.concat([new Marker(element.latitude,element.longitude,cat_info.name,index)])
        markers_info = markers_info.concat([data[index]])
      }
      console.log(markers)
      that.setData({
        markers:markers,
        markers_info:markers_info
      })
      console.log(res.data.data)
      console.log(res)
      console.log("request =end")
    })
    .catch(err=>{
      console.log(err.errMsg);
    })
  },
  mapSend: function() {
    var that = this;
    var tmp = new Array();
    if (that.data.window_id == null ){
      console.log("no selected cat")
      return 
    }
    let data={
      latitude:that.data.center_latitude,
      longitude:that.data.center_longitude,
      cat_id:that.data.window_id,
      anonymous:true ,
    }
    $api.request("POST","/map/", data)
    .then(res=>{
      console.log("post success");
    })
    .catch(err=>{
      console.log(err.errMsg);
    })
  },
  catRequest: function() {
    var that = this;
    //var tmp = new Array();

    $api.request("GET","/cats/","")
    .then(res=>{
      let info = res.data.data
      let selectArray = []
      for (let index = 0; index < info.length; index++) {
        const element = info[index];
        selectArray =  selectArray.concat([{"id":String(element["cat_id"]),"text": element["name"]}])
      }
      console.log(info)
      that.setData({
        cat_info : info ,
        selectArray :selectArray ,
      })
      that.mapRequest()
      console.log("request =end")
    })
    .catch(err=>{
      console.log(err.errMsg);
    })
  },
  myAddMarker() {
    var that = this 
    let window_id = that.data.window_id
    //console.log(cat_id)
    console.log(that.data.window_id)
    let pre_markers = that.data.markers
    let pre_marker_info = that.data.markers_info
    let cat_name = that.catid_to_info(window_id).name
    let markers=pre_markers.concat([new Marker(that.data.center_latitude,that.data.center_longitude,cat_name,pre_markers.length)])  
    let time = that.getCurentTime()
    let info = {
      latitude:that.data.center_latitude,
      longitude:that.data.center_longitude,
      cat_id:that.data.window_id,
      time : time,
    }
    let markers_info=pre_marker_info.concat([info])  
    
    console.log(markers)
    that.setData({
      markers,
      markers_info,
    })
  },
  
  addMarker() {
    const markers_toadd = allMarkers
    let pre_markers = this.data.markers

    let markers = pre_markers.concat(markers_toadd)
    console.log(markers)
    this.setData({
      markers,
    })
  },

  getCenterLocation: function () {
    var that = this
    that.mapCtx.getCenterLocation({
      success: function(res){
        that.setData({
          center_latitude:res.latitude,
          center_longitude:res.longitude
        })
        console.log(res.latitude + ',' + res.longitude)
      }
    })
   }, 

  regionDidChange(e) {
    var that = this 
    if (e.type == 'end') {    // 注意，这个事件的type至少有2种类型，'begin'和'end'，我们滑动一下地图，会有2次响应。但我们只关注'end'！！！
        that.getCenterLocation()
    }
  },
  removeMarker() {
    this.setData({
      markers: [],
    })
  },


  markertap(e) {
    console.log('@@@ markertap', e)
    this.callouttap(e)
  },

  labeltap(e) {
    console.log('@@@ labeltap', e)
  },
  translateMarker: function () {
    const length = this.data.markers.length
    if (length === 0) return

    const index = Math.floor(Math.random() * length)
    const markers = this.data.markers
    const marker = markers[index]
    marker.latitude = marker.latitude + 0.002
    marker.longitude = marker.longitude + 0.002
    const that = this
    this.mapCtx.translateMarker({
      markerId: marker.id,
      duration: 1000,
      destination: {
        latitude: marker.latitude,
        longitude: marker.longitude
      },
      animationEnd() {
        that.setData({markers})
        console.log('animation end')
      },
      complete(res) {
        console.log('translateMarker', res)
      }
    })
  },
  changeContent() {
    const num = Math.floor(Math.random() * 10)
    this.setData({num})
  }
})
