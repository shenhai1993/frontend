'use stirct'

import {SET_TERMINALS, SET_DETAILSLIST, SET_TERMINALS_ID, SET_DATA_LIST, SET_LOADING_STATUS, SET_ELEMENTLOADING_STATUS,
  SET_DETAILSLOADING_STATUS, SET_TERMINALSLOADING_STATUS, SET_ELEMENTSLIST, SET_GROUP_ID, SET_ELEMENTS_ID} from './mutation-types'

export default {
  // 设置终端统计数据
  [SET_TERMINALS] (state, containSub) {
    state.terminalsList = containSub
  },
  // 设置日统计数据
  [SET_DETAILSLIST] (state, containSub) {
    state.detailsList = containSub
  },
  // 设置素材统计数据
  [SET_ELEMENTSLIST] (state, containSub) {
    state.elementsList = containSub
  },
  // 设置素材统计数据
  [SET_DATA_LIST] (state, containSub) {
    state.setDataList = containSub
  },
  // 设置终端组id
  [SET_TERMINALS_ID] (state, type) {
    state.setTerminals = type
  },
  // 设置点击组id
  [SET_GROUP_ID] (state, id) {
    state.setGroupId = id
  },
  // 设置内容统计终端统计播出单统计表格loading状态
  [SET_LOADING_STATUS] (state, stu) {
    state.loadingStatus = stu
  },
  // 设置素材表格loading状态
  [SET_ELEMENTLOADING_STATUS] (state, stu) {
    state.elementloadingStatus = stu
  },
  // 设置终端播放统计表格loading状态
  [SET_DETAILSLOADING_STATUS] (state, stu) {
    state.detailsloadingStatus = stu
  },
  // 设置统计管理loading状态
  [SET_TERMINALSLOADING_STATUS] (state, stu) {
    state.terminalsloadingStatus = stu
  },
  // 设置素材组id
  [SET_ELEMENTS_ID] (state, id) {
    state.setElementsId = id
  }
}
