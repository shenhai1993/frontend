'use strict'

import {
  SET_PERMISSIONSLIST, SET_EDITWINDOW, REMOVE_FROM_PERMISSIONSLIST, SET_ROLE_PERMISSION_BY_INDEX
} from './mutation-types'

export default {
  [SET_PERMISSIONSLIST] (state, {permissions, append = false}) {
    if (append) {
      state.permissionsList.push(permissions)
    } else {
      state.permissionsList = permissions
    }
  },
  [SET_EDITWINDOW] (state, statu) {
    state.showEditWindow = statu
  },
  // 删除数据时刷新列表
  [REMOVE_FROM_PERMISSIONSLIST] (state, index) {
    state.permissionsList.splice(index, 1)
  },
  [SET_ROLE_PERMISSION_BY_INDEX] (state, {index, permissiom}) {
    state.permissionsList.splice(index, 1, permissiom)
  }
}
