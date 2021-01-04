'use strict'
const TemplateCreator = {
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
    if (count === 0) { // 表示一个也没有
      id = type
    } else {
      let v = lastId.match(/\d+$/)
      id = v ? type + (parseInt(v[0]) + 1) : type + 1
    }
    return { id: id, count: count }
  },
  picutreBg (index) {
    let colors = ['#fefecc', '#c7c778', '#c9c949', '#afaf33', '#98981e', '#92920e', '#929207']
    return colors[parseInt(index % colors.length)]
  },
  // 根据类型，创建区域的数据。但不指定id
  createRegion (type, id, count = 0) {
    let data = {
      id: id,
      type: type,
      width: 200,
      height: 100,
      top: 100,
      left: 100,
      level: 1,
      color: '#000000',
      backgroundColor: '#FEFECC'
    }
    if (type === 'video') {
      data.color = '#FFFFFF'
      data.backgroundColor = '#333333'
    } else if (type === 'date' || type === 'time') {
      if (type === 'time') {
        data.width = 108
      }
      data.height = 52
      data.fontSize = 28
      data.color = '#FFFFFF'
      data.backgroundColor = '#000000'
    } else if (type === 'picture') {
      data.level = 1
      data.backgroundColor = this.picutreBg(count)
    } else if (type === 'webpage') {
      data.backgroundColor = '#67C23A'
    }
    return data
  },
  // 类型转文字
  regionText (type) {
    switch (type) {
      case 'video':
        return '视频区域'
      case 'picture':
        return '图片区域'
      case 'webpage':
        return '网页区域'
      case 'date':
      default:
        return type
    }
  },
  // 创建一个模板数据对象
  newTpl (direction = '0') {
    let data = {
      name: '新建模板',
      direction: direction,
      bg_img_path: '',
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
