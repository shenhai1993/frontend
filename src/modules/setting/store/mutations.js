'use strict'

import {
  GET_SERVER_LIST,
  GET_EXAMINE_LIST,
  GET_UPGRADE_LIST,
  UPDATE_LOADING_STATUS,
  GET_AUTODELETE_LIST,
  GET_LICENSE
} from '../store/mutation-types'

export default {
  [GET_SERVER_LIST] (state, serverList) {
    state.serverList = serverList.message
  },

  [GET_EXAMINE_LIST]  (state, examineList) {
    state.examineList = examineList.message
  },

  [GET_UPGRADE_LIST] (state, upgradeList) {
    state.upgradeList = upgradeList.message
  },

  [UPDATE_LOADING_STATUS] (state, status) {
    state.loading = status
  },

  [GET_AUTODELETE_LIST] (state, autoDeleteList) {
    state.autoDeleteList = autoDeleteList.message
  },

  [GET_LICENSE] (state) {
    let license = sessionStorage.getItem('license')
    state.license = JSON.parse(license)
  }
}
