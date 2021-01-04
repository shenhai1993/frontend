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
  SHOW_EDIT_WINDOW,
  SET_INDEXPAGE_EDITDATA,
  PRODUCT_CURRENTCHANGE,
  SIMS_UPDATE_AD,
  SIMS_UPDATE_ADSINGLE,
  SIMS_UPDATE_LOGO,
  SIMS_EDIT_ADCUSTOM,
  COMMIT_STATUS
} from './mutation-types'

export default {
  [GET_TEMPLATE_DATA] (state, templateData) {
    let data = JSON.parse(JSON.stringify(templateData))
    state.simsViewData = data
  },

  [SET_SIMS_VIEW_DATA] (state, simsViewData) {
    let data = JSON.parse(JSON.stringify(simsViewData))
    if (!Array.isArray(state.simsViewData)) {
      state.simsViewData = []
    }
    const length = state.simsViewData.length
    data.key = 1
    for (let i = 0; i < length; i++) {
      if (state.simsViewData[i].key >= data.key) {
        data.key = state.simsViewData[i].key + 1
      }
    }
    state.simsViewData.splice(state.simsViewData.length, 0, data)
  },

  [UPDATE_SIMS_VIEW_DATA] (state, data) {
    const index = data.index
    let newValue = JSON.parse(JSON.stringify(data.data))
    state.simsViewData.splice(index, 1, newValue)
  },

  [DRAG_SIMS_VIEW_MODEL] (state, data) {
    if (data === undefined) {
      state.simsviewDragData = Object.assign({})
      return false
    }
    const value = JSON.parse(JSON.stringify(data))
    // const type = value.t
    // const id = value.id
    const index = value.i
    const top = value.top
    // const left = value.left
    let oldValue = JSON.parse(JSON.stringify(state.simsViewData[index]))
    const key = oldValue.key
    let item = JSON.parse(oldValue.comData)
    item.top = top
    // item.leftlength = left
    oldValue.comData = JSON.stringify(item)
    let dragData = {}
    dragData[key] = oldValue.comData
    state.simsviewDragData = Object.assign({}, state.simsviewDragData, dragData)
    state.simsViewData.splice(index, 1, oldValue)
  },

  [REMOVE_SIMS_VIEW_DATA] (state, index) {
    state.simsViewData.splice(index, 1)
  },

  [CLEAR_SIMS_VIEW_DATA] (state) {
    state.simsviewDragData = {}
    state.simsViewData = []
  },

  [SIMS_RESET_WH] (state, simsResetWH) {
    const data = JSON.parse(JSON.stringify(simsResetWH))
    state.simsResetWH = data
  },

  [BASE_WH] (state, baseWH) {
    const data = JSON.parse(JSON.stringify(baseWH))
    state.baseWH = data
  },

  [LOADING_STATUS] (state, status) {
    state.loading = status
  },
  [SHOW_EDIT_WINDOW] (state, status) {
    state.showEditWindow = status
  },

  [SET_INDEXPAGE_EDITDATA] (state, data) {
    state.indexPageEditData = Object.assign({}, state.indexPageEditData, data)
  },

  [PRODUCT_CURRENTCHANGE] (state, data) {
    state.productCurrentData = Object.assign({}, state.productCurrentData, data)
  },

  [SIMS_UPDATE_AD] (state, data) {
    state.simsUpdateAdData = data
  },

  [SIMS_UPDATE_ADSINGLE] (state, data) {
    state.simsUpdateAdsingleData = data
  },

  [SIMS_UPDATE_LOGO] (state, data) {
    state.simsUpdateLogoData = data
  },

  [SIMS_EDIT_ADCUSTOM] (state, data) {
    state.simsEditAdCustomData = data
  },

  [COMMIT_STATUS] (state, status) {
    state.commitStatus = status
  }
}
