'use strict'

const Servers = () => import(/* webpackChunkName: "server-index" */ '../pages/index.vue')
const List = () => import(/* webpackChunkName: "server-list" */ '../pages/list.vue')

export default {
  path: 'server',
  component: Servers,
  redirect: 'server/all',
  children: [
    {
      path: '/server/:type',
      component: List
    }
  ]
}
