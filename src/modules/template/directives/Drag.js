import Hammer from 'hammerjs'
import $ from 'jquery'
/* eslint-disable no-useless-escape */
/**
* 拖动
* 使用方法 v-drag
  point 绑定的数据对象
  all   所有可拖动的区域，支持吸附
* <div v-drag="{ container: '#preview', all: regions, onDrag: onDrag  }"></div>
*/

// 在 drag 指定的point和 兄弟元素时，和兄弟元素吸附，以及附加线条指示
const DragHelper = function (point, ep) {
  let o = {
    canvas: null,
    context: null
  }
  // 获取及设置缩放比例
  // 画水平的线
  o.dragHorizontalLine = function (context, top) {
    if (this.canvas) {
      top = top + 0.5
      context.beginPath()
      context.strokeStyle = '#8affa4'
      context.moveTo(0, top)
      context.lineTo(this.canvas.width + 0.5, top)
      context.closePath()
      context.stroke()
    }
  }
  // 画垂直的线
  o.dragVerticalLine = function (context, left) {
    if (this.canvas) {
      left = left + 0.5
      context.beginPath()
      context.strokeStyle = '#8affa4'
      context.moveTo(left, 0)
      context.lineTo(left, this.canvas.height + 0.5)
      context.closePath()
      context.stroke()
    }
  }

  // 清理画的线
  o.closeContext = function () {
    if (this.context) {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
  }
  // 开始，找出canvas，好画线
  o.dragStart = function (e, container) {
    this.canvas = container.find('canvas')[0]
    if (this.canvas) {
      o.context = o.canvas.getContext('2d')
      this.canvas.width = Math.round(container.width())
      this.canvas.height = Math.round(container.height())
    }
  }
  // 结束时清理线
  o.dragPanend = function (e) {
    this.closeContext()
  }
  // 拖坳时检查
  o.dragMove = function (e, l, t, nodes) {
    let l1 = l
    let linel = l
    let t1 = t
    let linet = t
    // 2. 计算左右邻居吸附，需要传递邻居的数据
    if (nodes) {
      nodes.forEach(function (n) {
        if (n.id !== point.id) {
          if (Math.abs(t - n.top) < 10) {
            // 顶与顶部
            t = n.top
            linet = t
          } else if (Math.abs(t - n.top - n.height) < 10) {
            // 顶与底
            t = n.top + n.height
            linet = t
          } else if (Math.abs((t + ep.innerHeight()) - (n.top + n.height)) < 10) {
            // 底与底
            t = n.top + n.height - ep.innerHeight()
            linet = n.top + n.height
          } else if (Math.abs(t + ep.innerHeight() - n.top) < 10) {
            // 底与顶
            t = n.top - ep.innerHeight()
            linet = n.top
          }

          if (Math.abs(l - n.left) < 10) {
            // 左边与左边
            l = n.left
            linel = l
          } else if (Math.abs(l - n.left - n.width) < 10) {
            // 左边与右边
            l = n.left + n.width
            linel = l
          } else if (Math.abs((l + ep.innerWidth()) - (n.left + n.width)) < 10) {
            // 右边与右边
            l = n.left + n.width - ep.innerWidth()
            linel = n.left + n.width
          } else if (Math.abs(l + ep.innerWidth() - n.left) < 10) {
            // 右边与左边
            l = n.left - ep.innerWidth()
            linel = n.left
          }
        }
      })
    }
    // 3. 计算网格吸附， 未完成
    if (l1 !== l) {
      // 划竖线
      this.dragVerticalLine(this.context, linel)
    }
    if (t1 !== t) {
      // 划横线
      this.dragHorizontalLine(this.context, linet)
    }
    if (l1 === l && t1 === t) {
      this.closeContext()
    }
    return {t: t, l: l}
  }
  return o
}

// 导出的拖拽类
export default (options) => ({
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
    let helper = null
    let point = {}
    if (binding.value && binding.value.point) {
      point = binding.value.point
      helper = new DragHelper(point, element)
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
      if (helper) {
        helper.dragStart(e, container)
      }
    })
    hammertime.on('panend', function (e) {
      e.preventDefault()
      e.srcEvent.stopPropagation()
      element.removeClass('moving')
      if (helper) {
        helper.dragPanend(e)
      }
      // 向上报告完成
      if (binding.value && binding.value.onDrag) {
        // 使用回调通知上层
        binding.value.onDrag(parseInt(element.css('left')), parseInt(element.css('top')))
      }
    })
    hammertime.on('panmove', function (e) {
      e.preventDefault()
      e.srcEvent.stopPropagation()
      let l = (point.left >> 0) + (e.deltaX / zoom)
      let t = (point.top >> 0) + (e.deltaY / zoom)
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
      // 通过伪插件 计算其它属性
      if (helper) {
        o = helper.dragMove(e, l, t, binding.value.all)
      }
      o.t = Math.round(o.t)
      o.l = Math.round(o.l)
      element.css('top', o.t + 'px')
      element.css('left', o.l + 'px')
    })
  }
})
