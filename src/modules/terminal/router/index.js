'use strict'

const Terminals = () => import(/* webpackChunkName: "terminal-index" */ '../pages/index.vue')
// const TerminalList = () => import(/* webpackChunkName: "list-index" */ '../pages/list/index.vue')
const GroupTerminals = () => import(/* webpackChunkName: "group-terminal" */ '../pages/terminal/terminals.vue')

export default {
  name: 'terminals',
  path: '/terminals',
  redirect: '/terminals/index',
  component: Terminals,
  children: [
    {
      name: '终端',
      path: 'index',
      component: GroupTerminals
    },
    {
      name: '',
      path: 'group/:id',
      component: GroupTerminals
    }
  ]
}
