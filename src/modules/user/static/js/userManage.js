'use strict'

import UserAPI from './userAPI'

export default {
  async createUser (user) {
    let data = null
    try {
      let res = await UserAPI.create(user)
      data = res.data.message
    } catch (e) {
      console.log(e)
    }
    return data
  },

  async modifyUser (user) {
    let res = null
    try {
      res = await UserAPI.modify(user)
    } catch (e) {
      console.log(e)
    }
    return res
  },

  async getUsers (groupId) {
    let data = null
    try {
      let res = await UserAPI.getUsers(groupId)
      data = res.data.message
    } catch (e) {
      console.log(e)
    }
    return data
  },

  async removeUser (id, data) {
    try {
      await UserAPI.remove(id, data)
      return true
    } catch (e) {
      console.log(e)
    }
    return false
  }
}
