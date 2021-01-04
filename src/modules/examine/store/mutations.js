'use strict'

import {
  GET_ELEMENTS_LIST,
  GET_PLAY_LIST,
  GET_MARQUEE_LIST,
  UPDATE_LOADING_STATUS,
  SET_SELECT_ELEMENT_LIST,
  SPLICE_ELEMENT_LIST,
  SET_SELECT_PLAYLIST,
  SPLICE_PLAYLIST,
  SET_SELECT_MARQUEE_LIST,
  SPLICE_MARQUEE_LIST
} from '../store/mutation-types'

export default {
  [GET_ELEMENTS_LIST] (state, elementsList) {
    state.elementsList = elementsList.message
  },

  [GET_PLAY_LIST] (state, playList) {
    state.playList = playList.message
  },

  [GET_MARQUEE_LIST] (state, marqueesList) {
    state.marqueesList = marqueesList.message
  },

  [UPDATE_LOADING_STATUS] (state, status) {
    state.loading = status
  },

  [SET_SELECT_ELEMENT_LIST] (state, files) {
    state.selectElementList = files
  },

  [SPLICE_ELEMENT_LIST] (state, files) {
    let filelist = Object.assign(state.elementsList)
    filelist.forEach(function (itemI, indexI) {
      if (files === itemI) {
        filelist.splice(indexI, 1)
      }
    })
    state.elementsList = filelist
  },

  [SET_SELECT_PLAYLIST] (state, files) {
    state.selectPlayList = files
  },

  [SPLICE_PLAYLIST] (state, files) {
    let filelist = Object.assign(state.playList)
    filelist.forEach(function (itemI, indexI) {
      if (files === itemI) {
        filelist.splice(indexI, 1)
      }
    })
    state.playList = filelist
  },

  [SET_SELECT_MARQUEE_LIST] (state, files) {
    state.selectMarqueesList = files
  },

  [SPLICE_MARQUEE_LIST] (state, files) {
    let filelist = Object.assign(state.marqueesList)
    filelist.forEach(function (itemI, indexI) {
      if (files === itemI) {
        filelist.splice(indexI, 1)
      }
    })
    state.marqueesList = filelist
  }
}
