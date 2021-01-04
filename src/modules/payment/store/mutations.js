'use strict'

import {
  GET_PAYMENT_PAGE_LIST,
  SHOW_EDIT_WINDOW,
  UPDATE_LOADING_STATUS
} from './mutation-types'

export default {
  [GET_PAYMENT_PAGE_LIST] (state, paymentsPageList) {
    state.paymentsPageList = JSON.parse(JSON.stringify(paymentsPageList))
    state.paymentsPageList = Object.assign([], paymentsPageList)
  },
  [UPDATE_LOADING_STATUS] (state, status) {
    state.loading = status
  },
  [SHOW_EDIT_WINDOW] (state, status) {
    state.showEditWindow = status
  }
}
