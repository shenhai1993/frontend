'use strict'

import Vue from 'vue'

import { formatFileSize } from '../../../static/js/utils/utils'

export const MACStyle = function (value) {
  let mac = value.trim()

  if (!mac) return ''
  if (mac.split(':').length === 6) return mac

  let reg = /\w{2}/g
  let rs = mac.match(reg)

  // 408bf63dc5d0 => 40:8b:f6:3d:c5:d0
  return rs.join(':')
}

export const fromNow = function (value) {
  return Vue.moment(value, 'YYYY-MM-DD hh:mm:ss').fromNow()
}

export const fileSize = function (value) {
  return formatFileSize(value)
}

export const network = function (value) {
  switch (value) {
    case 0:
      return '有线'
    case 1:
      return 'WIFI'
    case 2:
      return '移动网络'
    default:
      return '-'
  }
}

export const screenDirection = function (value) {
  switch (value) {
    case 0:
      return '横屏'
    case 1:
      return '竖屏'
    case 2:
      return '横屏（反）'
    case 3:
      return '竖屏（反）'
  }
}
