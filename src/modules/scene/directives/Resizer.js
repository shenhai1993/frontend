import Hammer from 'hammerjs'
import $ from 'jquery'
/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */

import {MultiCompResize, Cursor} from './MultiCompResize'

export let ResizerPlugins = {
  list: [],
  add: function (obj) {
    this.list.push(obj)
  },
  // event 事件对象
  // container 拖拽的父容器
  // nodes 所有兄弟区域（包含自已）
  // self 自身区域属性
  start: function (event, container, nodes, self) {
    for (let i = 0; i < this.list.length; i++) {
      let obj = this.list[i]
      obj.start(event, container, nodes, self)
    }
  },
  // event 事件对象
  // ui dom对象
  end: function (event, ui) {
    for (let i = 0; i < this.list.length; i++) {
      let obj = this.list[i]
      obj.end(event, ui)
    }
  },
  // e event
  // l left值
  // t top值
  // element dom对象
  moving: function (event, m, element, cursor) {
    for (let i = 0; i < this.list.length; i++) {
      let obj = this.list[i]
      m = obj.moving(event, m, element, cursor)
    }
    return m
  }
}

// vue指令插件
export let resizerDirective = (options) => ({
  bind: function (myElement, binding) {
    $(myElement).addClass('comp-resize')
  },
  inserted: function (myElement, binding) {
    let element = $(myElement)
    // let transformReg4 = /(-?[\d\.]{1,}), (-?[\d\.]{1,}), (-?[\d\.]{1,}), (-?[\d\.]{1,})/
    let transformReg6 = /(-?[\d\.]{1,}), (-?[\d\.]{1,}), (-?[\d\.]{1,}), (-?[\d\.]{1,}), (-?[\d\.]{1,}), (-?[\d\.]{1,})/
    let container = null
    if (binding.value.container === 'parent') {
      container = element.parent()
    } else if (binding.value.container) {
      container = $(binding.value.container)
    }
    // 获取及设置缩放比例
    let getZoom = (container) => {
      let scaleY = 1
      let scaleX = 1
      // 如果指定了父容器，按比例进行缩放
      if (container) {
        let transformData = transformReg6.exec(container.css('transform'))
        if (transformData) {
          scaleX = transformData[1]
          scaleY = transformData[4]
        } else if (container.css('zoom')) {
          scaleY = scaleX = container.css('zoom')
        }
      }
      return scaleX
    }
    let zoom
    let initHammer = function (element, miniElement, cursor) {
      let f = new Hammer(miniElement.get(0))
      let helper = new MultiCompResize(container)
      f.get('pan').set({
        threshold: 0,
        direction: Hammer.DIRECTION_ALL
      })
      f.on('panstart', function (event) {
        helper.resizeStart(element, event, getZoom(container))
        ResizerPlugins.start(event, element, binding.value.all, binding.value.point)
        if (binding.value && binding.value.onStart) {
          binding.value.onStart(event.center)
        }
      })
      f.on('panmove', function (event) {
        event.preventDefault()
        event.srcEvent.stopPropagation()

        // 左 上 暂时忽略
        let m = helper.resizeMove(element, cursor, event)
        m = ResizerPlugins.moving(event, m, element, cursor)
        element.width(m.width)
        element.height(m.height)
        // 将鼠标位置，缩放值回传
        if (binding.value && binding.value.onMove) {
          // binding.value.onMove(event.center, m)
        }
      })
      f.on('panend', function (event) {
        helper.resizeEnd(element)
        ResizerPlugins.end(event, element)
        if (binding.value && binding.value.onResizerEnd) {
          binding.value.onResizerEnd(event.center, {
            top: parseInt(element.css('top')),
            left: parseInt(element.css('left')),
            width: element.width(),
            height: element.height()
          })
        }
      })
    }
    // 画UI 四个边和球
    let n = $('<div class="bar bar-n"></div>')
    let s = $('<div class="bar bar-s"></div></div>')
    let e = $('<div class="bar bar-e"><div></div></div>')
    let w = $('<div class="bar bar-w"></div></div>')
    let ne = $('<div class="bar bar-ne bar-radius">')
    let nw = $('<div class="bar bar-nw bar-radius">')
    let se = $('<div class="bar bar-se bar-radius">')
    let sw = $('<div class="bar bar-sw bar-radius">')
    element.append(n).append(s).append(e).append(w).append(se)

    initHammer(element, e, Cursor.RESIZE_E)
    // initHammer(element, w, Cursor.RESIZE_W)
    // initHammer(element, n, Cursor.RESIZE_N)
    initHammer(element, s, Cursor.RESIZE_S)
    // initHammer(element, ne, Cursor.RESIZE_NE)
    // initHammer(element, nw, Cursor.RESIZE_NW)
    initHammer(element, se, Cursor.RESIZE_SE)
    // initHammer(element, sw, Cursor.RESIZE_SW)
  }
})
export default resizerDirective
