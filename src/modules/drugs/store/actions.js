'use strict'

import {
  GET_DRUGS_PAGE_LIST,
  // SHOW_EDIT_WINDOW,
  UPDATE_LOADING_STATUS
  // GET_DRUGS_TYPE_LIST
} from './mutation-types.js'

// import {Drug} from '../static/js/drug.js'

import http from '../../../../static/js/utils/http'
import { Notification } from 'element-ui'

export default {
  /* async getDrugs ({commit, state}) {
    let res = await Drug.getDrugs()
    if (res.data.success) {
      commit(SET_DRUGLIST, res.data.message)
      return Promise.resolve
    }
    return Promise.reject
  }, */

  async getContentsPageList ({ commit }, { page = 1, perpage = 15, key, d }) {
    // 获取内容列表
    commit(UPDATE_LOADING_STATUS, true)
    let url = '/contents/' + '?page=' + page
    if (perpage) {
      url += '&per_page=' + perpage
    }
    if (key) {
      url += '&key=' + key
    }
    if (d) {
      url += '&d=' + d
    }
    http.get(url)
      .then(res => {
        if (res.data.success) {
          setTimeout(() => {
            commit(UPDATE_LOADING_STATUS, false)
            commit(GET_DRUGS_PAGE_LIST, res.data.message)
          }, 100)
          return Promise.resolve
        }
        return Promise.reject
      })
      .catch(err => {
        console.log(err)
      })
  },
  async getTemplatesData ({commit}, id) {
    let res = null
    try {
      res = await http.get(`contents?ids=${id}&ctype=1`)
      // res = await http.get('/h5/templates', {id: id})
    } catch (e) {
      console.log(e)
    }
    return res
  },
  async getPreviewTemplatesData ({commit}, id) {
    let res = null
    try {
      res = await http.get('/h5/contents/preview/' + id)
    } catch (e) {
      console.log(e)
    }
    return res
  },
  // 保存内容列表
  async saveDrgus ({commit, state}, playlist) {
    let res = await http.post('contents/save', playlist)
    if (res.data.success) {
      Notification({
        type: 'success',
        title: '操作成功！'
      })
      console.log(res)
      // commit(SAVE_PLAYLIST, res.data.message)
    } else {
      Notification({
        type: 'error',
        title: '操作失败！'
      })
    }
    return res
  }
  // async updateGallery ({commit, state}, data) {
  //   let res = await Drug.gallery(data)
  //   // commit(SHOW_GALLERY_WINDOW, false)
  //   return res
  // }
  // async createItem ({commit, state}, data) {
  //   let res = await Drug.create(data)
  //   commit(SHOW_EDIT_WINDOW, false)
  //   return res
  // },
  // async getDrugsTypeList ({ commit }) {
  //   let url = 'contents'
  //   http.get(url)
  //     .then(res => {
  //       commit(GET_DRUGS_TYPE_LIST, res.data.message)
  //     })
  //     .catch(err => {
  //       console.log(err)
  //     })
  // }
}
