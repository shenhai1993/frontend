'use strict'

// import axios from 'axios'
const axios = require('axios')

const HTML_LINE_BREAK = '<br />'

axios.defaults.baseURL = process.env.API_BASE
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
  if (error.response) {
    return Promise.reject(error.response)
  }
  return Promise.reject(error)
})

const check = function (response, cb) {
  if (!response || response.status !== 200
    ||
    (response.data && response.data.success == false) // 新增json直接返回结果判断
) {
    let message = getMessage(response)

    setTimeout(() => {
      cb(message) // async is better
    }, 0)
    // let status = response ? response.status : -500
    return Promise.reject(response)
  }
  authFlag = true
  return Promise.resolve(response)
}

const handleError = (thrown, cb) => {
  if (axios.isCancel(thrown)) {
    return Promise.reject(thrown.message)
  }
  if (!thrown || thrown.status !== 200) {
    let message = getMessage(thrown)
    if (authFlag && message.status <= 500) { // 501 以上为业务逻辑报错, 回调自行决定处理逻辑
      setTimeout(() => {
        cb(message) // async is better
      }, 0)
    }
    authFlag = message.auth
    // let status = response ? response.status : -500
    return Promise.reject(thrown)
  }
}

const getMessage = (response) => {
  let auth = true
  if (!response) {
    return {
      auth: auth,
      type: 'error',
      title: '网络错误',
      message: '请求失败，请稍后重试！'
    }
  }

  auth = response.status !== 401
  if (response.data.errors) {
    let errors = []
    for (let key of Object.keys(response.data.errors)) {
      errors.push(response.data.errors[key])
    }

    return {
      auth: auth,
      type: 'warning',
      title: `警告 ${response.status}`,
      message: errors.join(HTML_LINE_BREAK)
    }
  }

  return {
    auth: auth,
    type: 'error',
    title: `错误 ${response.status}`,
    status: response.status,
    message: response.data.message || response.data
  }
}

// 中断请求
let CancelToken = axios.CancelToken
// let source = CancelToken.source()
// let cancelFn
let cancelList = []
let authFlag = true

const defaultOptions = {
  cb: function (options) {
    let _options = options || { type: 'error', message: '未知错误' }
    console.log(`${_options.type}: ${_options.message}`)
  }
}

class HttpClient {
  constructor (options) {
    this.options = options || defaultOptions
  }

  setOptions (options) {
    this.options = options || defaultOptions
  }

  getOptions () {
    return this.options
  }

  get (url, data, options) {
    return this._request(url, 'GET', data, options)
  }

  put (url, data, options) {
    return this._request(url, 'PUT', data, options)
  }

  post (url, data, options) {
    return this._request(url, 'POST', data, options)
  }

  delete (url, data, options) {
    return this._request(url, 'DELETE', data, options)
  }

  upload (url, data, options) {
    return this._request(url, 'UPLOAD', data, options)
  }

  abort () {
    axios.abort('whatever')
  }

  cancel () {
    cancelList.forEach(cancel => {
      cancel('Request canceled')
    })
    cancelList = []
  }

  _request (url, method, data, options) {
    let params = data
    let timeout = 10000 // 10 seconds
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
    let opts = Object.assign({
      method: method,
      url,
      params,
      data,
      timeout: timeout,
      headers: headers,
      cancelToken: new CancelToken(function executor (c) {
        if (options && options.canNotCancel) {
          return
        }
        cancelList.push(c)
      })
    }, options)
    return axios(opts).then(response => check(response, this.options.cb)).catch(thrown => {
      return handleError(thrown, this.options.cb)
    })
  }
}

const http = new HttpClient()
export default http

// test code
if (require.main === module) {
  let client = HttpClient.getInstance()
  client.post('login').then(res => console.log(res)).catch(e => { throw new Error(e) })
}
