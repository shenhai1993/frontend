'use strict'

import EventEmitter from 'events'
import $ from 'jquery'

import TypeFactory from './factory'
import { floor } from './utils'

const draggable = require('jquery-ui/ui/widgets/draggable')
const resizable = require('jquery-ui/ui/widgets/resizable')

const SPECIAL_REGION = ['date', 'time', 'city', 'text', 'weathertemplate', 'weatherimg', 'temp']

class Region extends EventEmitter {
  constructor (options) {
    super()

    Object.assign(this, options, {
      aspectRatio: ''
    })

    this.init()
    this.zoom(this.rate)
  }

  getDom () {
    return this.dom
  }

  focus () {
    this.dom.addClass('selected')
    this.dom.css('z-index', 99)

    this.emit('focus', this)
  }

  unfocus () {
    this.dom.removeClass('selected')
    this.dom.css('z-index', this.t.index)
  }

  scale (ratio, mode) {
    if (this.aspectRatio === ratio) return

    this.dom.resizable('destroy')

    this.resizable()
    this.adjust()
    this.scaleMode = mode
    this.aspectRatio = ratio

    if (typeof ratio === 'number') { // !布尔值即为固定比例，故调整区域的宽或高，以适合当前的比例
      this.resize(ratio)
    }

    return this
  }

  resize (ratio) {
    // this.dom.animate({
    //   height: this.dom.width() / ratio
    // })
  }

  zoom (rate) {
    this.rate = rate

    this.dom.css({
      top: floor(this.y * rate),
      left: floor(this.x * rate),
      width: floor(this.width * rate),
      height: floor(this.height * rate)
    })

    if (this.type === 'date' || this.type === 'time' || this.type === 'city' || this.type === 'weathertemplate' || this.type === 'weatherimg') {
      console.log(this.fontsize)
      this.dom.css({
        'font-size': `${floor(this.fontsize * rate)}px`
      })
      console.log(this.dom.css('font-size'))
    }

    this.adjust()
  }

  /**
   * 销毁当前区域
   */
  destroy () {
    this.dom.unbind() // 移除所有的事件
    this.dom.remove() // 从dom树移除
  }

  toJSON () {
    let json = {
      id: this.id,
      type: this.type,
      color: this.t.color,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      border: '2px solid #fff',
      background: this.t.background
    }

    if (SPECIAL_REGION.includes(this.type)) {
      json = Object.assign(json, {
        txtsize: this.t.fontsize
      })
    }
    if (this.type === 'text') {
      json = Object.assign(json, {
        txtsize: 50,
        align: 2,
        font: 0
      })
    }

    return json
  }

  init () {
    let t = TypeFactory.get(this.type)
    this.t = t
    let textize = (t.type === 'text' && this.text !== undefined) ? this.text : t.text
    this.x = this.x || 0
    this.y = this.y || 0
    this.width = this.width || t.width
    this.height = this.height || t.height
    this.fontsize = this.txtsize || t.fontsize
    this.dom = $(`<div style="border:2px solid #fff;box-sizing: border-box"><span class="textType ${t.type}" style="color: ${t.color}">${textize}</span></div>`)
    this.dom.id = `region_${this.id}`
    this.dom.addClass(`region ${t.type}`)
    this.dom.width(floor((t.width || this.width) * this.rate))
    this.dom.height(floor((t.height || this.height) * this.rate))
    this.dom.css({'position': 'absolute'})
    this.dom.css({
      'top': 0,
      'font-size': `${this.t.fontsize}px`,
      'left': 0,
      'color': this.t.color,
      'backgroud-color': this.t.backgroud,
      'z-index': t.index
    })

    // 新建的区域自动获得焦点
    this.focus()

    // add click event to region
    this.dom.click(() => {
      this.focus() // 让被点击的区域获得焦点(opcacity = 1)
    })

    if (this.editable) {
      if (t.dragable) this.dragable()
      if (t.resizable) this.resizable()
      this.removable()
    }
    if (this.file && t.file) {
      let plus = $(`<i class="fa fa-plus center" style="color: ${t.color}"></i>`)
      plus.click(() => {
        this.emit('plus', this)
      })
      this.dom.append(plus)
    }
    if (t.textarea && this.file) {
      let plus = $(`<i class="fa fa-plus center" style="color: ${t.color};z-index: 66"></i>`)
      plus.click(() => {
        this.emit('plus', this)
      })
      this.dom.append(plus)
    }
  }

