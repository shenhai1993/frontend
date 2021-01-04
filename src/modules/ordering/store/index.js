'use strict'

import mutations from './mutations'
import actions from './actions'

const state = {
  orderingPageList: {},
  showEditWindow: false,
  loading: false
}

export default {
  state,
  mutations,
  actions
}
