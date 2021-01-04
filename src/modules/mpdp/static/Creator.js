'use strict'

import base from '../../template/static/Creator'

// 最小单位 : 1920 => 16  , salt = 120
const salt = 120

let TemplateCreator2 = base

TemplateCreator2.getRegionSize = (direction = 0) => {
  let w = 100
  let h = 60
  if (parseInt(direction) === 0) {
    return {width: w, height: h}
  }
  return {width: h, height: w}
}

// 根据方向，行数、列数，计算出每一个区域合理的高度、宽度
// 每块屏其实是1920x1080
// 返回对象 width, height 表示一个格子的尺寸
// minH, minW 等比例换算的最小单位，用来计算乘积
TemplateCreator2.getGridSize = (tpl) => {
  let w = 16
  let h = 9
  if (parseInt(tpl.direction) !== 0) {
    // 交换
    let j = w
    w = h
    h = j
  }
  let maxWidth = document.body.clientWidth - 250
  let maxHeight = document.body.clientHeight - 160
  // 网格的比例
  let gw = w * tpl.column
  let gh = h * tpl.row
  // 网格按比例，取在画布中的最大值
  let x1 = maxWidth / gw
  let x2 = maxHeight / gh
  if (x1 > x2) {
    x1 = x2
  }
  x1 = parseInt(x1)
  return {width: x1 * gw / tpl.column, height: x1 * gh / tpl.row, minH: h, minW: w}
}
// 计算两个矩形是否相交
// 两个矩形的重心距离在X和Y轴上都小于两个矩形长或宽的一半之和
TemplateCreator2.CrossLine = (r1, r2) => {
  // 重心1
  let c1 = {
    X: r1.x + r1.width / 2.0,
    Y: r1.y + r1.height / 2.0
  }
  // 重心2
  let c2 = {
    X: r2.x + r2.width / 2.0,
    Y: r2.y + r2.height / 2.0
  }
  return (Math.abs(c1.X - c2.X) < r1.width / 2.0 + r2.width / 2.0 && Math.abs(c2.Y - c1.Y) < r1.height / 2.0 + r2.height / 2.0)
}

// 根据方向计算tpl的宽度和高度
TemplateCreator2.computeSize = (tpl) => {
  let size = base.getGridSize(tpl)
  let gw = size.width
  let gh = size.height
  tpl.gw = gw
  tpl.gh = gh
  tpl.width = gw * tpl.column
  tpl.height = gh * tpl.row
  return tpl
}

// 创建一个模板数据对象
TemplateCreator2.newTpl = (direction = '0') => {
  let data = {
    name: '新建模板',
    direction: parseInt(direction),
    row: 4,
    column: 3,
    data: []
  }
  data = TemplateCreator2.computeSize(data)
  return data
}

/**
 * 一个区域, 计算这个区域占据屏幕的坐标
 * 比如，一个区域横跨了两个屏幕（2，3），结果就是 2和3号屏幕的矩形
 * @param region  区域数据
 * @param zoom
 * @param direction 方向  0 横屏  1 竖屏
 * @returns {{x: number, y: number, width: number, height: number}}
 */
TemplateCreator2.getDivIndex = (region, gw, gh) => {
  // 每一个小块的宽度、高度
  let regionWidth = gw
  let regionHeight = gh

  let zoom = 1
  // 区域的宽高
  let floatDivWidth = region.width
  let floatDivHeight = region.height

  // 区域的左上角
  let floatDivX = region.left
  let floatDivY = region.top

  // 新的 left 值计算：列数xRegionWidth ，计算列数，如果差值小于0.1，忽略
  let columnIndex = floatDivX / regionWidth
  columnIndex = (columnIndex - Math.floor(columnIndex)) > 0.9999 ? Math.round(columnIndex) : Math.floor(columnIndex)
  let rowIndex = floatDivY / regionHeight
  rowIndex = (rowIndex - Math.floor(rowIndex) > 0.9999 ? Math.round(rowIndex) : Math.floor(rowIndex))

  let nx = columnIndex * regionWidth
  let ny = rowIndex * regionHeight

  // dr 右下角，drx，即left值
  let drx = floatDivX + floatDivWidth
  // dr 右下角，dry， 即top 值
  let dry = floatDivY + floatDivHeight

  // 需要占几行，0.1 忽略
  let needRow = (dry - ny) / regionHeight
  // 需要占几行，0.1 忽略
  let needColumn = (drx - nx) / regionWidth
  needRow = (needRow - Math.floor(needRow)) < 0.0002 ? Math.round(needRow) : Math.ceil(needRow)
  needColumn = (needColumn - Math.floor(needColumn)) < 0.0002 ? Math.round(needColumn) : Math.ceil(needColumn)

  let nw = needColumn * regionWidth
  let nh = needRow * regionHeight

  // 应用到表格，需要换算为真实的数值
  return {
    x: Math.round(nx / zoom),
    y: Math.round(ny / zoom),
    width: Math.round(nw / zoom),
    height: Math.round(nh / zoom)
  }
}

// 将tpl中的数据，转换成全尺寸的数值、适应当前屏幕的数值
// 最小单位 : 1920 => 16  , salt = 120
TemplateCreator2.fullSize = (tpl) => {
  let size = base.getGridSize(tpl)
  let scale = tpl.gh / size.minH

  let terminalWidth = size.width / scale * salt
  let terminalHeight = size.height / scale * salt

  tpl.width = (terminalWidth * tpl.column)
  tpl.height = (terminalHeight * tpl.row)
  tpl.data.forEach(region => {
    region.width = region.width / scale * salt
    region.height = region.height / scale * salt
    region.top = region.top / scale * salt
    region.left = region.left / scale * salt
  })
  delete tpl.gw
  delete tpl.gh
  return tpl
}
// 将原始尺寸，转换成适应屏幕的尺寸
// 最小单位 : 1920 => 16  , salt = 120
TemplateCreator2.adaptSize = function (tpl) {
  let size = this.getGridSize(tpl)
  tpl.width = size.width * tpl.column
  tpl.height = size.height * tpl.row
  tpl.gh = size.height
  tpl.gw = size.width

  let scale = tpl.gh / size.minH
  tpl.data.forEach(region => {
    region.width = region.width / salt * scale
    region.height = region.height / salt * scale
    region.top = region.top / salt * scale
    region.left = region.left / salt * scale
  })
  return tpl
}
export default TemplateCreator2
