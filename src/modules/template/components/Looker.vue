<!--
author: wangwei(w.w@tcl.com)  2017-10-16
desc: 一个相当于放大镜的窗口，协助模板编辑时拖放大小时使用
-->
<template>
<div class="box" :style="{top: top + 'px', left: left + 'px'}">
  <div class="looker" >
    <div class="template" :style="{
                    width: tpl.width + 'px', height: tpl.height + 'px',
                    top: contentTop + 'px', left: contentLeft + 'px'}">
      <div class="background" :style="{backgroundImage: 'url(' + tpl.bg_img_path + ')'}">
      </div>
      <div v-for='data in tpl.data' :key="data.id">
        <region v-if="data.id != (currentRegion && currentRegion.id)" :key="data.id" :item="data">
        </region>
      </div>
    </div>

    <div class="linev"></div>
    <div class="lineh"></div>

  </div>
  <div class="text-box">坐标: {{contentTop - 25|parseint}},{{contentLeft -25|parseint}}</div>
</div>
</template>

<script>
import region from '../components/Region.vue'
import { mapState } from 'vuex'
import Vue from 'vue'
Vue.filter('parseint', function (v) {
  return parseInt(Math.abs(v))
})
export default {
  components: {
    region: region
  },
  props: {
    // 数组/对象的默认值应当由一个工厂函数返回
    tpl: {
      type: Object,
      default: function () {
        return { direction: '0' }
      }
    },
    center: {
      type: Object
    }
  },
  computed: {
    ...mapState({
      currentRegion: state => state.template.current_region
    })
  },
  data () {
    return {
      top: 100,
      left: 100,
      contentTop: 100,
      contentLeft: 100
    }
  },
  watch: {
    // 由上层改变中心点，这里更新偏移量, 让放大镜显示位置正确
    'center': function (v, ov) {
      // 内容显示偏移量
      this.contentLeft = -((v.x + window.scrollX - 244) / v.zoom - 25)
      this.contentTop = -((v.y + window.scrollY - 141) / v.zoom - 25)

      // 放大器的位置，跟随鼠标，左下方 25，25px
      this.top = v.y + window.scrollY + 25
      this.left = v.x + window.scrollX - 125
    }
  }
}
</script>
<style lang="scss" scoped>
  .template {
    position: absolute;
    zoom: 2;
    background-color: rgb(96, 125, 139);
  }
  .background {
    width: 100%;
    height: 100%;
    // border:1px solid #aaa;
    position:absolute;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-origin: border-box;
  }
  .box{
    position: absolute;
    border: 1px solid #ccc;
    background-color: #999;
  }
  .looker {
    width: 100px;
    height: 100px;
    position: relative;
    background:green;
    overflow: hidden;

    .linev {
      width: 100%;
      height:1px;
      background-color: #2f90f6;
      position: absolute;
      top: 50px;
    }
    .lineh {
      left: 50px;
      position: absolute;
      width: 1px;
      height: 100%;
      top: 0;
      background-color: #2f90f6;
    }
  }
  .text-box {
    bottom: 0px;
    position: relative;
    height: 30px;
    text-align:center;
    padding-top:3px;
    font-size:10px;
    border-top: 1px solid #ccc;
    width: 100%;
    color: white;
  }
</style>
