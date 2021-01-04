'use strict'

import actions from '../store/actions'
import mutations from '../store/mutations'

const state = {
  elementsList: [],
  selectElementList: [],
  playList: [],
  marqueesList: [],
  loading: false
}

export default {
  state,
  mutations,
  actions
}
