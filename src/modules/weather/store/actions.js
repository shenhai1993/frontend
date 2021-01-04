// import axios from 'axios'
import {
  SET_WEATHER_PAGE_LIST, SPLICE_WEATHER_LIST
// SET_CUT_LIST
} from './mutation-types.js'

import http from '../../../../static/js/utils/http'
import { Notification } from 'element-ui'

export default {
  // 获取城市
  async getWeatherList ({ commit, state }) {
    let res
    let url = 'city/list'
    res = await http.get(url)
    commit(SET_WEATHER_PAGE_LIST, res.data.message)
  },
  // 删除城市
  async deletWeatherList ({ commit, state }, id) {
    let res
    let url = '/city/' + id
    res = await http.delete(url)
    return res
  },
  // 批量删除城市
  async deletWeatherLists ({ commit, state }, rows) {
    let res
    let url = '/city/' + rows.id
    res = await http.delete(url)
    if (res) {
      commit(SPLICE_WEATHER_LIST, rows)
      Notification({
        type: 'success',
        title: '操作成功'
      })
    } else {
      Notification({
        type: 'error',
        title: res.data.message
      })
    }
    return res
  }
}
