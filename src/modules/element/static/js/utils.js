import Vue from 'vue'

export const copy = (target, source) => {
  for (let key in source) {
    // 如果 source 是一个对象，则重新定义这个对象，消除关联
    let newsourcekey = source[key]
    if (Object.prototype.toString.call(newsourcekey) === '[object Object]') {
      let newss = {}
      copy(newss, newsourcekey)
      newsourcekey = newss
    }
    if (target.append && typeof (target.append) === 'function') {
      target.append(key, newsourcekey)
    } else if (target.push && typeof (target.push) === 'function') {
      // 数组使用push方法
      target.push(newsourcekey)
    } else {
      // 数组重新搞，消除关系
      if (Object.prototype.toString.call(newsourcekey) === '[object Array]') {
        target[key] = []
        copy(target[key], newsourcekey)
      } else {
        target[key] = newsourcekey
      }
    }
  }
}

// 对文件的选择可以用另一个简单的思路，例如获取当前item的index，将其保存，并与之对比 ===

export const selected = (self, item, activeItem) => {
  if (self[activeItem]) {
    Vue.set(self[activeItem], 'selected', false)
  }
  self[activeItem] = item
  Vue.set(self[activeItem], 'selected', true)
}

// module.exports = {
//   'copy': copy,
//   'selected': selected
// }
