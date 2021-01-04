import http from '@static/js/utils/http.js'

const UserAPI = {
  async getUsers (groupId) {
    return http.get(`/users?group_id=${groupId}`)
  },

  async create (user) {
    return http.post('users', user)
  },

  async remove (id, data) {
    return http.delete(`users/${id}`, data)
  },

  async modify (user) {
    return http.put(`users/${user.id}`, user)
  }
}

export default UserAPI
