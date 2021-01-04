// 在 drag 指定的point和 兄弟元素时，和兄弟元素吸附，以及附加线条指示
// 参数有说明
// TODO canvas查找依赖应该消除
export default function () {
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
  o.dragStart = function (e, container, nodes, self) {
    this.canvas = container.find('canvas')[0]
    this.nodes = nodes
    this.selfid = self.id
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
  // e event对象
  // l left
  // t top
  // nodes 所有兄弟节点，含自身
  // selfid 自身节点id，用来剔除比较
  // ep 自身节点的 jquery.Element
  o.dragMove = function (e, l, t, ep) {
    let l1 = l
    let linel = l
    let t1 = t
    let linet = t
    // 2. 计算左右邻居吸附，需要传递邻居的数据
    if (o.nodes) {
      o.nodes.forEach(function (n) {
        if (n.id !== o.selfid) {
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
