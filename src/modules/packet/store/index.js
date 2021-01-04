'use strict'

import mutations from './mutations'
import actions from './actions'

const state = {
  packetsPageList: {},
  productsTypeList: [],
  showEditWindow: false,
  loading: false
}

export default {
  state,
  mutations,
  actions
}
