'use strict'

import {SET_USER_LIST, SHOW_EDIT_WINDOW, REMOVE_FROM_USERLIST, SET_USER_PROPERTY_BY_INDEX} from './mutation-types'

import UserManage from '../static/js/userManage'

export default {
  async getUsers ({commit, state}, groupId) {
    let data = await UserManage.getUsers(groupId)
    if (data) {
      commit(SET_USER_LIST, {user: data, append: false})
    }
  },

  async modifyUser ({commit, state}, {user, index}) {
    let res = await UserManage.modifyUser(user)
    if (!res) {
      return res
    } else {
      commit(SET_USER_PROPERTY_BY_INDEX, {index: index, user: res.data.message})
      return res
    }
  },

  async removeUser ({commit, state}, {id, data}) {
    let ret = await UserManage.removeUser(id, data)
    if (ret) {
      for (let i = 0; i < state.userList.length; i++) {
        const user = state.userList[i]
        if (user.id === id) {
          commit(REMOVE_FROM_USERLIST, i)
          break
        }
      }
      return ret
    }
    return ret
  },

  async createUser ({commit, state}, user) {
    let data = await UserManage.createUser(user)
    if (!data) {
      return data
    } else {
      commit(SET_USER_LIST, {user: data, append: true})
      commit(SHOW_EDIT_WINDOW, false)
      return data
    }
  }
}
