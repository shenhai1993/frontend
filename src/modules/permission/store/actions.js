'use strict'

import {SET_PERMISSIONSLIST, SET_EDITWINDOW, REMOVE_FROM_PERMISSIONSLIST, SET_ROLE_PERMISSION_BY_INDEX} from './mutation-types.js'
import http from '../../../../static/js/utils/http'
import { Notification } from 'element-ui'

export default {
  async getPermissionsList ({commit, state}) {
    // 获取内容列表
    let url = '/permissions/'
    http.get(url).then(res => {
      if (res.data.success) {
        setTimeout(() => {
          commit(SET_PERMISSIONSLIST, {permissions: res.data.message, append: false})
        }, 100)
        return Promise.resolve
      }
      return Promise.reject
    }).catch(err => {
      console.log(err)
    })
  },
  async addPermissionsList ({commit, state}, name) {
    let url = '/permissions/'
    http.post(url, {name: name}).then(res => {
      if (res.data.success) {
        Notification({
          type: 'success',
          title: '添加成功！'
        })
        commit(SET_EDITWINDOW, false)
        commit(SET_PERMISSIONSLIST, {permissions: res.data.message, append: true})
        return Promise.resolve
      }
      return Promise.reject
    }).catch(err => {
      console.log(err)
    })
  },
  async editorPermissionsList ({commit, state}, {id, name, index}) {
    let url = '/permissions/' + id
    http.put(url, {name: name}).then(res => {
      if (res.data.success) {
        Notification({
          type: 'success',
          title: '修改成功！'
        })
        commit(SET_ROLE_PERMISSION_BY_INDEX, {index, permissiom: res.data.message})
        commit(SET_EDITWINDOW, false)
        return Promise.resolve
      }
      return Promise.reject
    }).catch(err => {
      console.log(err)
    })
  },
  async removePermissions ({commit, state}, id) {
    let url = '/permissions/' + id
    http.delete(url).then(res => {
      if (res.data.success === true) {
        for (let i = 0; i < state.permissionsList.length; i++) {
          const permiss = state.permissionsList[i]
          if (permiss.id === id) {
            commit(REMOVE_FROM_PERMISSIONSLIST, i)
            break
          }
        }
        Notification({
          type: 'success',
          title: '删除成功！'
        })
      }
    }).catch(err => {
      console.log(err)
    })
  }
}
