'use strict'

import { GET_ELEMENTS_LIST, GET_PLAY_LIST, GET_MARQUEE_LIST, UPDATE_LOADING_STATUS, SPLICE_ELEMENT_LIST, SPLICE_MARQUEE_LIST, SPLICE_PLAYLIST } from './mutation-types'
import http from '../../../../static/js/utils/http'
import { Notification } from 'element-ui'

export default {
  getElementsList ({ commit }) {
    commit(UPDATE_LOADING_STATUS, true)
    http.get('/audit/elements')
      .then(res => {
        setTimeout(() => {
          commit(UPDATE_LOADING_STATUS, false)
          commit(GET_ELEMENTS_LIST, res.data)
        }, 300)
      })
      .catch(err => {
        console.log(err)
      })
  },
  async getPreviewContentsById ({ commit, state }, id) {
    let res = null
    try {
      res = await http.get(`contents?ids=${id}&ctype=1`)
    } catch (e) { }
    return res
  },
  getPlayList ({ commit }) {
    commit(UPDATE_LOADING_STATUS, true)
    http.get('/audit/playlists')
      .then(res => {
        setTimeout(() => {
          commit(UPDATE_LOADING_STATUS, false)
          commit(GET_PLAY_LIST, res.data)
        }, 300)
      })
      .catch(err => {
        console.log(err)
      })
  },

  getMarqueeList ({ commit }) {
    commit(UPDATE_LOADING_STATUS, true)
    http.get('/audit/marquees')
      .then(res => {
        setTimeout(() => {
          commit(UPDATE_LOADING_STATUS, false)
          commit(GET_MARQUEE_LIST, res.data)
        }, 300)
      })
      .catch(err => {
        console.log(err)
      })
  },

  // 批量驳回素材
  async batchOverruleElements ({ commit, state }, {rows, auditReason}) {
    let res
    let url = '/audit/elements/' + rows.id
    res = await http.put(url, {
      status: 2,
      audit_reason: auditReason
    })
    if (res) {
      commit(SPLICE_ELEMENT_LIST, rows)
      Notification({
        type: 'success',
        title: '操作成功'
      })
    } else {
      Notification({
        type: 'error',
        title: res.data.message
      })
    }
    return res
  },

  // 批量通过审核素材
  async batchAgreeElements ({ commit, state }, rows) {
    let res
    let url = '/audit/elements/' + rows.id
    res = await http.put(url, {
      status: 0,
      audit_reason: ''
    })
    if (res) {
      commit(SPLICE_ELEMENT_LIST, rows)
      Notification({
        type: 'success',
        title: '操作成功'
      })
    } else {
      Notification({
        type: 'error',
        title: res.data.message
      })
    }
    return res
  },

  // 批量驳回播出单
  async batchOverrulePlaylist ({ commit, state }, {rows, auditReason}) {
    let res
    let url = '/audit/playlists/' + rows.id
    res = await http.put(url, {
      status: 2,
      audit_reason: auditReason
    })
    if (res) {
      commit(SPLICE_PLAYLIST, rows)
      Notification({
        type: 'success',
        title: '操作成功'
      })
    } else {
      Notification({
        type: 'error',
        title: res.data.message
      })
    }
    return res
  },

  // 批量通过审核播出单
  async batchAgreePlaylist ({ commit, state }, rows) {
    let res
    let url = '/audit/playlists/' + rows.id
    res = await http.put(url, {
      status: 0,
      audit_reason: ''
    })
    if (res) {
      commit(SPLICE_PLAYLIST, rows)
      Notification({
        type: 'success',
        title: '操作成功'
      })
    } else {
      Notification({
        type: 'error',
        title: res.data.message
      })
    }
    return res
  },

  // 批量驳回跑马灯
  async batchOverruleMarquees ({ commit, state }, {rows, auditReason}) {
    let res
    let url = '/audit/marquees/' + rows.id
    res = await http.put(url, {
      status: 2,
      audit_reason: auditReason
    })
    if (res) {
      commit(SPLICE_MARQUEE_LIST, rows)
      Notification({
        type: 'success',
        title: '操作成功'
      })
    } else {
      Notification({
        type: 'error',
        title: res.data.message
      })
    }
    return res
  },

  // 批量通过审核跑马灯
  async batchAgreeMarquees ({ commit, state }, rows) {
    let res
    let url = '/audit/marquees/' + rows.id
    res = await http.put(url, {
      status: 0,
      audit_reason: ''
    })
    if (res) {
      commit(SPLICE_MARQUEE_LIST, rows)
      Notification({
        type: 'success',
        title: '操作成功'
      })
    } else {
      Notification({
        type: 'error',
        title: res.data.message
      })
    }
    return res
  }
}
