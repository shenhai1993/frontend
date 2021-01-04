'use strict'

import {
  GET_PERMISSION_LIST,
  GET_LOGS_PAGE_LIST,
  UPDATE_LOADING_STATUS,
  GET_ALL_USERS
} from './mutation-types.js'
import http from '../../../../static/js/utils/http'

export default {
  getPermissionList ({ commit }) {
    http.get('/modules/log')
      .then(res => {
        commit(GET_PERMISSION_LIST, res.data)
      })
      .catch(err => {
        console.log(err)
      })
  },

  getAllUsers ({ commit }) {
    http.get('/group/users')
      .then(res => {
        commit(GET_ALL_USERS, res.data)
      })
      .catch(err => {
        console.log(err)
      })
  },

  getLogsPageList ({ commit }, { modules = 'user', toPage = 1, startTime, endTime, perpage = 15, username }) {
    commit(UPDATE_LOADING_STATUS, true)
    let url = '/logs/' + modules + '?page=' + toPage
    if (startTime) {
      url += '&starttime=' + startTime
    }
    if (endTime) {
      url += '&endtime=' + endTime
    }
    if (perpage) {
      url += '&per_page=' + perpage
    }
    if (username) {
      url += '&username=' + username
    }
    http.get(url)
      .then(res => {
        setTimeout(() => {
          commit(UPDATE_LOADING_STATUS, false)
          commit(GET_LOGS_PAGE_LIST, res.data)
        }, 300)
      })
      .catch(err => {
        console.log(err)
      })
  }
}
