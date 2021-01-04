'use strict'

import http from '@static/js/utils/http'

export default {
  async resetPassword (data) {
    let res = null
    try {
      res = await http.put('me/resetpass', data)
    } catch (e) {}
    return res
  }
}
