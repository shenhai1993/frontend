'use strict'

import actions from '../store/actions'
import mutations from '../store/mutations'

const state = {
  serverList: {},
  examineList: {},
  upgradeList: [],
  loading: false,
  autoDeleteList: {},
  license: {}
}

export default {
  state,
  mutations,
  actions
}
