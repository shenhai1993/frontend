<!--
author: wangwei(w.w@tcl.com)  2017-10-16
表示一个区域
-->
<template>
  <div class="comp-resize region" @mousedown="SELECT_REGION(item)"
    :style="{color: item.color,
            backgroundColor: item.backgroundColor,
            top: item.top + 'px',
            left: item.left + 'px',
            width: item.width + 'px',
            height: item.height + 'px',
            fontSize: item.fontSize + 'px',
            fontFamily: item.fontFamily,
            textAlign: item.textAlign}"
    v-bind:class="{'region-selected': canSelect && currentRegion && (item.id == currentRegion.id)}" >
    <div style="display:table;height:100%;width:100%;">
      <slot>
        <div class="text" v-if="item.type == 'time'">{{hour}}</div>
        <div class="text" v-else-if="item.type == 'date'">{{timeDate}}</div>
        <div class="text" v-else>{{item.type| regiontext}}</div>
      </slot>
      <!-- 工具区域 -->
      <div class="tools">
        <slot name="tools">
        </slot>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import dragDirective from '../directives/Drag.js'
import resizerDirective from '../directives/Resizer.js'
import { mapState, mapMutations } from 'vuex'
import creator from '../static/Creator'
import Vue from 'vue'
import '../directives/drag.css'
Vue.directive('drag', dragDirective())
Vue.directive('resizer', resizerDirective())
Vue.filter('regiontext', creator.regionText)
export default {
  props: {
    // 数组/对象的默认值应当由一个工厂函数返回
    item: {
      type: Object,
      default: function () {
        return { type: 'NAN' }
      }
    },
    canSelect: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      timeDate: '',
      hour: ''
    }
  },
  computed: {
    ...mapState({
      currentRegion: state => state.template.current_region
    })
  },
  mounted () {
    this.startTime()
  },
  methods: {
    ...mapMutations([
      'SET_CURRREGION_RECT',
      'SELECT_REGION'
    ]),
    startTime () {
      this.timeDate = moment().format('YYYY/MM/DD')
      this.week = moment().format('dddd')
      this.hour = moment().format('HH:mm')
      setTimeout(this.startTime, 1000)
    }
  }
}
</script>
<style lang="scss" scoped>
  .region {
    opacity: 0.85;
    background-size: 100% 100%;
    position: absolute;
    text-align: center;
    vertical-align: middle;
  }
  .text {
    display: table-cell;
    vertical-align: middle;
    width: 100%;
    text-align: center;
  }
  .regionContent {
    overflow: hidden;
  }
  .region-selected {
    background-color: #67c23a !important;
  }
</style>
