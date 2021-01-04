'use strict'

import {
  GET_PAYMENT_PAGE_LIST,
  SHOW_EDIT_WINDOW,
  UPDATE_LOADING_STATUS
} from './mutation-types.js'

import {Payment} from '../static/js/payment.js'

import http from '../../../../static/js/utils/http'

export default {
  async getPaymentsPageList ({ commit }, { page = 1, perpage = 5, key }) {
    commit(UPDATE_LOADING_STATUS, true)
    let url = '/payment/' + '?page=' + page
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
            commit(GET_PAYMENT_PAGE_LIST, res.data.message)
          }, 300)
          return Promise.resolve
        }
        return Promise.reject
      })
      .catch(err => {
        console.log(err)
      })
  },
  async createPaymentItem ({commit, state}, data) {
    let res = await Payment.create(data)
    commit(SHOW_EDIT_WINDOW, false)
    return res
  }
}
