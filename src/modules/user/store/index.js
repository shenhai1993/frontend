'use strict'

import mutations from './mutations'
import actions from './actions'

const state = {
  userList: [],
  groupLists: [],
  showEditWindow: false
}

export default {
  state,
  mutations,
  actions
}
