const baseURL = "http://39.104.59.169:3001";

//const baseURL = "http://localhost:5000";

function request(method, url, data,mode=0) {
    return new Promise((resolve, reject)=>{
        let header={
            'content-type': 'application/json',
            'charset': "UTF-8",
            'Auth-Token': wx.getStorageSync('token'),
        }
        wx.request({
            url: baseURL + url,
            method: method,
            data: method === "POST" ? JSON.stringify(data) : data,
            header:header,
            success(res) {
                //请求成功
                //判断状态码---errCode状态根据后端定义来判断
                if (res.data.code == 0) {
                    if(mode==0)
                        resolve(res);
                    else 
                        resolve(res.data);
                } else {
                    //其他异常
                    reject(res);
                }
            },
            fail(err) {
                //请求失败
                console.log(header);
                reject(err)
            }
        })
    })
}

module.exports = {
  request: request,
  server: baseURL,
}
