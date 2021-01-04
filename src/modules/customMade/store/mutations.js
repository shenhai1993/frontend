'use strict'

import {
  SET_CUSTOM_JUMP_URL, SET_H5_CUSTOM_LISTS, SET_THUMB_PATH, REMOVE_H5_CUSTOM_LIST
} from './mutation-types'

export default {
  [SET_CUSTOM_JUMP_URL] (state, url) {
    // state.drugsPageList = drugsPageList
    state.jumpUrl = url
  },
  [SET_THUMB_PATH] (state, thumb) {
    // state.drugsPageList = drugsPageList
    state.thumbPath = thumb
  },
  [SET_H5_CUSTOM_LISTS] (state, list) {
    state.h5TemplateLists = list
  },
  [REMOVE_H5_CUSTOM_LIST] (state, index) {
    state.h5TemplateLists.data.splice(index, 1)
  }
}
