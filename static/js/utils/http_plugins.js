'use strict'

import HttpClient from './HttpClient'

const client = new HttpClient()

let http = {
  install: function (Vue, options) {
    Vue.prototype.$http = this
    Vue.$http = this

    client.setOptions(options)
  },

  get: function (url, data) {
    return client.get(url, data)
  },

  post: function (url, data) {
    return client.get(url, data)
  },

  put: function (url, data) {
    return client.get(url, data)
  },

  delete: function (url, data) {
    return client.get(url, data)
  }
}

export default http

if (typeof exports === 'object') {
  module.exports = http
} else if (window.Vue) {
  window.http = http
  window.Vue.use(http)
}
