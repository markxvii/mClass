<template>
  <div class="question">
    <img class="bg" src="/static/imgs/test.jpg" alt="">
    <div class="qs_content" v-if="questions.length > 0">
      <div v-if="!startqs">
        <p class="title">温馨提示：</p>
        <div class="warn-tag">
          为了更好地为您指定学习计划，请首先回答以下问题，我们会为您推荐相关课程！
        </div>
      </div>
      <div v-else>
        <p class="title">
          {{questions[currentIndex].title}}
        </p>
        <div class="response"
             v-for="(item,index) of questions[currentIndex].option"
             :key="index"
             @click="selectAnswer(index)"
        >
          <img src="/static/imgs/selected.jpg" v-if="item.select" alt="">
          <img src="/static/imgs/unselect.jpg" alt="" v-else>
          <span>{{item.label}}</span>
        </div>
      </div>
    </div>
    <button :disabled="disabled" class="qs_btn" @click="btn_click">{{btn_title}}</button>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        questions: [],
        startqs: false,//是否显示问题列表
        currentIndex: 0,//记录当前回答到第几题
        btn_title: "开始答题",//button上面的title
        lesson:''
      };
    },
    computed: {
      disabled() {
        if (!this.startqs) return false;
        else {
          const option = this.questions[this.currentIndex].option;
          let select=false;
          option.map(item=>{
            if (item.select) select=true;
          });
          return !select;
        }
      }
    },
    onLoad() {
      this.getData();
    },
    methods: {
      getData() {
        this.$https.request({
          url: this.$interfaces.getQuestions,
          methods: 'get'
        }).then(res => {
          this.questions = res.questions;
        })
      },
      btn_click() {
        //如果没有开始测试（startqs），按钮显示"开始答题"；
        //如果已经开始测试，判断是否是最后一题(length-1)，如果不是，则显示”下一题“，否则显示”完成“
        if (!this.startqs) {
          this.startqs = true;
          this.btn_title = "下一题";
        } else {
          this.lesson += this.getSelectOption();
          if (this.currentIndex < this.questions.length - 1) {
            this.btn_title = '下一题';
            this.currentIndex++
            this.lesson += ',';
          } else {
            this.btn_title = "完成"
            this.sendQuestions();
          }
        }
      },
      selectAnswer(index) {
        const option = this.questions[this.currentIndex].option;
        //将列表中的是否选项都置为未选中
        option.map(item => {
          item.select = false;
        });
        //将点击的选项选中
        option[index].select = !option[index].select;
      },
      getSelectOption() {
        const option = this.questions[this.currentIndex].option;
        let label = '';
        option.map(item=>{
          if (item.select) label = item.label;
        })
        return label;
      },
      sendQuestions() {
        wx.setStorage({
          key: 'grade',
          data: '初级',
        });
        this.$https.request({
          url:this.$interfaces.myLesson,
          method:'post',
          data:{
            lesson:this.lesson,
            userId:this.$store.getters.openId
          }
        }).then(res=>{
          //存储课程信息
          this.$store.dispatch('setLessonInfo', res);
          //跳转到学习页面
          wx.switchTab({
            url: '../learn/main'
          })
        })
      }
    }
  }
</script>

<style scoped>
  .question {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
  }

  .question .bg {
    width: 100%;
    height: 100%;
  }

  .qs_content {
    position: absolute;
    width: 80%;
    height: 50%;
    background: #fff;
    top: 36%;
    left: 10%;
    border-radius: 5px;
    box-sizing: border-box;
    padding: 10px;
    color: rgb(13, 28, 51);
  }

  .qs_btn {
    position: absolute;
    top: 90%;
    left: 10%;
    width: 80%;
    background-color: #009eef;
    color: white;
  }

  .title {
    font-weight: bold;
    margin-bottom: 20px;
    word-break: break-all;
  }

  .warn_tag {
    padding: 40px 10px;
  }

  .response {
    padding: 10px;
  }

  .response img {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }
</style>
