import http from '@static/js/utils/http.js'

const Role = {
  async getRoles () {
    return http.get('roles')
  },

  async create (role) {
    return http.post('roles', role)
  },

  async edit (id, data) {
    return http.put(`roles/${id}`, data)
  },

  async remove (id) {
    let res = http.delete(`roles/${id}`)
    return res
  }
}

const Base = {
  async getPermissions () {
    return http.get('permissions')
  }
}

export {Role, Base}
