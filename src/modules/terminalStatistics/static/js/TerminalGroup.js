'use strict'

import http from '../../../../../static/js/utils/http.js'

class TerminalGroup {
  // static async getTerminalGroup (groupId) { // improve me, http exception handler needed
  //   let res = await http.get('terminalgroups')
  //   return res.data
  // }
  // 获取终端列表
  static async getTerminalTable (params) {
    let res = await http.get('terminals', params)
    return res
  }
  // 获取目录下的素材统计
  static async getElementsList ({ id, starttime, endtime }) {
    let url = '/statistics/elements/' + id + '/'
    if (starttime) {
      url += '?start_time=' + starttime
    }
    if (endtime) {
      url += '&end_time=' + endtime
    }
    let res = await http.get(url)
    return res
  }
  // 获取终端统计播放流水
  static async getDetailsList ({ num, starttime, endtime }) {
    let url = '/statistics/elements/' + num + '/'
    if (starttime) {
      url += '?start_time=' + starttime
    }
    if (endtime) {
      url += '&end_time=' + endtime
    }
    let res = await http.get(url)
    return res
  }

  // 获取终端统计播放流水
  static async getTerminasList ({ num, starttime, endtime }) {
    let url = '/statistics/terminas/' + num + '/'
    if (starttime) {
      url += '?start_time=' + starttime
    }
    if (endtime) {
      url += '&end_time=' + endtime
    }
    let res = await http.get(url)
    return res
  }
}

export default TerminalGroup
