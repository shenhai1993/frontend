import http from '@static/js/utils/http.js'

const Product = {
  async getProducts () {
    return http.get('products')
  },

  async create (data) {
    return http.post('products', data)
  },
  async edit (id, data) {
    return http.put(`products/${id}`, data)
  },
  async stock (data) {
    return http.post('products/add-stock', data)
  },
  async gallery (data) {
    return http.post('products/gallery', data)
  },
  async remove (id) {
    let res = http.delete(`products/${id}`)
    return res
  },
  async sale (data) {
    let res = http.post(`products/sale`, data)
    return res
  },
  async recommend (data) {
    let res = http.post(`products/recommend`, data)
    return res
  },
  async pack (data) {
    let res = http.post(`products/pack`, data)
    return res
  }
}

export {Product}
