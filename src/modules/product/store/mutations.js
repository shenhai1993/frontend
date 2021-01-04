'use strict'

import {
  GET_PRODUCTS_PAGE_LIST,
  SHOW_EDIT_WINDOW,
  SHOW_STOCK_WINDOW,
  UPDATE_LOADING_STATUS,
  GET_PRODUCTS_TYPE_LIST,
  SHOW_GALLERY_WINDOW
} from './mutation-types'

export default {
  [GET_PRODUCTS_PAGE_LIST] (state, productsPageList) {
    state.productsPageList = JSON.parse(JSON.stringify(productsPageList))
    state.productsPageList = Object.assign([], productsPageList)
  },

  [UPDATE_LOADING_STATUS] (state, status) {
    state.loading = status
  },
  [GET_PRODUCTS_TYPE_LIST] (state, productsTypeList) {
    state.productsTypeList = productsTypeList
  },
  [SHOW_EDIT_WINDOW] (state, status) {
    state.showEditWindow = status
  },
  [SHOW_STOCK_WINDOW] (state, status) { // 新增库存弹出窗控制
    state.showStockWindow = status
  },
  [SHOW_GALLERY_WINDOW] (state, status) {
    state.showGalleryWindow = status
  }
}
