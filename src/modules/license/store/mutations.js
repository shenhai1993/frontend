'use strict'

import {
  GET_HOST_UUID,
  GET_LICENSE
} from '../store/mutation-types'

export default {
  [GET_HOST_UUID] (state, uuid) {
    state.hostuuid = uuid
  },
  [GET_LICENSE] (state) {
    let license = sessionStorage.getItem('license')
    state.license = JSON.parse(license)
  }
}
