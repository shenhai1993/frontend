'use strict'

import http from '../../../../../static/js/utils/http'

export default {
  getGroupTree () {
    return http.get('directories')
  },

  addGroup (formData) {
    return http.post('directories', formData)
  },

  editGroup (id, formData) {
    return http.put(`directories/${id}`, formData)
  },

  removeGroup (id) {
    return http.delete(`directories/${id}`)
  }
}
