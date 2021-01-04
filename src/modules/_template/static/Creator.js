'use strict'
export let Regions = {
  'tv': {
    text: '信源区域',
    backgroundColors: ['#FFFFcc'],
    // 一个屏幕，只能出现一个，否则冲突检查不通过
    clashCheck: true
  },
  'video': {
    text: '视频区域',
    backgroundColors: ['#3a5133'],
    clashCheck: true
  },
  'picture': {
    text: '图片区域',
    backgroundColors: ['#6bc4f2'],
    clashCheck: false
  },
  'webpage': {
    text: '网页区域',
    backgroundColors: ['#67C23A'],
    clashCheck: true
  }
}
export let TemplateCreator = {
  // 获取默认宽度、高度
  getRegionSize (direction = 0) {
    let w = 192
    let h = 108
    if (parseInt(direction) === 0) {
      return {width: w, height: h}
    }
    return {width: h, height: w}
  },
  // 根据已存在的区域，计算ID。规则：第一个，用type当ID，第2个， type2, 第三个 type3
  // 如果存在 id id2 id4 则下一个id应为 id5
  // 已经存在的区域数量
  findId (regions, type) {
    let lastId = ''
    let count = 0
    let id = ''
    regions.forEach((r) => {
      if (r.type === type) {
        lastId = r.id
        count++
      }
    })
    // 表示一个也没有
    if (count === 0) {
      id = type
    } else {
      let v = lastId.match(/\d+$/)
      id = v ? type + (parseInt(v[0]) + 1) : type + 1
    }
    return { id: id, count: count }
  },
  // 根据类型，创建区域的数据。但不指定id
  createRegion (type, id) {
    let size = this.getRegionSize()
    let region = Regions[type]

    let data = {
      id: id,
      type: type,
      width: size.width,
      height: size.height,
      top: 0,
      left: 0,
      level: 1,
      color: '#000000',
      backgroundColor: region ? region.backgroundColors[0] : '#FEFECC'
    }
    if (type === 'date' || type === 'time') {
      if (type === 'time') {
        data.width = 108
      }
      data.height = 52
      data.fontSize = 28
      data.color = '#FFFFFF'
      data.backgroundColor = '#000000'
    }
    return data
  },
  // 类型转文字
  regionText (type) {
    let t = Regions[type]
    if (t) {
      return t.text
    }
    return type
  },
  // 创建一个模板数据对象
  newTpl (direction = '0') {
    let data = {
      name: '新建模板',
      direction: direction,
      width: 1366,
      height: 768,
      data: []
    }
    if (direction === 1) {
      data.direction = 1
      data.height = 1366
      data.width = 768
    }
    return data
  }
}
export default TemplateCreator
