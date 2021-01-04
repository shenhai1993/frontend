import http from '@static/js/utils/http.js'

const Packet = {
  async getPackets () {
    return http.get('products/pagepackets')
  },
  async create (data) {
    return http.post('products/packet', data)
  },
  async remove (id) {
    let res = http.delete(`products/packet/${id}`)
    return res
  },
  async sale (data) {
    let res = http.post(`products/packetSale`, data)
    return res
  },
  async allProducts () {
    return http.get('products/all')
  }
}

export {Packet}
