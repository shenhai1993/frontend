'use strict'

import {SET_PERMISSIONLIST, SET_ROLELIST, SHOW_EDIT_WINDOW, REMOVE_FROM_ROLELIST, SET_ROLE_PROPERT_BY_INDEX} from './mutation-types.js'
import { Notification } from 'element-ui'
import {Role, Base} from '../static/js/role.js'

export default {
  async getPermissions ({commit, state}) {
    let res = await Base.getPermissions()
    if (res.data.success) {
      commit(SET_PERMISSIONLIST, res.data.message)
    }
  },

  async getRoles ({commit, state}) {
    let res = await Role.getRoles()
    if (res.data.success) {
      commit(SET_ROLELIST, {roleList: res.data.message, append: false})
      return Promise.resolve
    }
    return Promise.reject
  },

  async editRole ({commit, state}, {id, data, index}) {
    let res = await Role.edit(id, data)
    if (res.data.success) {
      commit(SET_ROLE_PROPERT_BY_INDEX, {index, role: res.data.message})
      commit(SHOW_EDIT_WINDOW, false)
      Notification({
        type: 'success',
        title: '操作成功'
      })
      return Promise.resolve
    } else {
      Notification({
        type: 'error',
        title: res.data.message
      })
    }
    return Promise.reject
  },

  async createRole ({commit, state}, role) {
    let res = await Role.create(role)
    commit(SET_ROLELIST, {roleList: res.data.message, append: true})
    commit(SHOW_EDIT_WINDOW, false)
    return res
  },

  async removeRole ({commit, state}, id) {
    let res = await Role.remove(id)
    if (res.data.success === true) {
      for (let i = 0; i < state.roleList.length; i++) {
        const role = state.roleList[i]
        if (role.id === id) {
          commit(REMOVE_FROM_ROLELIST, i)
          break
        }
      }
    }
    return res
  }
}
