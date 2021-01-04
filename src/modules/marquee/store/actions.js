'use strict'

import {GET_MARQUEE, REMOVE_MARQUEE, EDIT_MARQUEE, UPDATE_MARQUEE_STATUS, ADD_MARQUEE} from './mutation-types'
import api from '../static/js/marqueeAPI'
import { Notification } from 'element-ui'

export default {
  async getMarquee ({commit, state}, treeId) {
    let res = null
    try {
      res = await api.getMarquee(treeId)
    } catch (e) {}
    if (res) {
      commit(GET_MARQUEE, res.data.message)
    }
    return res
  },

  async createMarquee ({commit, state}, marquee) {
    let res = null
    try {
      res = await api.createMarquee(marquee)
    } catch (e) {}
    if (res) {
      commit(ADD_MARQUEE, res.data)
      Notification({
        type: 'success',
        title: '操作成功'
      })
    } else {
      Notification({
        type: 'error',
        title: '保存失败'
      })
    }
    return res
  },

  async removeMarquee ({commit, state}, {id, index}) {
    let res = null
    try {
      res = await api.removeMarquee(id)
    } catch (e) {}
    if (res) {
      commit(REMOVE_MARQUEE, index)
      Notification({
        type: 'success',
        title: '操作成功'
      })
    } else {
      Notification({
        type: 'error',
        title: '删除失败'
      })
    }
  },

  async editMarquee ({commit, state}, {marquee, index}) {
    let res = null
    try {
      res = await api.editMarquee(marquee.id, marquee)
    } catch (e) {}
    if (res.data.success) {
      commit(EDIT_MARQUEE, {data: res.data.message, index: index})
      Notification({
        type: 'success',
        title: '操作成功'
      })
    } else {
      Notification({
        type: 'error',
        title: '保存失败'
      })
    }
    return res
  },

  async publishMarquee ({commit, state}, {index, id}) {
    let res = null
    try {
      res = await api.publishMarquee(id)
    } catch (e) {}
    if (res) {
      commit(UPDATE_MARQUEE_STATUS, {index: index, status: res.data.message.status})
      Notification({
        type: 'success',
        title: '操作成功'
      })
    } else {
      Notification({
        type: 'error',
        title: '发布失败'
      })
    }
  },

  async stopMarquee ({commit, state}, {index, id}) {
    let res = null
    try {
      res = await api.stopMarquee(id)
    } catch (e) {}
    if (res) {
      commit(UPDATE_MARQUEE_STATUS, {index: index, status: res.data.message.status})
      Notification({
        type: 'success',
        title: '操作成功'
      })
    } else {
      Notification({
        type: 'error',
        title: '停止失败'
      })
    }
  }
}
