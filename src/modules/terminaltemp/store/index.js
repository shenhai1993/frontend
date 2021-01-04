'use strict'

import mutations from './mutations'
import actions from './actions'

const state = {
  simsViewData: [],
  simsviewDragData: {},
  simsResetWH: [],
  baseWH: [],
  loading: false,
  showEditWindow: false,
  indexPageEditData: {
    name: ''
  },
  productCurrentData: {},
  simsUpdateAdData: [],
  simsUpdateAdsingleData: [],
  simsUpdateLogoData: [],
  simsEditAdCustomData: {},
  commitStatus: false
}

export default {
  state,
  mutations,
  actions
}
