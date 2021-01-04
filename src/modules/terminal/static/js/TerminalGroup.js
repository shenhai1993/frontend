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

  static async remove (id) {
    let res = await http.delete(`terminals/${id}`)
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

  // 清空磁盘
  static async clean (terminalNumber) {
    let res = await http.get(`terminals/clean/${terminalNumber}`)
    return res
  }

  // 远程控制
  static async diagnose (terminalNumber) {
    let res = await http.get(`terminals/diagnose/${terminalNumber}`)
    return res
  }

  // 开/停售终端
  static async onsale (terminalNumber, $setsale) {
    let res = await http.get(`terminals/onsale/${terminalNumber}/${$setsale}`)
    return res
  }

  // 屏幕截图
  static async screenshot (number) {
    let res = await http.get(`terminals/screenshot/${number}`)
    return res
  }

  // 下载监控
  static async download (number) {
    let res = await http.get(`terminals/monitor/${number}`)
    return res
  }

  static async volume (number, data) {
    let res = await http.put(`terminals/volume/${number}`, data)
    return res
  }

  // 开机率曲线图数据
  static async bootrate () {
    let res = await http.get(`terminals/bootrate`)
    return res
  }

  // 获取已分组拼接屏终端列表
  static async getmpdpTerminals (groupId) {
    let res = await http.get('terminals', {'group_id': groupId})
    return res
  }

  // 获取未分组终端
  static async getUngroupedTerminals () {
    let res = await http.get('terminals?type=mpdp')
    res.data = res.data.message
    return res
  }

  // 获取拼接屏列表
  static async getscens () {
    let res = await http.get('mpdp/screens?type=full')
    return res.data
  }

  // 获取该终端的播出单列表
  static async getPlaylist (id) {
    let res = await http.get(`playlists/terminal/${id}`)
    return res
  }

  // 获取该终端的跑马灯列表
  static async getMarquee (id) {
    let res = await http.get(`marquees/terminal/${id}`)
    return res
  }

  static async getDashbroad (params) {
    let res = await http.get('terminals/dashboard', params)
    return res
  }
}

export default TerminalGroup
