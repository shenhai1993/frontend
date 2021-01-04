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
} from './mutation-types.js'

export default {
  async getTemplateData ({ commit }, data) {
    commit(GET_TEMPLATE_DATA, data)
  },
  async saveShoppingCartData ({ commit }, data) {
    commit(SHOPPING_CART_DATA, data)
  },
  async clearShoppingCart ({ commit }) {
    commit(CLEAR_SHOPPING_CART)
  },
  async setSimsResetWH ({ commit }, data) {
    commit(SIMS_RESET_WH, data)
  },
  async setBaseWH ({ commit }, data) {
    commit(BASE_WH, data)
  },
  async getPaymentList ({ commit }, data) {
    commit(GET_PAYMENT_LIST, data)
  },
  async loadingStatus ({ commit }, status) {
    commit(LOADING_STATUS, status)
  },
  async payCallbackStatus ({ commit }, status) {
    commit(SHOW_PAY_CALLBACK, status)
  },
  async setProductId ({ commit }, data) {
    commit(SET_PRODUCT_ID, data)
  },
  async setUpdateStockData ({ commit }, data) {
    commit(SET_UPDATE_STOCK_DATA, data)
  }
}
