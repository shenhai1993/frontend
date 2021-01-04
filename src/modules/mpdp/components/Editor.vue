<!--
author: wangwei(w.w@tcl.com)  2017-10-16
-->
<template>
    <!-- {{$refs.preview.id}} -->
  <div>
    <div class="template" id="preview" ref="preview" :style="{width: tpl.width + 'px', height: tpl.height + 'px'}">
      <!-- <div class="background" v-if="tpl.bg_img_path">
        <img :src="tpl.bg_img_path" :style="{width: tpl.width + 'px', height: tpl.height + 'px'}" />
      </div> -->

      <!-- 辅助线条，必须是第一个 -->
      <canvas style="width:100%;height:100%;position:absolute;"></canvas>

      <!-- 辅助网格 -->
      <canvas v-grid="{rows:tpl.row, columns:tpl.column}" style="width:100%;height:100%;position:absolute;"></canvas>

      <div v-for='(data,index) in tpl.data' :key="data.id">
        <region v-if="canResizer(data.type)" :item="data" @dblclick="on_dblclick" v-drag="{ container: '#preview', point: data, all: tpl.data, onDrag: onDrag}" >
          <div slot="tools"><span @click="removeRegion(index)">X</span></div>
        </region>
        <region v-else :item="data"
          @dblclick="on_dblclick"
          v-drag="{ container: '#preview', point: data, all: tpl.data, onDrag: onDrag}"
          v-resizer="{ container: '#preview', point: data, all: tpl.data, onResizerEnd: onResizerEnd}" >
          <div slot="tools"><span @click="removeRegion(index)">X</span></div>
        </region>
      </div>
    </div>
    <!-- 放大镜查看器 -->
    <!-- <looker :tpl="tpl" v-show="showLooker" :center="lookerCenter"></looker> -->
  </div>
</template>

<script>
import Vue from 'vue'

import looker from './Looker.vue'
import gridLine from '../directives/GridLine.js'
import region from '../components/Region.vue'
import {dragDirective, DragPlugins} from '../directives/Drag.js'

import {DragGridSnap, ResizerGridSnap} from '../directives/DragGrid.js'
import DragSnap from '../directives/DragSnap.js'

import {resizerDirective, ResizerPlugins} from '../directives/Resizer.js'
import { mapState, mapMutations } from 'vuex'

import creator from '../static/Creator'
import {DragCheck, ResizerCheck} from '../directives/DragCheckRegion'

Vue.directive('grid', gridLine())
Vue.directive('drag', dragDirective())
Vue.directive('resizer', resizerDirective())
// 后添加的起决定作用
// 拖拽兄弟吸附
DragPlugins.add(new DragSnap())
// 拖拽网格吸附
let gridsnap = new DragGridSnap()
DragPlugins.add(gridsnap)
let endCheck = new DragCheck()
DragPlugins.add(endCheck)

// 大小网格吸附
let resizergridsnpa = new ResizerGridSnap()
ResizerPlugins.add(resizergridsnpa)
// 类型判断
let resizerCheck = new ResizerCheck()
ResizerPlugins.add(resizerCheck)

// todo 兄弟吸附
export default {
  components: {
    region: region,
    looker: looker
  },
  props: {
    // 数组/对象的默认值应当由一个工厂函数返回
    tpl: {
      type: Object,
      default: function () {
        return { direction: '0' }
      }
    }
  },
  data () {
    return {
      lookerCenter: {
        top: 0,
        left: 0
      },
      showLooker: false
    }
  },
  computed: {
    ...mapState({
      count: state => state.template.count,
      zoom: state => state.template.zoom
    })
  },
  mounted () {
  },
  watch: {
    'tpl': function (v, ov) {
      this.setPlugParams()
      this.loadTemplate(v)
    },
    'tpl.update': function (v) {
      this.setPlugParams()
    }
  },
  methods: {
    ...mapMutations([
      'SELECT_REGION',
      'SET_CURRREGION_RECT',
      'SET_ZOOM'
    ]),
    canResizer (type) {
      return type === 'time' || type === 'date'
    },
    loadTemplate (data) {
      this.tpl = data
      if (!data.data) {
        data.data = []
      }
    },
    setPlugParams () {
      let gw = this.tpl.gw
      let gh = this.tpl.gh
      gridsnap.setParams(gw, gh, this.tpl.row, this.tpl.column)
      resizergridsnpa.setParams(gw, gh, this.tpl.row, this.tpl.column)
      endCheck.setParams(gw, gh, this.tpl.row, this.tpl.column)
      resizerCheck.setParams(gw, gh, this.tpl.row, this.tpl.column)
    },
    // 双击区域  实现网格内全屏
    on_dblclick (item) {
      var data = creator.getDivIndex(item, this.tpl.gw, this.tpl.gh)
      if (data) {
        this.SET_CURRREGION_RECT({top: data.y, left: data.x, width: data.width, height: data.height})
      }
    },
    removeRegion (index) {
      this.tpl.data.splice(index, 1)
      this.SELECT_REGION(null)
    },
    onDrag (left, top) {
      // 默认了只有当前选中的区域，才能修改。否则会乱掉
      this.SET_CURRREGION_RECT({top: top, left: left})
    },
    onResizerEnd (cent, rect) {
      this.SET_CURRREGION_RECT(rect)
    }
  }
}
</script>
<style lang="scss" scoped>
  .item {
    display: inline-block;
    border: 1px solid #cecece;
    width: 400px;
  }
  .template {
    position: absolute;
    background-color: #bdbdbd;
  }
  .background {
    width: 100%;
    height: 100%;
    border:1px solid #aaa;
    position:absolute;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-origin: border-box;
  }
</style>
