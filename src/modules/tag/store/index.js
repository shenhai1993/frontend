'use strict'

import mutations from './mutations'
import actions from './actions'

const state = {
  pageList: {},
  tagsArr: [],
  loading: false
}

export default {
  state,
  mutations,
  actions
}
