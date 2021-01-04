'use strict'

import {
  GET_CATEGORY_PAGE_LIST,
  SHOW_EDIT_WINDOW,
  UPDATE_LOADING_STATUS
} from './mutation-types.js'

import {Category} from '../static/js/category.js'

import http from '../../../../static/js/utils/http'

export default {
  async getCategoriesPageList ({ commit }, { page = 1, perpage = 5, key }) {
    commit(UPDATE_LOADING_STATUS, true)
    let url = '/products/pagecategories/' + '?page=' + page
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
            commit(GET_CATEGORY_PAGE_LIST, res.data.message)
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
  async createItem ({commit, state}, data) {
    let res = await Category.create(data)
    commit(SHOW_EDIT_WINDOW, false)
    return res
  },
  async createCategoryItem ({commit, state}, data) {
    let res = await Category.create(data)
    commit(SHOW_EDIT_WINDOW, false)
    return res
  }
}
