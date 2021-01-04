'use strict'

import {
  GET_DRUGS_PAGE_LIST,
  SHOW_EDIT_WINDOW,
  SHOW_STOCK_WINDOW,
  UPDATE_LOADING_STATUS,
  GET_DRUGS_TYPE_LIST,
  SHOW_GALLERY_WINDOW
} from './mutation-types.js'

import {Drug} from '../static/js/drug.js'

import http from '../../../../static/js/utils/http'

export default {
  /* async getDrugs ({commit, state}) {
    let res = await Drug.getDrugs()
    if (res.data.success) {
      commit(SET_DRUGLIST, res.data.message)
      return Promise.resolve
    }
    return Promise.reject
  }, */

  async getDrugsPageList ({ commit }, { page = 1, perpage = 5, key }) {
    commit(UPDATE_LOADING_STATUS, true)
    let url = '/drugs/' + '?page=' + page
    if (perpage) {
      url += '&per_page=' + perpage
    }
    if (key) {
      url += '&key=' + key
    }
    http.get(url)
      .then(res => {
        if (res.data.success) {
          setTimeout(() => {
            commit(UPDATE_LOADING_STATUS, false)
            commit(GET_DRUGS_PAGE_LIST, res.data.message)
          }, 300)
          return Promise.resolve
        }
        return Promise.reject
      })
      .catch(err => {
        console.log(err)
      })
  },
  async createStock ({commit, state}, data) {
    let res = await Drug.stock(data)
    commit(SHOW_STOCK_WINDOW, false)
    return res
  },
  async updateGallery ({commit, state}, data) {
    let res = await Drug.gallery(data)
    commit(SHOW_GALLERY_WINDOW, false)
    return res
  },
  async createItem ({commit, state}, data) {
    let res = await Drug.create(data)
    commit(SHOW_EDIT_WINDOW, false)
    return res
  },
  async getDrugsTypeList ({ commit }) {
    let url = 'drugs/categories'
    http.get(url)
      .then(res => {
        commit(GET_DRUGS_TYPE_LIST, res.data.message)
      })
      .catch(err => {
        console.log(err)
      })
  }
}
