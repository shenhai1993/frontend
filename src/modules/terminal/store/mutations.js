'use stirct'

import {SET_CONTAINSUB} from './mutation-types'

export default {
  [SET_CONTAINSUB] (state, containSub) {
    state.containSub = containSub
  }
}
