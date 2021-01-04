'use strict'

import {
  GET_ORDERING_PAGE_LIST,
  UPDATE_LOADING_STATUS,
  SHOW_EDIT_WINDOW
} from './mutation-types'

export default {
  [GET_ORDERING_PAGE_LIST] (state, orderingPageList) {
    state.orderingPageList = JSON.parse(JSON.stringify(orderingPageList))
    state.orderingPageList = Object.assign([], orderingPageList)
  },

  [UPDATE_LOADING_STATUS] (state, status) {
    state.loading = status
  },
  [SHOW_EDIT_WINDOW] (state, status) {
    state.showEditWindow = status
  }
}
