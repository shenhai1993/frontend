<!-- 
author: wangwei(w.w@tcl.com)  2017-10-19
显示一个区域详细信息的面板
-->
<template>
  <div>
    <div class="infobox" ref="box"  v-if="region" >
      <div class="drag-header" v-drag="{ refs: this.$refs, target: 'box' }">区域属性面板</div>
      <ul>
        <li>
          <label>Top</label>
          <span>{{region.top}}</span>
        </li>
        <li>
          <label>Left</label>
          <span>{{region.left}}</span>
        </li>
        <li>
          <label>宽</label>
          <span>{{region.width}}</span>
        </li>
        <li>
          <label>高</label>
          <span>{{region.height}}</span>
        </li>
      </ul>
      <!-- <el-form size="small"  label-width="50px" class="demo-form-inline">
        <el-form-item label="标识" >
            <el-input  v-model="region.id" style="width:100px" readonly></el-input>
          </el-form-item>
          <el-form-item label="Top" >
            <el-input-number @change="changeValue" v-model="localRegion.top"></el-input-number>
          </el-form-item>
          <el-form-item label="Left" >
            <el-input-number @change="changeValue" v-model="localRegion.left"></el-input-number>
          </el-form-item>
          <el-form-item label="宽" >
            <el-input-number @change="changeValue" v-model="localRegion.width"></el-input-number>
          </el-form-item>
          <el-form-item label="高" >
            <el-input-number @change="changeValue" v-model="localRegion.height"></el-input-number>
          </el-form-item>
        </el-form> -->
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Vue from 'vue'
import dragDirective from '../directives/Drag.js'
Vue.directive('drag', dragDirective())
export default {
  data () {
    return {
      localRegion: {
        top: 0,
        left: 0,
        width: 0,
        height: 0
      }
    }
  },
  watch: {
    region: function (v) {
      this.localRegion.top = v.top
      this.localRegion.left = v.left
      this.localRegion.width = v.width
      this.localRegion.height = v.height
    }
  },
  computed: {
    ...mapState({
      count: state => state.template.count,
      region: state => state.template.current_region
    })
  },
  methods: {
    ...mapMutations([
      'SET_CURRREGION_RECT', 'SET_CURRREGION_RECT'
    ]),
    changeValue (e, v) {
      this.SET_CURRREGION_RECT(this.localRegion)
    }
  }
}
</script>
<style lang="scss" scoped>
  .infobox {
    position:absolute;
    z-index: 20;
    width:200px;
    right:10px;
    top:60px;
    padding: 10px;
    border: 1px solid #ccc;
    background-color: #eeeeee;
     label {
      text-align: right;
      vertical-align: middle;
      float: left;
      font-size: 14px;
      color: #5a5e66;
      line-height: 40px;
      width: 60px;
      padding: 0 12px 0 0;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }
    span {
      position: relative;
      display: inline-block;
      line-height: 40px;
      margin-left: 50px;
    }
  }

  .drag-header {
    height:30px;
    line-height: 30px;
    margin-bottom: 10px;
    font-size: 14px;
    font-weight: bold;
  }

</style>
