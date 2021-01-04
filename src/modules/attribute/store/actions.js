'use strict'

import {
  GET_ATTRIBUTE_PAGE_LIST,
  SHOW_EDIT_WINDOW,
  UPDATE_LOADING_STATUS,
  GET_PRODUCTS_TYPE_LIST
} from './mutation-types.js'

import {Attribute} from '../static/js/attribute.js'

import http from '../../../../static/js/utils/http'

export default {
  async getAttributesPageList ({ commit }, { page = 1, perpage = 5, key }) {
    commit(UPDATE_LOADING_STATUS, true)
    let url = '/products/pageattributes/' + '?page=' + page
    if (perpage) {
      url += '&per_page=' + perpage
    }
    if (key) {
      url += '&key=' + key
    }
    http.get(url)
      .then(res => {
        commit(UPDATE_LOADING_STATUS, false)
        if (res.data.success) {
          setTimeout(() => {
            commit(GET_ATTRIBUTE_PAGE_LIST, res.data.message)
          }, 300)
          return Promise.resolve
        } else {
          alert(res.data.message)
        }
        return Promise.reject
      })
      .catch(err => {
        commit(UPDATE_LOADING_STATUS, false)
        console.log(err)
      })
  },
  async createAttributeItem ({commit, state}, data) {
    let res = await Attribute.create(data)
    commit(SHOW_EDIT_WINDOW, false)
    return res
  },
  async getProductsTypeList ({ commit }) {
    let url = 'products/categories'
    http.get(url).then(res => {
      commit(GET_PRODUCTS_TYPE_LIST, res.data.message)
    }).catch(err => {
      console.log(err)
    })
  }
}
