'use strict'

import VueCookie from 'vue-cookies'
import http from '../utils/http'
import { Notification } from 'element-ui'

const authLogin = function (to, from, next) {
  // 检查当前是否已登录，未登录直接跳转至 login
  let authUser = null
  try {
    // authUser = JSON.parse(VueCookie.get('authUser'))
    let objAuth = VueCookie.get('authUser')
    authUser = (typeof objAuth === 'string') ? JSON.parse(VueCookie.get('authUser')) : VueCookie.get('authUser')
  } catch (e) { console.log(e) }

  // 模板自动化的下发页面不需要登录
  if (to.path === '/mall') {
    return next()
  }
  // 排队叫号的下发页面不需要登录
  if (/queuing\/terminals/.test(to.path)) {
    return next()
  }

  let isLogin = authUser && authUser.id > 0
  if (isLogin) { // 已经登录
    if (to.path === '/login') { // 如果已登录，router是login，跳转到/
      return next({ path: '/welcome' })
    }

    return next()
  } else { // 未登录
    if (to.path === '/login') {
      return next()
    }

    return next('/login')
  }
}

const cancelXHR = (to, from) => {
  if (!to.meta.token || to.meta.token !== from.meta.token) {
    http.cancel()
  }
}

const auth = function (to, from, next) {
  cancelXHR(to, from)
  let license = sessionStorage.getItem('license')
  license = (typeof license === 'string' && license !== 'undefined') ? JSON.parse(license) : license // ok , expired, invalid, noexist
  if (license === null || license === {}) {
    return http.get('/license')
      .then(res => {
        sessionStorage.setItem('license', JSON.stringify(res.data.message))
        if (res.data.message.code !== 'ok') {
          Notification({
            title: '错误',
            type: 'error',
            message: res.data.message.err
          })
          if (to.path === '/license') {
            return next()
          } else {
            return next('/license')
          }
        }
        authLogin(to, from, next)
      })
      .catch(err => {
        /* if (err.data) {
          if (err.data.message.hasOwnProperty('end_date')) {
            let list = err.data.message
            list.status = 1
            sessionStorage.setItem('licenseList', JSON.stringify(list))
          }
        } */
        /* sessionStorage.setItem('licenseList', err.data.message.code)
        if (to.path === '/license') {
          return next()
        } else {
          return next('/license')
        } */
      })
  } else {
    if (license.code !== 'ok') {
      Notification({
        title: '错误',
        type: 'error',
        message: license.err
      })
      if (to.path === '/license') {
        return next()
      } else {
        return next('/license')
      }
    } else {
      authLogin(to, from, next)
    }
  }
}

export default auth
