import http from '@static/js/utils/http.js'

const Attribute = {
  async getProducts () {
    return http.get('products')
  },
  async create (data) {
    return http.post('products/attribute', data)
  },
  async edit (id, data) {
    return http.put(`products/${id}`, data)
  },
  async remove (id) {
    let res = http.delete(`products/attribute/${id}`)
    return res
  }
}

export {Attribute}
