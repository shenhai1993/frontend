import http from '@static/js/utils/http.js'

const Drug = {
  async getDrugs () {
    return http.get('contents')
  },

  async create (data) {
    return http.post('contents', data)
  },

  async edit (id, data) {
    return http.put(`contents/${id}`, data)
  },
  async stock (data) {
    return http.post('contents/add-stock', data)
  },
  async gallery (data) {
    return http.post('contents/gallery', data)
  },
  async remove (id) {
    let res = http.delete(`contents/${id}`)
    return res
  }
}

export {Drug}
