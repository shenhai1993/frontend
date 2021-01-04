'use strict'

import mutations from './mutations'
import actions from './actions'

const state = {
  showEditWindow: false,
  marqueeList: [],
  statusCount: {}
}

export default {
  state,
  mutations,
  actions
}
