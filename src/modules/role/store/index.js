'use strict'

import mutations from './mutations'
import actions from './actions'

const state = {
  permissionList: [],
  roleList: [],
  showEditWindow: false
}

export default {
  state,
  mutations,
  actions
}