  dragable () {
    // 赋予区域可拖拽的能力
    let options = {
      // opacity: 1,
      refreshPositions: true,
      cursor: 'move',
      containment: this.canvas,
      start: (e, ui) => {
        this.focus(this.dom) // 让被拖拽的区域获得焦点(opcacity = 1)
      },
      stop: (e, ui) => {
        // this.caculateReal() // 计算真实比例值
        this.adjust() // 调整越界
        this.real(ui)

        this.emit('dragstop', this.dom)
      },
      drag: (e, ui) => {
        this.real(ui)
        this.emit('drag', this.dom)
      }
    }

    if (!SPECIAL_REGION.includes(this.type)) {
      options = Object.assign(options, {
        snap: {
          snap: function (event, ui) {
            // console.log('onsnap') // 被吸附的事件
            this.x += 1
            this.width += 1
          },
          release: function (event, ui) {
            // console.log('onrelease') // 脱离吸附的事件
            this.x -= 1
            this.width -= 1
          }
        },
        snapMode: 'outer',
        snapTolerance: 10,
        snapStop: () => {},
        onSnap: () => {}
      })
    }

    return draggable(options, this.dom)
  }

  resizable () {
    // 赋予区域缩放的能力
    return resizable({
      containment: this.canvas,
      minHeight: floor(100 * this.rate),
      minWidth: floor(150 * this.rate),
      aspectRatio: this.aspectRatio,
      handles: 'n, e, s, w, ne, se, sw, nw',
      resize: (e, ui) => {
        this.real(ui)
        console.log('resize')
        this.emit('resize', this.dom)
      },
      stop: (e, ui) => {
        this.real(ui)
        console.log('resized')
        this.emit('resized', this.dom)
      }
    }, this.dom)
  }

  removable () {
    // close button
    let x = $(`<i class="fa fa-times right" style="color: ${this.t.color}"></i>`)
    x.click(() => {
      // this.destroy() // who create, who destroy

      this.emit('remove', this)
    })
    this.dom.append(x)
  }

  /**
   * 拖拽后调整由于draggable snap的bug导致区域越界的问题
   *
   * @param {dom} target
   * @return void
   */
  adjust () {
    let canvas = $(this.canvas)
    let position = this.dom.position()

    // 检查区域是否超出容器的上侧
    if (position.top < 0) {
      this.dom.css({ 'top': '0px' })
    }

    // 检查区域是否超出容器的左侧
    if (position.left < 0) {
      this.dom.css({ 'left': '0px' })
    }

    // 检查区域是否超出容器的右侧侧
    let maxWidth = canvas.width()
    if ((position.left + this.dom.width()) > maxWidth) {
      this.dom.css({ 'left': `${maxWidth - this.dom.width()}px` })
    }

    // 检查区域是否超出容器的下侧
    let maxHeight = canvas.height()
    if ((position.top + this.dom.height() > maxHeight)) {
      this.dom.css({ 'top': `${maxHeight - this.dom.height()}px` })
    }
  }

  real (ui) {
    if (ui.position) {
      this.x = floor(ui.position.left / this.rate)
      this.y = floor(ui.position.top / this.rate)
    }

    if (ui.size) {
      this.width = floor(ui.size.width / this.rate)
      this.height = floor(ui.size.height / this.rate)
    }
  }
  resetPosition (n, t) {
    this[t] = n
  }
}

export default Region
