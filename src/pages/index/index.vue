<template>
  <div class="container">
    <div class="login">
      <img src="/static/imgs/guide_bg.jpg" alt>
      <div class="learn">
        <button open-type="getUserInfo" @getuserinfo="getUserInfo">开始学习</button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    methods: {
      getUserInfo(e) {
        if (e.mp.detail.userInfo) {
          // 此对象可以获取用户信息
          this.$store.dispatch('setIsAuthenticated', true);
          this.$store.dispatch('setUser', e.mp.detail.userInfo);
          this.getCode();
        }
      },
      getCode() {
        //在mpvue中，提供了一个全局小程序对象wx
        wx.login({
          success:res=>{
            this.getOpenid(res.code);
          }
        })
      },
      getOpenid(code) {
        //三个参数,appid,secret,code
        const appid = '';
        const secret = '';
        this.$https.request({
          url: this.$interfaces.getOpenid + appid + "/" + secret + "/" + code,
          method: 'get'
        }).then(res => {
          //存到vuex中
          this.$store.dispatch('setOpenId', res.openid);
          //请求课程数据
          this.isLearned(res.openid)
        });
      },
      //判断用户是否是第一次进入小程序通过了测试
      isLearned(openid) {
        this.$https.request({
          url:this.$interfaces.getMyLesson+openid,
          method:'get'
        }).then(res=>{
          //已经测试过了
          this.$store.dispatch('setLessonInfo', res);
          wx.switchTab({
            url:"../learn/main"
          });
        }).catch(res=>{
          //还没有测试
          wx.redirectTo({
            url:'../question/main'
          })
        })
      }
    }
  };
</script>

<style scoped>
  .container {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .login {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .login img {
    display: inline-block;
    width: 100%;
    height: 100%;
  }

  .login .learn {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    top: 0;
    left: 0;
  }

  .learn button {
    position: absolute;
    top: 90%;
    left: 10%;
    width: 80%;
    background-color: #009eef;
    color: white;
  }
</style>
