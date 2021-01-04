'use strict'

import http from '../../../../../static/js/utils/http'

export default {
  getGroupTree () {
    return http.get('groups')
  },
  getWays () { // 获取货道模板
    return http.get('ways/tpls')
  },
  getDrugs () { // 获取商品下拉列表
    return http.get('drugs/all')
  },
  addGroup (formData) {
    return http.post('groups', formData)
  },
  addWayTpl (formData) { // 保存为货道模板
    return http.post('ways/save-tpl', formData)
  },
  delWayTpl (id) {
    return http.delete(`ways/${id}`)
  },
  saveWayTpl (data) { // 更新终端货道模板
    return http.post(`ways/save-way-tpl`, data)
  },
  saveSetWays (data) { // 更新终端货道商品设置
    return http.post(`ways/save-set-ways`, data)
  },
  getTerminals (params) {
    return http.get('terminals', params)
  },
  getTerminal (id) {
    return http.get(`terminals/one/${id}`)
  },
  getTags () {
    return http.get('terminals/tags')
  },
  getCities () {
    return http.get('city/list')
  },
  editTerminal (id, data) {
    return http.put(`terminals/${id}`, data)
  },
  delTerminal (id) {
    return http.delete(`terminals/${id}`)
  },

  addTerminal (parmas) {
    return http.put(`terminals/active`, parmas)
  }
}
