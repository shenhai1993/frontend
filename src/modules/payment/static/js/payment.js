import http from '@static/js/utils/http.js'

const Payment = {
  async getPayment () {
    return http.get('payment')
  },
  async create (data) {
    return http.post('payment', data)
  },
  async edit (id, data) {
    return http.put(`payment/${id}`, data)
  },
  async remove (id) {
    let res = http.delete(`payment/${id}`)
    return res
  },
  async showCode (code) {
    let res = http.get(`payment/${code}`)
    return res
  }
}

export {Payment}
