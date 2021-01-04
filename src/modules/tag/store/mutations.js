'use strict'

import {
  SET_PAGE_LIST, SET_TAGS_ARR,
  UPDATE_LOADING_STATUS
} from './mutation-types'

export default {
  [SET_PAGE_LIST] (state, pageList) {
    state.pageList = JSON.parse(JSON.stringify(pageList))
    state.pageList = Object.assign([], pageList)
  },
  [SET_TAGS_ARR] (state, pageList) {
    state.tagsArr = JSON.parse(JSON.stringify(pageList))
  },
  [UPDATE_LOADING_STATUS] (state, status) {
    state.loading = status
  }
}
