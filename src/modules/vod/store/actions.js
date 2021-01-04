'use strict'

import { GET_PLAYING_LIST, DELETE_PLAYING_OPTION } from './mutation-types'
import http from '../../../../static/js/utils/http'

export default {
  getPlayingList ({ commit }) {
    http.get('shopList')
      .then(res => {
        commit(GET_PLAYING_LIST, res.data)
      })
      .catch(err => {
        console.log(err)
      })
  },
  deletePlayingList ({ commit, state }, { item, data }) {
    console.log(http)
    http.delete('shopList', data)
      .then(res => {
        commit(DELETE_PLAYING_OPTION, data)
      })
      .catch(err => {
        console.log(err)
      })
  }
}
