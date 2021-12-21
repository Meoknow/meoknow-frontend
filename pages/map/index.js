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
    color: '#000000',
    fontSize: 15,
    borderWidth: 1,
    borderRdius: 10,
    borderColor: '#000000',
    bgColor: '#ccc',
    padding: 5,
    display: 'ALWAYS',
    textAlign: 'center'
  }
  this.width=30,  
  this.height=30,
  this.info = {}
  this.show = 1
  
}
function MarkerCenter(latitude,longitude,marker_id ) {
  this.id= marker_id,
  this.latitude= latitude,
  this.longitude= longitude,
  this.iconPath= "/image/map_center.png",

  this.width=17,  
  this.height=28
  this.show = 0
  
}
function Marker_info_show(marker,name ) {
  this.marker_info = marker,
  this.name = name
  
}
Page({
  data: {
    latitude: 23.096994,//中心坐标，仅load地图时用
    longitude: 113.324520,

    point_latitude:23.096994, //点击点
    point_longitude: 113.324520,
    point_init_load :false,
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
    send_marker_type : 0 ,
    items: [
      { name: '0', value: '以当前位置上传' , checked: 'true' },
      { name: '1', value: '以选定位置上传'},
    ]
  },
  reset:function(){
    var that = this 
    that.setData({
      cat_select_image : '/image/neko-image/neko1.png',
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
  },
  
  onReady: function (e) {
    var windowHeight = wx.getSystemInfoSync().windowHeight
    console.log(windowHeight)
    this.setData({
      map_height : windowHeight*2 -170
    })
    var that = this
    that.mapCtx = wx.createMapContext('myMap')

    console.log("onReady")
    that.mygetLocation()
    
    
    
    
  },
  mygetLocation : function(){
    var that = this 
    wx.getLocation({
      type: 'gcj02',
      //altitude: true,
      success: function(res) {

        that.catRequest()
        if (that.data.point_init_load == false){
          that.setData({
            latitude:res.latitude,        
            longitude:res.longitude,
            point_latitude :res.latitude,
            point_longitude:res.longitude,
            point_init_load:true
          })
        }
        else{
          that.setData({
            latitude:res.latitude,        
            longitude:res.longitude,
          })
        }
        

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
  maptap(e){
    console.log(e)
    var that = this 
    let MarkerCenterNew = that.data.markers
    MarkerCenterNew[0].latitude = e.detail.latitude
    MarkerCenterNew[0].longitude = e.detail.longitude
    that.setData({
      markers : MarkerCenterNew,
      point_latitude : e.detail.latitude,
      point_longitude : e.detail.longitude,
    })
  },
  callouttap(e) {
    console.log('@@@ callouttap', e)
    console.log(e)
    console.log(this.data.userInfo)
    var that = this 
    let marker_id = e.markerId
    if (marker_id==1000){
      return 
    }
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
    that.mygetLocation()
    if (that.data.select_chosen === true ){
      //that.myAddMarker();
      that.mapSend()
      that.mapRequest()
    }
    that.mapRequest()
    that.setData({
      modalHidden: true,
      select_chosen : false,
      })
    this.selectComponent('#select').init()
    
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
      markers = markers.concat([new MarkerCenter(String(that.data.point_latitude),String(that.data.point_longitude),1000)])
      markers_info = markers_info.concat({1:1})
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        let cat_info = that.catid_to_info(element.cat_id)
        markers = markers.concat([new Marker(element.latitude,element.longitude,cat_info.name,index+1)])
        markers_info = markers_info.concat([data[index]])
      }
      console.log(markers)
      that.setData({
        markers:markers,
        markers_info:markers_info
      })
      console.log(res.data.data)
      console.log(res)
      console.log(markers_info)
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
      latitude:that.data.point_latitude,
      longitude:that.data.point_longitude,
      cat_id:that.data.window_id,
      anonymous: false
    }
    if (that.data.send_marker_type == 0){
      data={
        latitude:that.data.latitude,
        longitude:that.data.longitude,
        cat_id:that.data.window_id,
        anonymous: false
      }
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
    console.log("begin cat request")
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

  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    var that = this 
    that.setData({
      send_marker_type :  e.detail.value
    })
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
