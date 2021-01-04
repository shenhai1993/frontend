<!--
author: wangwei(w.w@tcl.com)  2017-10-16
-->
<template>
    <!-- {{$refs.preview.id}} -->
  <div>
    <div class="template" id="preview" ref="preview"
        :style="{width: tpl.width + 'px', height: tpl.height + 'px', zoom: zoom}">
      <div class="background" v-if="tpl.bg_img_path">
        <img :src="tpl.bg_img_path" :style="{width: tpl.width + 'px', height: tpl.height + 'px'}" />
      </div>
      <!-- 辅助网格 -->
      <!-- <canvas v-grid style="width:100%;height:100%;position:absolute;"></canvas> -->
      <!-- 辅助线条 -->
      <canvas style="width:100%;height:100%;position:absolute;"></canvas>
      <div v-for='(data,index) in tpl.data' :key="data.id">
        <region v-if="canResizer(data.type)" :item="data"
                v-drag="{ container: '#preview', point: data, all: tpl.data, onDrag: onDrag }" >
          <div slot="tools">
            <span @click="removeRegion(index)">x</span>
          </div>
        </region>
        <region v-else :item="data"
              v-drag="{ container: '#preview', point: data, all: tpl.data, onDrag: onDrag }"
              v-resizer="{ container: '#preview', point: data, onStart:onSizeStart, onMove: onMove, onResizerEnd: onResizerEnd}" >
              <div slot="tools"><span @click="removeRegion(index)">X</span></div>
        </region>
      </div>
    </div>
    <!-- 放大镜查看器 -->
    <looker :tpl="tpl" v-show="showLooker" :center="lookerCenter"></looker>
  </div>
</template>

<script>
import Vue from 'vue'

import looker from './Looker.vue'
import gridLine from '../directives/GridLine.js'
import region from '../components/Region.vue'
import dragDirective from '../directives/Drag.js'
import resizerDirective from '../directives/Resizer.js'

import { mapState, mapMutations, mapActions } from 'vuex'

Vue.directive('grid', gridLine())
Vue.directive('drag', dragDirective())
Vue.directive('resizer', resizerDirective())

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
      bbtop: 0,
      bbleft: 0,
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
    let me = this
    window.onresize = function () {
      me.autoZoom()
    }
  },
  watch: {
    'tpl.direction': function (v, ov) {
      // 改变方向，重新定义大小
      v = parseInt(v)
      this.tpl.width = (v === 1 ? 768 : 1366)
      this.tpl.height = (v === 1 ? 1366 : 768)
      this.autoZoom()
    },
    'tpl': function (v, ov) {
      this.loadTemplate(v)
    }
  },
  methods: {
    ...mapMutations([
      'SELECT_REGION',
      'SET_CURRREGION_RECT',
      'SET_ZOOM'
    ]),
    ...mapActions([
      'storeAutoZoom'
    ]),
    canResizer (type) {
      return type === 'time' || type === 'date'
    },
    loadTemplate (data) {
      this.tpl = data
      if (!data.data) {
        data.data = []
      }
      this.autoZoom()
    },
    autoZoom () {
      if (!this.$el.isConnected) {
        return
      }
      this.storeAutoZoom(this.tpl)
      this.$refs.preview.style.zoom = this.zoom
    },
    removeRegion (index) {
      this.tpl.data.splice(index, 1)
      this.SELECT_REGION(null)
    },
    onDrag (left, top) {
      // 默认了只有当前选中的区域，才能修改。否则会乱掉
      this.SET_CURRREGION_RECT({top: top, left: left})
    },
    // 下边三个函数，是为了在拖拽大小,显示一个框框
    onSizeStart () {
      this.showLooker = true
    },
    onMove (center, rect) {
      // rect == > left, top, width, height
      this.lookerCenter = {
        x: center.x,
        y: center.y,
        zoom: this.zoom
      }
      this.SET_CURRREGION_RECT(rect)
    },
    onResizerEnd () {
      this.showLooker = false
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
    background-color: rgb(96, 125, 139);
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
