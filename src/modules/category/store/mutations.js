'use strict'

import {
  GET_CATEGORY_PAGE_LIST,
  SHOW_EDIT_WINDOW,
  UPDATE_LOADING_STATUS
} from './mutation-types'

export default {
  [GET_CATEGORY_PAGE_LIST] (state, categoriesPageList) {
    state.categoriesPageList = JSON.parse(JSON.stringify(categoriesPageList))
    state.categoriesPageList = Object.assign([], categoriesPageList)
  },

  [UPDATE_LOADING_STATUS] (state, status) {
    state.loading = status
  },
  [SHOW_EDIT_WINDOW] (state, status) {
    state.showEditWindow = status
  }
}
