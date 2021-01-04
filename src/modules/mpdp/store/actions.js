import axios from 'axios'
import {
  GET_TEMPLATE_LISTS_MPDP,
  SET_PLAYLISTS_MPDP,
  SET_EXPIRED_PLAYLISTS_MPDP,
  DEL_PLAYLIST_MPDP,
  DEL_EXPIRED_PLAYLIST_MPDP,
  SAVE_PLAYLIST_MPDP,
  ADJUST_SELECTED_ELEMENT_ORDER_MPDP,
  SET_CUT_LIST
} from './mutation-types.js'

import http from '../../../../static/js/utils/http'
import { Notification } from 'element-ui'

export default {
  async getScenesLists ({ commit, state }) {
    let url = '/web/mpdp/scenes'

    let lists = await axios.get(url)
    commit(GET_TEMPLATE_LISTS_MPDP, lists.data.data)
  },
  // 获取未过期播出单
  getmpdpPlaylists ({ commit, state }) {
    let url = '/mpdp/playlists'

    http.get(url).then((res) => {
      commit(SET_PLAYLISTS_MPDP, res.data.message)
    })
      .catch(err => {
        console.log(err)
      })
  },
  // 获取已过期播出单
  getmpdpExpiredPlaylists ({ commit }) {
    http.get('playlists?status=2')
      .then(res => {
        commit(SET_EXPIRED_PLAYLISTS_MPDP, res.data)
      })
      .catch(err => {
        console.log(err)
      })
  },
  // 删除播出单
  async deletempdpPlaylist ({ commit, state }, item) {
    let res
    let url = '/mpdp/playlists'

    res = await http.delete(`${url}/${item.id}`)
    if (res.status === 200) {
      if (String(item.status) !== '2') {
        commit(DEL_PLAYLIST_MPDP, item)
      } else {
        commit(DEL_EXPIRED_PLAYLIST_MPDP, item)
      }
    }
    return res
  },
  // 发布与停止播出单
  pubStopMpdpPlaylist ({ commit, state }, item) {
    let id = item.id
    let ax
    let url = '/mpdp/playlists'

    if (String(item.status) === '0') {
      ax = http.get(`${url}/publish/${id}`)
    } else {
      ax = http.get(`${url}/stop/${id}`)
    }
    return ax
  },
  // 发布或保存播出单
  async pubSaveMpdpPlaylist ({ commit, state }, isonlySave) {
    commit(SAVE_PLAYLIST_MPDP, isonlySave)
    let url = '/mpdp/playlists'

    try {
      let res = await axios.post(url, state.postdata)
      if (res.data.success) {
        Notification({
          type: 'success',
          title: '操作成功！'
        })
        return 'ok'
      } else {
        Notification({
          type: 'error',
          title: '操作错误！',
          message: res.data.message
        })
        return 'error'
      }
    } catch (error) {
      Notification({
        type: 'error',
        title: '操作错误！',
        message: error.data.message
      })
      return 'error'
    }
  },
  mpdpChangeOrder ({ commit }, changeObj) {
    commit(ADJUST_SELECTED_ELEMENT_ORDER_MPDP, changeObj)
    return changeObj.arr
  },

  async mpdpPlaylistProgress ({ state, commit }, id) {
    let url = `/mpdp/playlists/progress/${id}`
    let res = null
    try {
      res = await http.get(url)
      commit(SET_CUT_LIST, res.data.message)
      console.log('state.cutList:==>', state.cutList)
    } catch (error) {
      console.log(error)
    }
    return res.data.message
  }
}
