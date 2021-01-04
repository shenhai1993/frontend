'use strict'

import {SET_USER_LIST, SHOW_EDIT_WINDOW, REMOVE_FROM_USERLIST, SET_GROUP_LIST, SET_USER_PROPERTY_BY_INDEX} from './mutation-types'

export default {
  [SET_USER_LIST] (state, {user, append = false}) {
    if (append) {
      state.userList.push(user)
    } else {
      state.userList = user
    }
  },

  [SHOW_EDIT_WINDOW] (state, status) {
    state.showEditWindow = status
  },
  [SET_GROUP_LIST] (state, list) {
    state.groupLists = list
  },
  [REMOVE_FROM_USERLIST] (state, index) {
    state.userList.splice(index, 1)
  },

  [SET_USER_PROPERTY_BY_INDEX] (state, {index, user}) {
    state.userList.splice(index, 1, user)
  }
}
