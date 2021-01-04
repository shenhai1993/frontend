'use strict'

import mutations from './mutations'
import actions from './actions'

const state = {
  permissionsList: [],
  // 弹出窗控制
  showEditWindow: false
}

export default {
  state,
  mutations,
  actions
}
