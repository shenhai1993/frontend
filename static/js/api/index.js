/**
 * @author chenxi(chxi@tcl.com)
 */

'use strict'

import http from '../utils/http'
// import User from './User'

export default {
  login (username, password) {
    return new Promise((resolve, reject) => {
      http.post('login', { 'name': username, 'password': password })
        .then(response => {
          resolve(response.data)
        })
        .catch(e => reject(e))
    })
  },

  logout () {
    let success = false

    return new Promise((resolve, reject) => {
      http.post('logout')
        .then(res => {
          console.log(res)
          if (res.status !== -404) {
            success = true
          }

          resolve({ 'success': success })
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  me () {
    return http.get('me')
  },

  removeTemplate (id) {
    return new Promise((resolve, reject) => {
      http.delete(`templates/${id}`)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  checkMobile (mobile) {
    return http.get('user', { 'phone': mobile })
  },

  getCode (mobile) {
    return http.get('getcode', { 'phone': mobile })
  },

  registerUser (data) {
    return http.post('user/register', data)
  },

  resetpass (data) {
    return http.post('me/resetpass', data)
  },

  forgot (data) {
    return http.post('user/forgot', data)
  },

  getAudit (type) {
    return http.get(`${type}/audit/settings`)
  }
}
