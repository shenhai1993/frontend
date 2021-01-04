import http from '@static/js/utils/http.js'

const Api = {
  async remove (id) {
    let res = http.delete(`tags/${id}`)
    return res
  },
  async setSuggest (id, setValue) {
    let res = http.get(`tags/suggest/${id}/${setValue}`)
    return res
  }
}

export {Api}
