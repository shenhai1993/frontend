import Hammer from 'hammerjs'
import $ from 'jquery'
/* eslint-disable no-useless-escape */
/**
* 拖动 移动元素位置
* 使用方法 v-drag，属性：
    point 拖动元素绑定的数据对象
    all   所有的数据对象，以便计算吸附、冲突检查等工作
* 如： v-drag="{ container: '#preview', point: data, all: tpl.data, onDrag: onDrag}" >
* 事件：
*  onDrag 拖动完成时调用，传递新的位置数据
*/
/**
 * 拖动插件列表。
 * 原理：分别在开始、移动、结束时，调用插件列表中，每一个插件的对应方法
 * 移动过程中，位置对象会依次处理。所以以最后一个插件计算为准。
 */
export let DragPlugins = {
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
      obj.dragStart(event, container, nodes, self)
    }
  },
  end: function (event, ui) {
    for (let i = 0; i < this.list.length; i++) {
      let obj = this.list[i]
      obj.dragPanend(event, ui)
    }
  },
  // e event
  // l left值
  // t top值
  // element dom对象
  moving: function (e, l, t, element) {
    let o = {t: t, l: l}
    for (let i = 0; i < this.list.length; i++) {
      let obj = this.list[i]
      o = obj.dragMove(e, o.l, o.t, element)
    }
    return o
  }
}

// 导出的拖拽函数
export let dragDirective = (options) => ({
  bind: function (myElement, binding) {
    let de = $('<drag class=\'drag\'></drag>')
    $(myElement).append(de)
  },
  update: function (myElement, binding) {
  },
  inserted: function (myElement, binding, vnode) {
    let element = $(myElement)
    let dragEl = element.find('drag')[0]
    let container = null
    if (binding.value) {
      if (binding.value.container === 'parent') {
        container = element.parent()
      } else if (binding.value.container) {
        container = $(binding.value.container)
      }
    }
    // Vue专用，指定拖拽影响的目标
    if (binding.value && binding.value.target) {
      if (binding.value.refs) {
        element = $(binding.value.refs[binding.value.target])
      }
    }
    let hammertime = new Hammer(dragEl)
    // 自己的属性对象
    let point = {}
    if (binding.value && binding.value.point) {
      point = binding.value.point
    }
    let zoom = 1
    // 如果指定了父容器且有缩放，按比例拖动
    let getScale = function () {
      let z = 1
      if (container) {
        if (container.css('zoom')) {
          z = container.css('zoom')
        }
      }
      return z
    }

    hammertime.on('panstart', function (e) {
      e.preventDefault()
      e.srcEvent.stopPropagation()
      element.addClass('moving')
      zoom = getScale()
      DragPlugins.start(e, container, binding.value.all, point)
    })
    hammertime.on('panend', function (e) {
      e.preventDefault()
      e.srcEvent.stopPropagation()
      element.removeClass('moving')
      DragPlugins.end(e, element)

      if (binding.value && binding.value.onDrag) {
        // 使用回调通知上层
        binding.value.onDrag(parseInt(element.css('left')), parseInt(element.css('top')))
      }
    })
    hammertime.on('panmove', function (e) {
      e.preventDefault()
      e.srcEvent.stopPropagation()
      let l = (point.left + e.deltaX / zoom)
      let t = (point.top + e.deltaY / zoom)
      if (t <= 10) t = 0
      if (l <= 10) l = 0
      // 1. 计算不超出边界
      if (container) {
        if (l + element.innerWidth() > container.width()) {
          l = container.width() - element.innerWidth()
        }
        if (t + element.innerHeight() > container.height()) {
          t = container.height() - element.innerHeight()
        }
      }
      let o = {t: t, l: l}
      // 通过各种插件 计算其它属性
      o = DragPlugins.moving(e, l, t, element)

      o.t = Math.round(o.t)
      o.l = Math.round(o.l)
      element.css('top', o.t + 'px')
      element.css('left', o.l + 'px')
    })
  }
})

export default dragDirective
