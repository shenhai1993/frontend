'use strict'

import {
  GET_SERVER_LIST,
  GET_EXAMINE_LIST,
  GET_UPGRADE_LIST,
  UPDATE_LOADING_STATUS,
  GET_AUTODELETE_LIST
} from './mutation-types.js'
import http from '../../../../static/js/utils/http'

export default {
  getServerList ({ commit }) {
    commit(UPDATE_LOADING_STATUS, true)
    http.get('/server/settings')
      .then(res => {
        setTimeout(() => {
          commit(UPDATE_LOADING_STATUS, false)
          commit(GET_SERVER_LIST, res.data)
        }, 300)
      })
      .catch(err => {
        console.log(err)
      })
  },
  getExamineList ({ commit }) {
    commit(UPDATE_LOADING_STATUS, true)
    http.get('/audit/settings')
      .then(res => {
        setTimeout(() => {
          commit(UPDATE_LOADING_STATUS, false)
          commit(GET_EXAMINE_LIST, res.data)
        }, 300)
      })
      .catch(err => {
        console.log(err)
      })
  },
  getUpgradeList ({ commit }) {
    commit(UPDATE_LOADING_STATUS, true)
    http.get('/upgrades')
      .then(res => {
        setTimeout(() => {
          commit(UPDATE_LOADING_STATUS, false)
          commit(GET_UPGRADE_LIST, res.data)
        }, 300)
      })
      .catch(err => {
        console.log(err)
      })
  },
  getAutoDeleteList ({ commit }) {
    commit(UPDATE_LOADING_STATUS, true)
    http.get('/autodelete')
      .then(res => {
        setTimeout(() => {
          commit(UPDATE_LOADING_STATUS, false)
          commit(GET_AUTODELETE_LIST, res.data)
        }, 300)
      })
      .catch(err => {
        console.log(err)
      })
  }
}
