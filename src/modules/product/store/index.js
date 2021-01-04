'use strict'

import mutations from './mutations'
import actions from './actions'

const state = {
  productsPageList: {},
  productsTypeList: [],
  showEditWindow: false,
  showStockWindow: false,
  showGalleryWindow: false,
  loading: false
}

export default {
  state,
  mutations,
  actions
}
