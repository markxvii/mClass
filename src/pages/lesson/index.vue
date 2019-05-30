<template>
  <div class="lesson">
    <swiper
      :indicator-dots="indicatorDots"
      :autoplay="autoplay"
      :interval="interval"
      :duration="duration"
      :circular="circular"
      indicator-active-color="rgba(255,255,255,0.6)"
    >
      <block v-for="(item,index) of imgUrls" :key="index">
        <swiper-item>
          <img :src="item" class="slide-image" alt="">
        </swiper-item>
      </block>
    </swiper>
    <div class="classify">
      <!--      导航-->
      <scroll-view class="btns_wrap" scroll-x :scroll-into-view="toChildView" scroll-with-animation>
        <span :id="item.id" @click="switchItem(index)" :class="{active:currentIndex===index}" class="btn_scroll"
              v-for="(item,index) of allLessons" :key="index">{{item.name}}</span>
      </scroll-view>
      <!--      内容-->
      <swiper
        :style="{height:swiperHeight+'rpx'}"
        :current="currentIndex"
        @change="swiperChange"
      >
        <block v-for="(obj,i) of allLessons" :key="i">
          <swiper-item>
            <div v-for="(item,index) of obj.lessons" :key="index">
                        <lesson-cell :img="item.img" :title="item.title" :level="item.level" :count="item.count" :url="item.url"></lesson-cell>
            </div>
          </swiper-item>
        </block>
      </swiper>
    </div>
  </div>
</template>

<script>
  import LessonCell from '../../components/lessonCell/index'
  export default {
    data() {
      return {
        imgUrls: [],
        allLessons: [],
        indicatorDots: true,
        autoplay: true,
        interval: 3000,//切换间隔
        duration: 500,//动画时长
        circular: true,
        currentIndex: 0,
        toChildView: '',
        swiperHeight:240
      }
    },
    components:{
      LessonCell
    },
    onLoad() {
      this.getData();
    },
    methods: {
      getData() {
        this.$https.request({
          url: this.$interfaces.getLessons,
          method: "get"
        }).then(res => {
          this.imgUrls = res.imgUrls;
          this.allLessons = res.allLessons;
          this.updateView()
        })
      },
      switchItem(index) {
        this.currentIndex = index;
        this.updateView();
      },
      //实现点击后所选项目移到最左边的效果
      updateView() {
        this.toChildView = this.allLessons[this.currentIndex].id;
        //计算当前tab有多少个课程
        const length=this.allLessons[this.currentIndex].lessons.length;
        //更新swiper高度
        this.swiperHeight=length*240
      },
      swiperChange(e) {
        this.currentIndex=e.mp.detail.current;
        this.updateView();
      }
    }
  }
</script>

<style scoped>
  ::-webkit-scrollbar {
    display: none;
  }

  .slide-image {
    width: 100%;
    height: 100%;
  }

  .btns_wrap {
    background-color: #fff;
    white-space: nowrap;
    border-bottom: 1px solid #ebeef5;
  }

  .btn_scroll {
    display: inline-block;
    padding: 0 16px;
    height: 45px;
    line-height: 45px;
    text-align: center;
    box-sizing: border-box;
    text-align: center;
  }

  .active {
    color: #009eef;
  }
</style>
