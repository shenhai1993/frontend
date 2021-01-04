// 2018-01-25 拖拽区域时，启用网格吸附效果，必须和DragPlugins组合使用
// let gridsnap = new DragSnap()
// gridsnap.setParams(gw, gh, this.tpl.rows, this.tpl.columns)
export let DragGridSnap = function () {
  let o = {
    // 每一个网格的宽度
    width: 192,
    // 每一个网络的高度
    height: 108,
    // 所有行数
    rows: 10,
    // 所有列数
    columns: 10
  }
  o.setParams = function (width, height, rows, columns) {
    o.width = width
    o.height = height
    o.rows = rows
    o.columns = columns
  }
  o.dragStart = function (event, container, nodes, self) {
  }
  o.dragPanend = function (e) {
  }
  // 拖坳时检查, 确立
  o.dragMove = function (e, l, t, ui) {
    var i = 0
    var offset = 10
    for (i = 0; i < o.rows + 1; i++) {
      // 上边缘
      if (Math.abs(t - o.height * i) < offset) {
        t = o.height * i
      }
      // 下边缘
      if (Math.abs(t + ui.height() - o.height * i) < offset) {
        t = o.height * i - ui.height()
      }
    }
    for (i = 0; i < o.columns + 1; i++) {
      if (Math.abs(l - o.width * i) < offset) {
        l = o.width * i
      }
      // 右边缘
      if (Math.abs(l + ui.width() - o.width * i) < offset) {
        l = o.width * i - ui.width()
      }
    }
    return {t: t, l: l}
  }
  return o
}

export let ResizerGridSnap = function () {
  let o = {
    // 每一个网格的宽度
    width: 192,
    // 每一个网络的高度
    height: 108,
    // 所有行数
    rows: 10,
    // 所有列数
    columns: 10
  }
  o.setParams = function (width, height, rows, columns) {
    o.width = width
    o.height = height
    o.rows = rows
    o.columns = columns
  }
  o.start = function (event, container, nodes, self) {
  }
  o.end = function (e) {
  }
  // 缩放时检查, 只允许左、下拖动。所以只需要设置宽和高即可
  o.moving = function (event, m, ui, cursor) {
    let gW = o.width
    let gH = o.height
    let i = 0
    var offset = gW / 20
    var bottom = m.top + m.height
    var right = m.left + m.width
    // 只处理右下
    if (/^(se|s|e)(.*)$/.test(cursor)) {
      for (i = 1; i < o.rows; i++) {
        // 下边缘
        if (Math.abs(bottom - gH * i) < offset) {
          m.height = gH * i - m.top
        }
      }
      for (i = 1; i < o.columns; i++) {
        if (Math.abs(right - gW * i) < offset) {
          m.width = gW * i - m.left
        }
      }
    }
    return m
  }
  return o
}
