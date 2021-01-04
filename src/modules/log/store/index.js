'use strict'

import mutations from './mutations'
import actions from './actions'

const state = {
  permissionList: [],
  logsPageList: {},
  loading: false,
  allUsers: []
}

export default {
  state,
  mutations,
  actions
}
