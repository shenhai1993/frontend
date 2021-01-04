'use strict'

const login = () => import(/* webpackChunkName: "login-default" */ '../pages/default.vue')

export default {
  path: '/login',
  component: login
}
