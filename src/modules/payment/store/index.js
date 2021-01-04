'use strict'

import mutations from './mutations'
import actions from './actions'

const state = {
  paymentsPageList: {},
  showEditWindow: false,
  loading: false
}

export default {
  state,
  mutations,
  actions
}
