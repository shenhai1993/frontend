'use strict'

import {
  GET_ATTRIBUTE_PAGE_LIST,
  GET_PRODUCTS_TYPE_LIST,
  SHOW_EDIT_WINDOW,
  UPDATE_LOADING_STATUS
} from './mutation-types'

export default {
  [GET_ATTRIBUTE_PAGE_LIST] (state, attributesPageList) {
    state.attributesPageList = JSON.parse(JSON.stringify(attributesPageList))
    state.attributesPageList = Object.assign([], attributesPageList)
  },
  [GET_PRODUCTS_TYPE_LIST] (state, productsTypeList) {
    state.productsTypeList = productsTypeList
  },
  [UPDATE_LOADING_STATUS] (state, status) {
    state.loading = status
  },
  [SHOW_EDIT_WINDOW] (state, status) {
    state.showEditWindow = status
  }
}
