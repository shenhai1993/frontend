'use strict'

import mutations from './mutations'
import actions from './actions'

const state = {
  simsViewData: {},
  shoppingCartData: {},
  simsResetWH: [],
  baseWH: [],
  paymentListData: [],
  loading: false,
  showPayCallback: false,
  productIdString: {
    productId: '',
    packetId: ''
  },
  updateStockData: {}
}

export default {
  state,
  mutations,
  actions
}
