'use strict'

import {SHOW_MARQUEE_EDIT, GET_MARQUEE, ADD_MARQUEE, REMOVE_MARQUEE, EDIT_MARQUEE, UPDATE_MARQUEE_STATUS, SET_STATUS_COUNT} from './mutation-types'

export default {
  [SHOW_MARQUEE_EDIT] (state, status) {
    state.showEditWindow = status
  },

  [GET_MARQUEE] (state, list) {
    state.marqueeList = list
  },

  [ADD_MARQUEE] (state, marquee) {
    state.marqueeList.push(marquee)
  },

  [REMOVE_MARQUEE] (state, index) {
    state.marqueeList.splice(index, 1)
  },

  [EDIT_MARQUEE] (state, {data, index}) {
    state.marqueeList.splice(index, 1, data)
  },

  [UPDATE_MARQUEE_STATUS] (state, {index, status}) {
    console.log(`index, status:==>`)
    console.log(index, status)
    state.marqueeList[index].status = status
  },

  [SET_STATUS_COUNT] (state, count) {
    state.statusCount = count
  }
}
