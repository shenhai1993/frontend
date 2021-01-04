'use strict'

import http from '@static/js/utils/http'

export default {
  async getMarquee (params) {
    let url = 'marquees'
    if (params) {
      url = `marquees?${params}`
    }
    return http.get(url)
  },

  async createMarquee (marquee) {
    return http.post('marquees', marquee)
  },

  async removeMarquee (id) {
    return http.delete(`marquees/${id}`)
  },

  async editMarquee (id, marquee) {
    return http.put(`marquees/${id}`, marquee)
  },

  async publishMarquee (id) {
    return http.put(`marquees/publish/${id}`)
  },

  async stopMarquee (id) {
    return http.put(`marquees/stop/${id}`)
  }
}
