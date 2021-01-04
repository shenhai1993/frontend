'use strict'

import {
  SET_PERMISSIONLIST,
  SET_ROLELIST,
  SHOW_EDIT_WINDOW,
  REMOVE_FROM_ROLELIST,
  SET_ROLE_PROPERT_BY_INDEX
} from './mutation-types'

export default {
  [SET_PERMISSIONLIST] (state, permissions) {
    state.permissionList = permissions
  },

  [SET_ROLELIST] (state, {roleList, append = false}) {
    if (append) {
      state.roleList.push(roleList)
    } else {
      state.roleList = roleList
    }
  },

  [SHOW_EDIT_WINDOW] (state, status) {
    state.showEditWindow = status
  },

  [REMOVE_FROM_ROLELIST] (state, index) {
    state.roleList.splice(index, 1)
  },

  [SET_ROLE_PROPERT_BY_INDEX] (state, {index, role}) {
    state.roleList.splice(index, 1, role)
  }
}
