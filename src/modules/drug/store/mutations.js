'use strict'

import {
  GET_DRUGS_PAGE_LIST,
  SHOW_EDIT_WINDOW,
  SHOW_STOCK_WINDOW,
  UPDATE_LOADING_STATUS,
  GET_DRUGS_TYPE_LIST,
  SHOW_GALLERY_WINDOW
} from './mutation-types'

export default {
  [GET_DRUGS_PAGE_LIST] (state, drugsPageList) {
    // state.drugsPageList = drugsPageList
    state.drugsPageList = JSON.parse(JSON.stringify(drugsPageList))
    state.drugsPageList = Object.assign([], drugsPageList)
  },

  [UPDATE_LOADING_STATUS] (state, status) {
    state.loading = status
  },
  [GET_DRUGS_TYPE_LIST] (state, drugsTypeList) {
    state.drugsTypeList = drugsTypeList
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
