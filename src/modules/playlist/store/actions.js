import {
  GET_TEMPLATE_LISTS,
  SET_PLAYLISTS,
  SET_EXPIRED_PLAYLISTS,
  PUB_STOP_RELEASE,
  DEL_PLAYLIST,
  DEL_EXPIRED_PLAYLIST,
  SAVE_PLAYLIST,
  ADJUST_SELECTED_ELEMENT_ORDER
} from './mutation-types.js'

import http from '../../../../static/js/utils/http'
import { Notification } from 'element-ui'

export default {
  async getTempalteLists ({ commit, state }) {
    let url = '/web/templates'

    let lists = await http.get(url)
    commit(GET_TEMPLATE_LISTS, lists.data.data)
  },
  // 获取未过期播出单
  async getPlaylists ({ commit, state }, groupId) {
    let res = null
    try {
      res = await http.get(`playlists?group_id=${groupId}`)
    } catch (e) {
      console.log(e)
    }
    if (res) {
      commit(SET_PLAYLISTS, res.data.message)
    }
  },
  // 获取已过期播出单
  getExpiredPlaylists ({ commit }, groupId) {
    http.get(`playlists?status=2&group_id=${groupId}`)
      .then(res => {
        commit(SET_EXPIRED_PLAYLISTS, res.data.message)
      })
      .catch(err => {
        console.log(err)
      })
  },
  // 删除播出单
  async deletePlaylist ({ commit, state }, {item, data}) {
    let res
    let url = 'playlists'
    res = await http.delete(`${url}/${item.id}`, data)
    if (res.data.success === true) {
      if (item.status !== 2) {
        commit(DEL_PLAYLIST, item)
      } else {
        commit(DEL_EXPIRED_PLAYLIST, item)
      }
    }
    return res
  },
  // 发布与停止播出单
  pubStopPlaylist ({ commit, state }, {item, groupId}) {
    let id = item.id
    let ax = null
    let status = -1
    let url = 'playlists'
    if (item.status === 0) {
      ax = http.get(`${url}/publish/${id}?group_id=${groupId}`)
      status = 1
    } else {
      ax = http.get(`${url}/stop/${id}?group_id=${groupId}`)
      status = 0
    }
    ax.then((res) => {
      commit(PUB_STOP_RELEASE, {item, status})
    })
    return ax
  },
  // 发布或保存播出单
  async pubSavePlaylist ({ commit, state }, {isonlySave, groupId}) {
    commit(SAVE_PLAYLIST, isonlySave)
    let url = '/playlists'
    let data = Object.assign({}, state.postdata)
    data.group_id = groupId
    let res = await http.post(url, data)
    if (res.status === 200) {
      Notification({
        type: 'success',
        title: '操作成功！'
      })
      return 'ok'
    } else {
    }
  },
  changeOrder ({ commit }, changeObj) {
    commit(ADJUST_SELECTED_ELEMENT_ORDER, changeObj)
    return changeObj.arr
  }
}
