'use strict'

import { GET_PLAYING_LIST, DELETE_PLAYING_OPTION } from '../store/mutation-types'

export default {
  [GET_PLAYING_LIST] (state, data) {
    state.playingList = data
  },
  [DELETE_PLAYING_OPTION] (state, item) {
    state.playingList.forEach((ele, index) => {
      if (ele.id === item.id) {
        state.playingList.splice(index, 1)
      }
    })
  }
}
