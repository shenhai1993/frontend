'use strict'

import http from '../../../../static/js/utils/http'

export default {
  getGroupTree (type, groupId) {
    if (groupId) {
      return http.get(`${type}?group_id=${groupId}`)
    }
    return http.get(type) // groups | labels
  },

  addGroup (formData, gtype = 'groups') {
    return http.post(gtype, formData)
  },

  editGroup (id, formData, gtype) {
    return http.put(`${gtype}/${id}`, formData)
  },

  removeGroup (id, gtype) {
    return http.delete(`${gtype}/${id}`)
  },

  // TODO: REMOVE under
  getTerminals (params) {
    return http.get('terminals', params)
  },

  getTags () {
    return http.get('terminals/tags')
  },

  editTerminal (id, data) {
    return http.put(`terminals/${id}`, data)
  },

  delTerminal (id) {
    return http.delete(`terminals/${id}`)
  }
}
