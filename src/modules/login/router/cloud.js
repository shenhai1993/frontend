'use strict'

const login = () => import(/* webpackChunkName: "login-cloud" */ '../pages/cloud.vue')

export default {
  path: '/login',
  component: login
}
