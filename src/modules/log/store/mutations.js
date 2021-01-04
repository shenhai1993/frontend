'use strict'

import {
  GET_PERMISSION_LIST,
  GET_LOGS_PAGE_LIST,
  UPDATE_LOADING_STATUS,
  GET_ALL_USERS
} from './mutation-types'

export default {
  [GET_PERMISSION_LIST] (state, permissions) {
    state.permissionList = permissions
  },

  [GET_LOGS_PAGE_LIST] (state, logsPageList) {
    state.logsPageList = logsPageList
  },

  [UPDATE_LOADING_STATUS] (state, status) {
    state.loading = status
  },

  [GET_ALL_USERS] (state, allUsers) {
    state.allUsers = allUsers
  }
}
