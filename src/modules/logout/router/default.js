'use strict'

const logout = () => import(/* webpackChunkName: "logout-default" */ '../pages/default.vue')

export default {
  path: '/logout',
  name: 'logout',
  component: logout
}
