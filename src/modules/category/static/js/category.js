import http from '@static/js/utils/http.js'

const Category = {
  async getDroducts () {
    return http.get('products')
  },

  async create (data) {
    return http.post('products/category', data)
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
    let res = http.delete(`products/category/${id}`)
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
  async categorypack (data) {
    let res = http.post(`products/categorypack`, data)
    return res
  }
}

export {Category}
