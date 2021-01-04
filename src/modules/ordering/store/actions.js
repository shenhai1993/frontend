'use strict'

import {
  GET_ORDERING_PAGE_LIST,
  UPDATE_LOADING_STATUS
} from './mutation-types.js'

import http from '../../../../static/js/utils/http'
import {Ordering} from '../../ordering/static/js/ordering'
import {SHOW_EDIT_WINDOW} from '../../category/store/mutation-types'

export default {
  async getOrderingPageList ({ commit }, { page = 1, perpage = 5, key }) {
    commit(UPDATE_LOADING_STATUS, true)
    let url = '/pay/orderlist/' + '?page=' + page
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
            commit(GET_ORDERING_PAGE_LIST, res.data.message)
          }, 300)
          return Promise.resolve
        }
        return Promise.reject
      })
      .catch(err => {
        console.log(err)
      })
  },
  async createOrderingItem ({commit, state}, id) {
    let res = await Ordering.getOrderDesc(id)
    commit(SHOW_EDIT_WINDOW, false)
    return res
  }
}
