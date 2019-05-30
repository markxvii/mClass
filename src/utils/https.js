const https = {
  request(options = {}) {
    const {url, method,data} = options;
    //加载动画
    wx.showLoading({
      title: '加载中...',
    });

    return new Promise((resolve, reject) => {
      wx.request({
        url,
        method,
        data,
        success(res) {
          wx.hideLoading();
          //判断网络
          if (res.statusCode == 404) {
            reject();
            return false;
          } else if (res.statusCode != 200) {
            wx.showToast({
              title: "网络有问题！",
              icon: 'none'
            });
            return false;
          }
          //成功，返回数据
          resolve(res.data);
        },
        fail(res) {
          wx.hideLoading();
          reject(res);
        },
        complete() {
          wx.hideLoading();
        }
      })
    })

  }
}

export default https;
