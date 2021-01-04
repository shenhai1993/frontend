'use strict'

import EventEmitter from 'events'
import $ from 'jquery'
import RefLine from './ref-line'

import Canvas from './canvas'
import Region from './region'

class Template extends EventEmitter {
  constructor (options) {
    super()

    Object.assign(this, {
      focused: null,
      changed: false,
      max: {
        video: 1,
        text: 5,
        city: 1,
        image: 20,
        webpage: 3,
        tv: 1,
        date: 1,
        time: 1,
        weathertemplate: 1,
        weatherimg: 1
      }
    }, options)

    this.init()
  }

  createRegion (options) {
    if (options.type === 'source') options.type = 'tv' // 兼容之前做好的模板中包含source类型

    // 检查区域类型最大数量是否超标
    if (!this.check(options.type)) {
      console.log(`${options.type} max`)

      return this.emit('max')
    } else {
      this.emit('addTpl')
    }

    let opts = Object.assign({
      id: this.regions.length,
      rate: this.rate,
      file: this.file,
      canvas: this.container,
      editable: this.editable
    }, options)

    let region = new Region(opts)
    this.canvas.append(region.getDom())

    region.on('drag', dom => {
      this.refLine.check(dom.get(0), '.region')

      let json = region.toJSON()
      this.showHelper(json)
    })
    region.on('dragstop', dom => {
      this.refLine.uncheck()
      this.emit('edit_data', dom)
      this.emit('changed')
    })

    region.on('resize', dom => {
      let json = region.toJSON()
      this.showHelper(json)
      // this.refLine.check(dom.get(0), '.region'))
    })
    region.on('resized', dom => { // resize stop
      this.emit('edit_data', dom)
      this.emit('changed')
    })

    region.on('remove', region => {
      this.removeRegion(region) // remove from regions list
      region.destroy() // who create, who destroy
      this.emit('changed')
      this.emit('delete_data', region)
    })

    region.on('focus', region => {
      this.regions.forEach(r => {
        if (r.id !== region.id) r.unfocus()
      })

      this.focused = region

      let json = region.toJSON()
      this.showHelper(json)
      this.emit('region_click', region)
    })
    region.on('plus', region => this.emit('region_plus', region))

    this.regions.push(region)
    this.emit('changed')
  }

  removeRegion (region) {
    for (let i = 0; i < this.regions.length; i++) {
      if (this.regions[i].id === region.id && this.regions[i].type === region.type) {
        this.regions.splice(i, 1)
        if (this.focused && (this.focused.id === region.id)) {
          this.focused = null
        }
        if (this.regions.length > 0) {
          this.regions.forEach((item, index) => {
            this.regions[index].id = index //
            this.regions[index].dom.id = 'region_' + index // 删除元素的时候根据当前数组下标重新排列dom的id
          })
        }
      }
    }
  }

  getRegions () {
    return this.regions
  }

  reload (data) {
    this.destroy()

    this.tpldata = data || null

    this.render()
  }

  render () {
    console.log('template->render')
    console.log(this.tpldata)
    let direction = (this.tpldata && this.tpldata.direction) ? this.tpldata.direction : this.direction

    // reload之后重写direction
    if (this.tpldata) {
      this.direction = this.tpldata.direction
    }

    // create container object
    this.canvas = new Canvas({
      canvas: this.container,
      direction: direction,
      rate: this.rate
    })

    if (this.tpldata && this.tpldata.regions) { // improve me!
      this.tpldata.regions.forEach(region => {
        this.createRegion(region)
      })

      // this.changed = false
    }
  }

  toJSON () {
    let tpl = {}
    tpl.direction = this.direction
    tpl.bgm = []
    tpl.width = this.canvas.width
    tpl.height = this.canvas.height
    tpl.regions = []
    let regions = this.getRegions()
    regions.forEach(region => tpl.regions.push(region.toJSON()))

    return tpl
  }

  destroy () {
    this.canvas.destroy()
    this.regions.forEach(region => region.destroy())
    this.regions = []
  }

  init () {
    this.regions = []

    // 拖拽对齐辅助线
    this.refLine = new RefLine({
      container: $(this.container).get(0),
      gap: 1 // 2个区域之间的间隔
    })

    this.render()
  }

  showHelper (json) {
    $('#type').text(json.type)
    $('#x').text(json.x)
    $('#y').text(json.y)
    $('#width').text(json.width)
    $('#height').text(json.height)
  }

  zoom (rate) {
    this.rate = rate

    this.canvas.zoom(rate)
    this.regions.forEach(region => region.zoom(rate))
  }

  check (type) {
    let ret = this.regions.filter(r => r.type === type)

    return ret.length < this.max[type]
  }
  resetPosition (n, t) {
    this.regions.forEach(region => region.resetPosition(n, t))
  }
}

export default Template
