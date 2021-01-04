'use strict'
import {
  SET_PLAYLISTS, SET_DRUGSLISTS,
  DEL_PLAYLIST, PUB_STOP_RELEASE
} from './mutation-types.js'
import http from '@static/js/utils/http'
import { Notification } from 'element-ui'

export default {
  // 获取未过期播出单
  async getPlaylists ({ commit, state }, groupId) {
    // debugger
    let res = null
    try {
      res = await http.get(`playlists?group_id=${groupId}`)
    } catch (e) {
      console.log(e)
    }
    if (res) {
      commit(SET_PLAYLISTS, res.data.message)
    }
    return res
  },
  async getContentsLists ({ commit, state }) {
    let res = null
    try {
      res = await http.get(`contents?per_page=1000`)
    } catch (e) {
      console.log(e)
    }
    if (res) {
      commit(SET_DRUGSLISTS, res.data.message.data)
    }
    return res
  },
  async getPlaylistById ({commit, state}, id) {
    let res = null
    try {
      res = await http.get(`playlists?id=${id}`)
    } catch (e) {}
    if (res) {
      commit(SET_PLAYLISTS, [res.data])
    }
    return res
  },
  async getContentsById ({commit, state}, id) {
    let res = null
    try {
      res = await http.get(`contents?ids=${id}&ctype=1`)
    } catch (e) {}
    return res
  },
  // 添加弹窗播出单
  async addVoice ({commit, state}, data) {
    let res = null
    try {
      res = await http.post(`playlists/voice`, data)
    } catch (e) {}
    return res
  },
  // 删除播出单
  async deletePlaylist ({ commit, state }, {item, data}) {
    let res
    let url = 'playlists'
    res = await http.delete(`${url}/${item.id}`, data)
    if (res.data.success === true) {
      commit(DEL_PLAYLIST, item)
    }
    return res
  },
  // 发布与停止播出单
  pubStopPlaylist ({ commit, state }, {item, groupId}) {
    let id = item.id
    let res = null
    let status = -1
    let url = 'playlists'
    if (item.status === 0) {
      res = http.get(`${url}/publish/${id}`) // ?group_id=${groupId}`)
      status = 3
    } else {
      res = http.get(`${url}/stop/${id}`) // ?group_id=${groupId}`)
      status = 0
    }
    res.then((res) => {
      commit(PUB_STOP_RELEASE, {item, status})
    })
    return res
  },
  // // 发布或保存播出单
  // async pubSavePlaylist ({ commit, state }, {isonlySave, groupId}) {
  //   commit(SAVE_PLAYLIST, isonlySave)
  //   let url = '/playlists'
  //   let data = Object.assign({}, state.postdata)
  //   data.group_id = groupId
  //   let res = await http.post(url, data)
  //   if (res.status === 200) {
  //     Notification({
  //       type: 'success',
  //       title: '操作成功！'
  //     })
  //     return 'ok'
  //   } else {
  //   }
  // },
  // 保存播出单列表
  async savePlaylist ({commit, state}, playlist) {
    console.log(playlist)
    let res = await http.post('playlists', playlist)
    if (res.data.success) {
      Notification({
        type: 'success',
        title: '操作成功！'
      })
      console.log(res)
      // commit(SAVE_PLAYLIST, res.data.message)
    } else {
      Notification({
        type: 'error',
        title: res.data.message
      })
    }
    return res
  },

  async getPlaylistByTreeId ({ commit, state }, treeId) {
    let res = null
    try {
      let url = `playlists?tree_id=${treeId}`
      res = await http.get(url)
    } catch (e) {
      console.log(e)
    }
    if (res) {
      commit(SET_PLAYLISTS, res.data.message)
    }
    return res
  }
}
