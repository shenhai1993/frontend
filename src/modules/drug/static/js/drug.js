import http from '@static/js/utils/http.js'

const Drug = {
  async getDrugs () {
    return http.get('drugs')
  },

  async create (data) {
    return http.post('drugs', data)
  },

  async edit (id, data) {
    return http.put(`drugs/${id}`, data)
  },
  async stock (data) {
    return http.post('drugs/add-stock', data)
  },
  async gallery (data) {
    return http.post('drugs/gallery', data)
  },
  async remove (id) {
    let res = http.delete(`drugs/${id}`)
    return res
  }
}

export {Drug}
