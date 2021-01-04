'use strict'

/**
 * @author chenxi(chxi@tcl.com)
 */
import Vue from 'vue'

export const formatFileSize = (fileSize, idx = 0) => {
  const units = ['B', 'KB', 'MB', 'GB']
  if (Number(fileSize) < 1024 || idx === units.length - 1) {
    return Number(fileSize).toFixed(2) + units[idx]
  }

  return formatFileSize(Number(fileSize) / 1024, ++idx)
}

export const sleep = (time) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, time * 1000)
  })
}

export const getDateRange = (days = 7) => {
  const end = new Date()
  const start = new Date()
  start.setTime(start.getTime() - 3600 * 1000 * 24 * days)

  return { 'start': start, 'end': end }
}

export const remove = (array = [], data = '') => {
  let index = array.indexOf(data)
  array.splice(index, 1)
}

export const copy = (target = {}, source = {}) => {
  let _source = JSON.stringify(source || {})
  target = JSON.parse(_source)

  return target
}

export const checkURL = (rule, value, cb) => {
  if (value === '') {
    cb(new Error('请输入直播流地址'))
  }

  cb()
}
export const checkWebpageURL = (rule, value, cb) => {
  if (value === '') {
    cb(new Error('请输入网页的URL地址'))
  }

  cb()
}

export const _selected = (item, self, activeItem) => {
  if (self[activeItem]) {
    Vue.set(self[activeItem], 'selected', false)
  }
  self[activeItem] = item
  Vue.set(self[activeItem], 'selected', true)
}
// 深拷贝
export const deepcopy = (source) => {
  if (!source) {
    return source
  }
  let sourceCopy = source instanceof Array ? [] : {}
  for (let item in source) {
    sourceCopy[item] = typeof source[item] === 'object' ? deepcopy(source[item]) : source[item]
  }
  return sourceCopy
}
