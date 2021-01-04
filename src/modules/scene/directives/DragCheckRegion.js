// 用来检查 一个网格内，不能重叠的区域
import { Regions } from '../../_template/static/Creator'
import creator from '../static/Creator'
import { Notification } from 'element-ui'

// 检查区域，一个格子里是否存在两个视频或信源区域
// o  object {self 原始数据对象。 nodes 所有兄弟。 gw 格宽，格高}
// ui 拖动对象的dom元素
const CheckFn = function (o, ui) {
  if (!Regions[o.self.type].clashCheck || o.nodes.length <= 1) {
    return false
  }
  let cross = false
  let rect = {
    left: ui.position().left,
    top: ui.position().top,
    width: ui.width(),
    height: ui.height()
  }
  rect = creator.getDivIndex(rect, o.gw, o.gh)
  for (let i = 0; i < o.nodes.length; i++) {
    let node = o.nodes[i]
    // 如果是自己和自己对比，或者类型不需要检查
    if (node.id === o.self.id || !Regions[node.type].clashCheck) {
      continue
    }
    // 占屏幕计算
    let screenNode = creator.getDivIndex(node, o.gw, o.gh)
    if (creator.CrossLine(screenNode, rect)) {
      cross = true
      break
    }
  }
  return cross
}
export let DragCheck = function () {
  let o = {
    nodes: null,
    self: null,
    gw: 192,
    gh: 108,
    rows: 1,
    height: 1
  }
  o.setParams = function (width, height, rows, columns) {
    o.gw = width
    o.gh = height
    o.rows = rows
    o.columns = columns
  }
  o.dragStart = function (e, container, nodes, self) {
    o.nodes = nodes
    o.self = self
  }
  // 落地时检查，如果有冲突，将 dom 还原至初始状态
  // 1. 将当前dom，计算它占的屏幕的矩形数据
  // 2, 查找所有视频区域所占屏幕的矩形，和dom逐个比较
  o.dragPanend = function (event, ui) {
    let cross = CheckFn(o, ui)
    if (cross) {
      Notification({
        message: '一块屏幕不能出现多个视频或信源区域，请检查',
        type: 'warning'
      })
      ui.css('top', o.self.top + 'px')
      ui.css('left', o.self.left + 'px')
    }
  }

  o.dragMove = function (e, l, t, element) {
    return {t: t, l: l}
  }
  return o
}

// 缩放大小时
export let ResizerCheck = function () {
  let o = {
    gw: 192,
    gh: 108,
    rows: 1,
    height: 1,
    nodes: null
  }
  o.setParams = function (width, height, rows, columns) {
    o.gw = width
    o.gh = height
    o.rows = rows
    o.columns = columns
  }
  o.start = function (event, container, nodes, self) {
    o.self = self
    o.nodes = nodes
  }
  // 结束时检查冲突
  o.end = function (event, ui) {
    let cross = CheckFn(o, ui)
    if (cross) {
      Notification({
        message: '一块屏幕不能出现多个视频或信源区域，请检查',
        type: 'warning'
      })
      ui.width(o.self.width)
      ui.height(o.self.height)
    }
  }
  o.moving = function (event, m, ui, cursor) {
    return m
  }
  return o
}
