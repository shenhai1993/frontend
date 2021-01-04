import http from '@static/js/utils/http.js'

const Ordering = {
  async getOrdering () {
    return http.get('ordering')
  },
  async getOrderDesc (id) {
    let res = http.get(`pay/orderDesc/${id}`)
    return res
  }
}

export {Ordering}
