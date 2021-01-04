'use strict'

import http from '../../../../../static/js/utils/http.js'

class TerminalGroup {
  // 获取终端分组
  static async getTerminalGroup (groupId) { // improve me, http exception handler needed
    let res = await http.get('terminalgroups')
    return res.data
  }
  // 新建终端分组
  static async create (data) {
    let res = await http.post('groups', data)
    return res
  }
  // 编辑终端分组
  static async redact (id, objName) {
    let res = await http.put(`groups/${id}`, objName)
    return res
  }

  // 获取终端列表
  static async getTerminals (groupId) {
    let res = await http.get(`terminals?group_id=${groupId}`)
    return res.data.message
  }

  // 重启终端
  static async restart (terminalNumber) {
    let res = await http.get(`terminals/restart/${terminalNumber}`)
    return res
  }

  // 屏幕截图
  static async screenshot (number) {
    let res = await http.get(`terminals/screenshot/${number}`)
    return res
  }

  // 下载监控
  static async download (number) {
    let res = await http.get(`terminals/download/${number}`)
    return res
  }

  static async volume (number, volume) {
    let res = await http.post(`terminals/screenvolume?number=${number}&volume=${volume}`)
    return res
  }

  // 开机率曲线图数据
  static async bootrate () {
    let res = await http.get(`terminals/bootrate`)
    return res
  }

  // 获取已分组拼接屏终端列表
  static async getmpdpTerminals () {
    let res = await http.get('http://localhost:3000/terminals')
    return res
  }
  // static async getmpdpTerminals () {
  //   let res = await http.get('mpdp/terminals')
  //   return res
  // }

  // 获取未分组终端
  static async getUngroupedTerminals (groupid) {
    let res = await http.get('http://localhost:3000/terminals?type=nogroup', { 'group_id': groupid })
    res.data = res.data.message
    return res
  }
  // static async getUngroupedTerminals (groupid) {
  //   let res = await http.get('mpdp/terminals?type=nogroup', { 'group_id': groupid })
  //   res.data = res.data.message
  //   return res
  // }

  // 获取拼接屏列表
  static async getscens () {
    let res = await http.get('mpdp/screens?type=full')
    return res.data
  }
}

export default TerminalGroup
