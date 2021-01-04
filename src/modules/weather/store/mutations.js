import {
  SET_SELECT_WEATHER_LIST, REMOVE_WEATHER_LIST, SPLICE_WEATHER_LIST,
  SET_WEATHER_PAGE_LIST
} from './mutation-types.js'
// import Vue from 'vue'
// import { Container } from 'element-ui'

export default {
  // 获取城市表格数据
  [SET_WEATHER_PAGE_LIST] (state, cutList) {
    state.getWeatherPageList = cutList
  },
  // 单条删除表格处理
  [REMOVE_WEATHER_LIST] (state, index) {
    state.getWeatherPageList.splice(index, 1)
  },
  // 批量删除表格处理
  [SPLICE_WEATHER_LIST] (state, files) {
    let filelist = Object.assign(state.getWeatherPageList)
    filelist.forEach(function (itemI, indexI) {
      if (files === itemI) {
        filelist.splice(indexI, 1)
      }
    })
    state.getWeatherPageList = filelist
  },
  [SET_SELECT_WEATHER_LIST] (state, files) {
    state.selectWeatherList = files
  }
}
