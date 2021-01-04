'use strict'
import {
  SET_TERMINALS, SET_ELEMENTSLIST, SET_DETAILSLIST, SET_DATA_LIST, SET_LOADING_STATUS,
  SET_ELEMENTLOADING_STATUS, SET_TERMINALSLOADING_STATUS, SET_DETAILSLOADING_STATUS
} from './mutation-types.js'
import http from '@static/js/utils/http'

export default {
  // 获取终端中的素材使用统计
  async getTerminalsList ({commit}, {type, starttime, endtime, page, perPage}) {
    let url = '/statistics/terminals/' + type
    if (starttime) {
      url += '?start_time=' + starttime
    }
    if (endtime) {
      url += '&end_time=' + endtime
    }
    if (perPage) {
      url += '&per_page=' + perPage
    }
    if (page) {
      url += '&page=' + page
    }
    let res = await http.get(url)
    commit(SET_TERMINALS, res.data.message.data)
    commit(SET_TERMINALSLOADING_STATUS, false)
    return res
  },
  // 获取终端日播放统计
  async getDetailsList ({commit}, {type, starttime, endtime, page, perPage}) {
    let url = '/statistics/details/' + type
    if (starttime) {
      url += '?start_time=' + starttime
    }
    if (endtime) {
      url += '&end_time=' + endtime
    }
    if (perPage) {
      url += '&per_page=' + perPage
    }
    if (page) {
      url += '&page=' + page
    }
    let res = await http.get(url)
    commit(SET_DETAILSLIST, res.data.message.data)
    commit(SET_DETAILSLOADING_STATUS, false)
    return res
  },
  // 获取素材使用统计
  async getElementsLists ({commit}, {id, starttime, endtime, page, perPage}) {
    let url = '/statistics/elements/directories/' + id + '/'
    if (starttime) {
      url += '?start_time=' + starttime
    }
    if (endtime) {
      url += '&end_time=' + endtime
    }
    if (perPage) {
      url += '&per_page=' + perPage
    }
    if (page) {
      url += '&page=' + page
    }
    let res = await http.get(url)
    commit(SET_ELEMENTSLIST, res.data.message.data)
    commit(SET_ELEMENTLOADING_STATUS, false)
    return res
  },
  // 获取内容,终端使用统计
  async getPlaysList ({commit}, {id, path, starttime, endtime, page, perPage}) {
    let url = '/statistics/' + path + '/' + id + '/'
    if (starttime) {
      url += '?start_time=' + starttime
    }
    if (endtime) {
      url += '&end_time=' + endtime
    }
    if (perPage) {
      url += '&per_page=' + perPage
    }
    if (page) {
      url += '&page=' + page
    }
    let res = await http.get(url)
    commit(SET_DATA_LIST, res.data.message.data)
    commit(SET_LOADING_STATUS, false)
    return res
  }
}
