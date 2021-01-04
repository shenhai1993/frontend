'use strict'

import http from '../../../../static/js/utils/http'
import {SET_H5_CUSTOM_LISTS, REMOVE_H5_CUSTOM_LIST} from './mutation-types'
import { Notification } from 'element-ui'

export default {
  async getH5TemplatesLists ({ commit, state }, {d, index, page, pages}) {
    let res = null
    try {
      res = await http.get(`/h5/templates`, {direction: d, industry: index, page: page, per_page: pages})
    } catch (e) {
      console.log(e)
    }
    if (res) {
      commit(SET_H5_CUSTOM_LISTS, res.data.message)
    }
    return res
  },
  async creatH5PlayList ({commit}, {id, thumb}) {
    let params = {
      template_id: id,
      tpl: {
        thumb_path: thumb
      }
    }
    // params.tpl.thumb_path = thumb
    let res = await http.post('h5/contents', params)
    if (res.data.success) {
    } else {
      Notification({
        type: 'error',
        title: '操作失败！'
      })
    }
    return res
  },
  async  putH5PlayList ({commit}, {seconds, id, key, val}) {
    let url = 'h5/contents/' + id
    let res
    res = await http.put(url, {name: key, seconds: seconds, tpl: val})
    if (res.data.success) {
      Notification({
        type: 'success',
        title: '修改成功！'
      })
    } else {
      Notification({
        type: 'error',
        title: '操作失败！'
      })
    }
    return res
  },
  async  deleteH5TemplateList ({commit}, {id, index}) {
    let url = 'h5/templates/' + id
    let res = await http.delete(url)
    if (res.data.success) {
      Notification({
        type: 'success',
        title: '删除成功！'
      })
      commit(REMOVE_H5_CUSTOM_LIST, index)
    } else {
      Notification({
        type: 'error',
        title: '操作失败！'
      })
    }
    return res
  }
}
