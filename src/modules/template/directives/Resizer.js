import Hammer from 'hammerjs'
import $ from 'jquery'
/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */

// 边角
const Cursor = {
  RESIZE_W: 'w-resize',
  RESIZE_E: 'e-resize',
  RESIZE_N: 'n-resize',
  RESIZE_S: 's-resize',
  RESIZE_SE: 'se-resize',
  RESIZE_SW: 'sw-resize',
  RESIZE_NE: 'ne-resize',
  RESIZE_NW: 'nw-resize'
}
// 计算辅助类 计算值，但并不应用到元素
// object {scaleX: 1, scaleY: 1}
// container jqueryElement 父容器
let MultiCompResize = function (container) {
  let mResizer = {}
  let point = {}
  // 设置缩放比例
  let zoom = 2
  // 检查三个方向的： E, S ， 和ES，其它的要单独检查
  mResizer.CheckESES = function (o) {
    if (o.hasOwnProperty('width')) {
      if (Math.abs(o.width - point.maxWidth) < 20 || o.width > point.maxWidth) o.width = point.maxWidth
      if (o.width < 20) o.width = 20
    }
    if (o.hasOwnProperty('height')) {
      if (Math.abs(o.height - point.maxHeight) < 20 || o.height > point.maxHeight) o.height = point.maxHeight
      if (o.height < 20) o.height = 20
    }
    return o
  }
  // 专业校验在向上拖动时， TOP和Height的值
  mResizer.CheckN = function (o) {
    if (o.t - 20 <= 0) {
      o.t = 0
      o.h = point.top + point.height
    }
    if (o.h < 20) {
      o.h = 20
      o.t = point.top + (point.height - 20)
    }
    return o
  }

  // 专业校验在向右拖动时， Left和Width的值
  mResizer.CheckW = function (o) {
    if (o.l - 20 <= 0) { // 到达左边界，固定left和width
      o.l = 0
      o.w = point.right
    }
    // 当宽度即将小于20时，不能再小了
    if (o.w < 20) {
      o.w = 20
      o.l = point.left + (point.width - 20)
    }
    return o
  }
  /**
   * 拖动开始， 计算允许的最大值
   * 重新计算框的宽度和高度（因为圆球产生的鼠标偏差，放大镜）
   * @param element   li
   */
  mResizer.resizeStart = function (element, e, zoom) {
    this.zoom = zoom
    point.left = parseInt(element.css('left'))
    point.top = parseInt(element.css('top'))
    point.width = element.width()
    point.height = element.height()
    point.right = point.left + point.width // 右边
    point.bottom = point.top + point.height // 底边
    point.maxWidth = container.outerWidth() - point.left
    point.maxHeight = container.outerHeight() - point.top
  }
  /**
   * 调整元素大小。达到边界，吸附效果
   * @param element   li
   * @param b
   * @param e         hammer event
   * @returns {*}     变化的值
   */
  mResizer.resizeMove = function (element, b, e) {
    let c = Cursor
    let m = point
    let s = {}
    let leftPoss = 244
    let topPoss = 141
    switch (b) {
      case c.RESIZE_E: // 右
        s.width = (e.center.x + window.scrollX - leftPoss) / this.zoom - point.left
        this.CheckESES(s)
        m.width = s.width
        break
      case c.RESIZE_S: // 下
        s.height = (e.center.y + window.scrollY - topPoss) / this.zoom - point.top
        this.CheckESES(s)
        m.height = s.height
        break
      case c.RESIZE_SE: // 右下
        s = {
          width: (e.center.x + window.scrollX - leftPoss) / this.zoom - point.left,
          height: (e.center.y + window.scrollY - topPoss) / this.zoom - point.top
        }
        this.CheckESES(s)
        m.width = s.width
        m.height = s.height
        break
      case c.RESIZE_W: // 左
        s.l = (e.center.x + window.scrollX - leftPoss) / this.zoom
        s.w = point.right - s.l
        this.CheckW(s)
        m.width = s.w
        m.left = s.l
        break
      case c.RESIZE_N: // 上
        s.t = (e.center.y + window.scrollY - topPoss) / this.zoom
        s.h = point.bottom - s.t
        this.CheckN(s)
        m.top = s.t
        m.height = s.h
        break
      case c.RESIZE_SW: // 左下角
        s.l = (e.center.x + window.scrollX - leftPoss) / this.zoom
        s.w = point.right - s.l
        s.height = (e.center.y + window.scrollY - topPoss) / this.zoom - point.top
        // 走 w 判断 left 和 width，
        this.CheckW(s)
        // 走s 判断 高
        this.CheckESES(s)
        m.left = s.l
        m.width = s.w
        m.height = s.height
        break
      case c.RESIZE_NE: // 右上角
        s.t = (e.center.y + window.scrollY - topPoss) / this.zoom
        s.h = point.bottom - s.t
        s.width = (e.center.x + window.scrollX - leftPoss) / this.zoom - point.left
        // 走 N 判断 top和height
        this.CheckN(s)
        // 走s 判断 宽
        this.CheckESES(s)
        m.top = s.t
        m.width = s.width
        m.height = s.h
        break
      case c.RESIZE_NW: // 左上角  最复杂，同时改四个值
        s.t = (e.center.y + window.scrollY - topPoss) / this.zoom
        s.h = point.bottom - s.t
        s.l = (e.center.x + window.scrollX - leftPoss) / this.zoom
        s.w = point.right - s.l
        // 走 N 判断 top和height
        this.CheckN(s)
        m.top = s.t
        m.height = s.h
        // 走 w 判断 left 和 width
        this.CheckW(s)
        m.left = s.l
        m.width = s.w
        break
    }
    return m
  }
  mResizer.resizeEnd = function () {}
  return mResizer
}
// vue指令插件
export default (options) => ({
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
      if (container) { // 如果指定了父容器，按比例进行缩放
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
        if (binding.value && binding.value.onStart) {
          binding.value.onStart(event.center)
        }
      })
      f.on('panmove', function (a) {
        a.preventDefault()
        a.srcEvent.stopPropagation()
        let m = helper.resizeMove(element, cursor, a)
        // 将鼠标位置，缩放值回传
        binding.value.onMove(a.center, m)
      })
      f.on('panend', function (a) {
        helper.resizeEnd(element)
        if (binding.value && binding.value.onResizerEnd) {
          binding.value.onResizerEnd()
        }
      })
    }
    // 画UI 四个边和球
    let n = $('<div class="bar bar-n"><div class="bar-radius"></div></div>')
    let s = $('<div class="bar bar-s"><div class="bar-radius"></div></div>')
    let e = $('<div class="bar bar-e"><div class="bar-radius"></div></div>')
    let w = $('<div class="bar bar-w"><div class="bar-radius"></div></div>')
    let ne = $('<div class="bar bar-ne bar-radius">')
    let nw = $('<div class="bar bar-nw bar-radius">')
    let se = $('<div class="bar bar-se bar-radius">')
    let sw = $('<div class="bar bar-sw bar-radius">')
    element.append(n).append(s).append(e).append(w).append(ne).append(se).append(sw).append(nw)

    initHammer(element, e, Cursor.RESIZE_E)
    initHammer(element, w, Cursor.RESIZE_W)
    initHammer(element, n, Cursor.RESIZE_N)
    initHammer(element, s, Cursor.RESIZE_S)
    initHammer(element, ne, Cursor.RESIZE_NE)
    initHammer(element, nw, Cursor.RESIZE_NW)
    initHammer(element, se, Cursor.RESIZE_SE)
    initHammer(element, sw, Cursor.RESIZE_SW)
  }
})
