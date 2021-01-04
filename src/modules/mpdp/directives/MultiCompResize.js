// 边角
export let Cursor = {
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
export let MultiCompResize = function (container) {
  let mResizer = {}
  let point = {}
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
    // 到达左边界，固定left和width
    if (o.l - 20 <= 0) {
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
    point.right = point.left + point.width// 右边
    point.bottom = point.top + point.height// 底边
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
  mResizer.resizeMove = function (ui, b, e) {
    let c = Cursor
    let m = point
    let s = {}
    let leftPoss = 244
    let topPoss = 141
    switch (b) {
      // 右
      case c.RESIZE_E:
        s.width = (e.center.x + window.scrollX - leftPoss) / this.zoom - point.left
        this.CheckESES(s)
        m.width = s.width
        break
      // 下
      case c.RESIZE_S:
        s.height = (e.center.y + window.scrollY - topPoss) / this.zoom - point.top
        this.CheckESES(s)
        m.height = s.height
        break
      // 右下
      case c.RESIZE_SE:
        s = {
          width: (e.center.x + window.scrollX - leftPoss) / this.zoom - point.left,
          height: (e.center.y + window.scrollY - topPoss) / this.zoom - point.top
        }
        this.CheckESES(s)
        m.width = s.width
        m.height = s.height
        break
      // 左
      case c.RESIZE_W:
        s.l = (e.center.x + window.scrollX - leftPoss) / this.zoom
        s.w = point.right - s.l
        this.CheckW(s)
        m.width = s.w
        m.left = s.l
        break
      case c.RESIZE_N:
        // 上
        s.t = (e.center.y + window.scrollY - topPoss) / this.zoom
        s.h = point.bottom - s.t
        this.CheckN(s)
        m.top = s.t
        m.height = s.h
        break
      // 左下角
      case c.RESIZE_SW:
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
      // 右上角
      case c.RESIZE_NE:
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
      // 左上角  最复杂，同时改四个值
      case c.RESIZE_NW:
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

export default MultiCompResize
