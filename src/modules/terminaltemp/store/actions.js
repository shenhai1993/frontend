'use strict'

import {
  GET_TEMPLATE_DATA,
  SET_SIMS_VIEW_DATA,
  UPDATE_SIMS_VIEW_DATA,
  DRAG_SIMS_VIEW_MODEL,
  REMOVE_SIMS_VIEW_DATA,
  CLEAR_SIMS_VIEW_DATA,
  SIMS_RESET_WH,
  BASE_WH,
  LOADING_STATUS,
  SET_INDEXPAGE_EDITDATA,
  PRODUCT_CURRENTCHANGE,
  SIMS_UPDATE_AD,
  SIMS_UPDATE_ADSINGLE,
  SIMS_UPDATE_LOGO,
  SIMS_EDIT_ADCUSTOM,
  COMMIT_STATUS
} from './mutation-types.js'

export default {
  async getTemplateData ({ commit }, data) {
    commit(GET_TEMPLATE_DATA, data)
  },
  async setSimsViewData ({ commit }, data) {
    commit(SET_SIMS_VIEW_DATA, data)
  },
  async updateSimsViewData ({ commit }, data) {
    commit(UPDATE_SIMS_VIEW_DATA, data)
  },
  async dragSimsViewModel ({ commit }, data) {
    commit(DRAG_SIMS_VIEW_MODEL, data)
  },
  async removeSimsViewData ({ commit }, index) {
    commit(REMOVE_SIMS_VIEW_DATA, index)
  },
  async clearSimsViewData ({ commit }) {
    commit(CLEAR_SIMS_VIEW_DATA)
  },
  async setSimsResetWH ({ commit }, data) {
    commit(SIMS_RESET_WH, data)
  },
  async setBaseWH ({ commit }, data) {
    commit(BASE_WH, data)
  },
  async loadingStatus ({ commit }, status) {
    commit(LOADING_STATUS, status)
  },
  async setIndexPageEditData ({ commit }, data) {
    commit(SET_INDEXPAGE_EDITDATA, data)
  },
  async getProductCurrentData ({ commit }, data) {
    commit(PRODUCT_CURRENTCHANGE, data)
  },
  async getSimsUpdateAdData ({ commit }, data) {
    commit(SIMS_UPDATE_AD, data)
  },
  async getSimsUpdateAdsingleData ({ commit }, data) {
    commit(SIMS_UPDATE_ADSINGLE, data)
  },
  async getSimsUpdateLogoData ({ commit }, data) {
    commit(SIMS_UPDATE_LOGO, data)
  },
  async getSimsEditAdCustomData ({ commit }, data) {
    commit(SIMS_EDIT_ADCUSTOM, data)
  },
  async setCommitStatus ({ commit }, status) {
    commit(COMMIT_STATUS, status)
  }
}
