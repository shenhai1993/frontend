'use strict'

import {
  GET_HOST_UUID
} from './mutation-types.js'
import http from '../../../../static/js/utils/http'

export default {
  getHostUuid ({ commit }) {
    http.get('/license/uuid')
      .then(res => {
        commit(GET_HOST_UUID, res.data)
      })
      .catch(err => {
        console.log(err)
      })
  }
}
