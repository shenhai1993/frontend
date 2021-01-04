// author: wangwei(w.w@tcl.com)  2017-10-17
// 辅助，在指定的DOM元素上，创建一个基于canvas的网格
// 使用方法：
// import gridLine from '@/components/template/GridLine.js'
// Vue.directive('grid', gridLine())
// <canvas v-grid style="width:100%;height:100%;position:absolute;"></canvas>
// 还应将columns和rows回传，便于其它程使用此网格
import $ from 'jquery'
export default (options) => ({
  bind: function (myElement, binding) {
  },
  update: function (myElement, binding, vnode) {
    let columns = 3
    let rows = 4
    if (binding.value) {
      columns = binding.value.columns || 3
      rows = binding.value.rows || 4
    }

    // let rows = binding.value.row
    let element = $(myElement)
    let context = myElement.getContext('2d')
    let cWidth = Math.round(element.width())
    let cHeight = Math.round(element.height())

    let gridWidth = cWidth / columns
    let gridHeight = cHeight / rows
    // 必须固定值，写 100% 不顶用
    element.attr('width', cWidth)
    element.attr('height', cHeight)
    context.strokeStyle = 'rgb(15,15,105)'

    let floor = function (a) {
      let b = Math.round(a)
      return a >= b ? b + 0.5 : b - 0.5
    }
    // 画一条线
    let darwLine = function (a, b, x, y, context) {
      a = floor(a)
      b = floor(b)
      x = floor(x)
      y = floor(y)
      context.beginPath()
      context.moveTo(a, b)
      context.lineTo(x, y)
      context.closePath()
      context.lineWidth = 1
      context.stroke()
    }
    // 画竖线
    for (let i = 1; i < columns; i++) {
      darwLine(gridWidth * i, 0, gridWidth * i, cHeight, context)
    }
    // 画横线
    for (let j = 1; j < rows; j++) {
      darwLine(0, gridHeight * j, cWidth, gridHeight * j, context)
    }
    // element.css('background', 'url(\'' + context.canvas.toDataURL() + '\')')
  },
  componentUpdated: function (myElement, binding) {
  },
  inserted: function (myElement, binding, vnode) {
  }
})
