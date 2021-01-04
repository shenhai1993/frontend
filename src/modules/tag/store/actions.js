'use strict'

import {
  SET_PAGE_LIST, SET_TAGS_ARR,
  UPDATE_LOADING_STATUS
} from './mutation-types.js'

// import {Api} from '../static/js/api.js'

import http from '@static/js/utils/http.js'

export default {
  async getPageList ({ commit }, { page = 1, perpage = 5, key }) {
    commit(UPDATE_LOADING_STATUS, true)
    let url = '/tags/' + '?page=' + page
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
            commit(SET_PAGE_LIST, res.data.message)
          }, 300)
          return Promise.resolve
        }
        return Promise.reject
      })
      .catch(err => {
        console.log(err)
      })
  },
  async getTemplatesTags ({commit}) {
    http.get(`terminals/tags`)
      .then(res => {
        if (res.data.success) {
          setTimeout(() => {
            commit(SET_TAGS_ARR, res.data.message)
          }, 300)
          return Promise.resolve
        }
        return Promise.reject
      })
      .catch(err => {
        console.log(err)
      })
  }
}
