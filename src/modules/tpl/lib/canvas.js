'use strict'

import $ from 'jquery'

class Canvas {
  constructor (options) {
    Object.assign(this, options || {})

    this.width = this.direction === 0 ? 1920 : 1080
    this.height = this.direction === 0 ? 1080 : 1920

    this.dom = $(this.canvas)
    this.zoom(this.rate)
  }

  append (region) {
    this.dom.append(region)
  }

  getDom () {
    return this.dom
  }

  zoom (rate) {
    this.rate = rate
    let width = Math.floor(this.width * rate)
    let height = Math.floor(this.height * rate)

    this.dom.css({
      width: width,
      height: height
    })
  }

  destroy () {
    // this.dom.remove()
  }
}

export default Canvas
