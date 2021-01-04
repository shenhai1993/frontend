'use strict'

import {
  GET_PACKETS_PAGE_LIST,
  SHOW_EDIT_WINDOW,
  UPDATE_LOADING_STATUS,
  GET_PRODUCTS_TYPE_LIST
} from './mutation-types'

export default {
  [GET_PACKETS_PAGE_LIST] (state, packetsPageList) {
    state.packetsPageList = JSON.parse(JSON.stringify(packetsPageList))
    state.packetsPageList = Object.assign([], packetsPageList)
  },

  [UPDATE_LOADING_STATUS] (state, status) {
    state.loading = status
  },
  [GET_PRODUCTS_TYPE_LIST] (state, productsTypeList) {
    state.productsTypeList = productsTypeList
  },
  [SHOW_EDIT_WINDOW] (state, status) {
    state.showEditWindow = status
  }
}
