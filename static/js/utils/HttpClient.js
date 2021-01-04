'use strict'

import axios from 'axios'
// const axios = require('axios')
// import qs from 'qs'

// const instance = axios.create()

const HTML_LINE_BREAK = '<br />'

axios.defaults.baseURL = '/bank/'
axios.defaults.withCredentials = true

axios.interceptors.request.use(config => {
  // loading
  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  return response
}, error => {
  return Promise.resolve(error.response)
})

const check = function (response, notify) {
  if (!response) return Promise.reject(new Error('response is not avaiable'))

  if (response.status !== 200) {
    let { type, message } = getMessage(response)

    setTimeout(() => {
      notify({
        type: type,
        message: message
      }) // async is better
    }, 0)
    return Promise.reject(new Error(`[${response.status}] ${message}`))
  }

  return response
}

const getMessage = (response) => {
  if (response.data.errors) {
    let errors = []
    for (let key of Object.keys(response.data.errors)) {
      errors.push(response.data.errors[key])
    }

    return { type: 'error', message: errors.join(HTML_LINE_BREAK) }
  }

  return { type: 'success', message: response.data.message || response.data }
}

// 中断请求
let CancelToken = axios.CancelToken
let source = CancelToken.source()

const defaultOptions = {
  notify: function (options) {
    let _options = options || { type: 'error', message: '未知错误' }
    console.log(`${_options.type}: ${_options.message}`)
  }
}

export default class HttpClient {
  constructor (options) {
    this.options = options || defaultOptions
  }

  setOptions (options) {
    this.options = options || defaultOptions
  }

  get (url, data) {
    return this._request(url, 'GET', data)
  }

  put (url, data) {
    return this._request(url, 'PUT', data)
  }

  post (url, data, cb) {
    return this._request(url, 'POST', data)
  }

  delete (url, data) {
    return this._request(url, 'DELETE', data)
  }

  upload (url, data) {
    return this._request(url, 'UPLOAD', data)
  }

  abort () {
    axios.abort('whatever')
  }

  cancel () {
    if (source) source.cancel('Operation canceled by the user.')
  }

  _request (url, method, data) {
    let params = data
    let timeout = 5000 // 5 seconds
    let headers = { // defualt header for GET method
      'X-Requested-With': 'XMLHttpRequest'
    }

    switch (method) {
      case 'POST':
      case 'PUT':
        params = ''
        timeout = 1000 * 60 * 10 // 10 minutes
        // data = qs.stringify(data)
        headers = {
          'X-Requested-With': 'XMLHttpRequest'
          // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
        break
    }

    return axios({
      method: method,
      url,
      params,
      data,
      timeout: timeout,
      headers: headers,
      cancelToken: source.token
    }).then(response => check(response, this.options.notify))
  }
}

// module.exports = HttpClient

// test code
if (require.main === module) {
  let http = new HttpClient({
    'notify': console.log
  })
  http.post('login', {
    'name': 'zonghang',
    'password': '123456'
  }).then(res => console.log('response', res.data))
    .catch(err => console.log('error', err.message))
}
