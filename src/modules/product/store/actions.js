'use strict'

import {
  GET_PRODUCTS_PAGE_LIST,
  SHOW_EDIT_WINDOW,
  SHOW_STOCK_WINDOW,
  UPDATE_LOADING_STATUS,
  GET_PRODUCTS_TYPE_LIST,
  SHOW_GALLERY_WINDOW
} from './mutation-types.js'

import {Product} from '../static/js/product.js'

import http from '../../../../static/js/utils/http'

export default {
  async getProductsPageList ({ commit }, { page = 1, perpage = 5, key }) {
    commit(UPDATE_LOADING_STATUS, true)
    let url = '/products/' + '?page=' + page
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
            commit(GET_PRODUCTS_PAGE_LIST, res.data.message)
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
  async createStock ({commit, state}, data) {
    let res = await Product.stock(data)
    commit(SHOW_STOCK_WINDOW, false)
    return res
  },
  async updateGallery ({commit, state}, data) {
    let res = await Product.gallery(data)
    commit(SHOW_GALLERY_WINDOW, false)
    return res
  },
  async createItem ({commit, state}, data) {
    let res = await Product.create(data)
    commit(SHOW_EDIT_WINDOW, false)
    return res
  },
  async createProductItem ({commit, state}, data) {
    let res = await Product.create(data)
    commit(SHOW_EDIT_WINDOW, false)
    return res
  },
  async getProductsTypeList ({ commit }) {
    let url = 'products/categories'
    http.get(url)
      .then(res => {
        commit(GET_PRODUCTS_TYPE_LIST, res.data.message)
      })
      .catch(err => {
        console.log(err)
      })
  }
}
