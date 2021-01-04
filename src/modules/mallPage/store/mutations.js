'use strict'

import {
  GET_TEMPLATE_DATA,
  SHOPPING_CART_DATA,
  CLEAR_SHOPPING_CART,
  SIMS_RESET_WH,
  BASE_WH,
  GET_PAYMENT_LIST,
  LOADING_STATUS,
  SHOW_PAY_CALLBACK,
  SET_PRODUCT_ID,
  SET_UPDATE_STOCK_DATA
} from './mutation-types'

export default {
  [GET_TEMPLATE_DATA] (state, templateData) {
    let data = JSON.parse(JSON.stringify(templateData))
    state.simsViewData = data
  },

  [SHOPPING_CART_DATA] (state, cartData) {
    const data = JSON.parse(JSON.stringify(cartData))
    const oldData = state.shoppingCartData[data.cId]
    let currData = {}
    if (oldData === undefined) {
      currData[data.cId] = data
    } else {
      currData[data.cId] = Object.assign({}, oldData, data)
    }
    state.shoppingCartData = Object.assign({}, state.shoppingCartData, currData)
    if (data.num === 0) {
      delete state.shoppingCartData[data.cId]
    }
  },

  [CLEAR_SHOPPING_CART] (state) {
    state.shoppingCartData = Object.assign({})
  },

  [SIMS_RESET_WH] (state, simsResetWH) {
    const data = JSON.parse(JSON.stringify(simsResetWH))
    state.simsResetWH = data
  },

  [BASE_WH] (state, baseWH) {
    const data = JSON.parse(JSON.stringify(baseWH))
    state.baseWH = data
  },

  [GET_PAYMENT_LIST] (state, paymentData) {
    state.paymentListData = JSON.parse(JSON.stringify(paymentData))
  },

  [LOADING_STATUS] (state, status) {
    state.loading = status
  },

  [SHOW_PAY_CALLBACK] (state, status) {
    state.showPayCallback = status
  },

  [SET_PRODUCT_ID] (state, data) {
    state.productIdString = Object.assign({}, state.productIdString, data)
  },

  [SET_UPDATE_STOCK_DATA] (state, data) {
    state.updateStockData = Object.assign({}, state.updateStockData, data)
  }
}
