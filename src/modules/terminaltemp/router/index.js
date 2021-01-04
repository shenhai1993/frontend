'use strict'

const TerminaltempIndex = () => import('../pages/index.vue')
const TerminaltempList = () => import('../pages/list/index.vue')
const TerminaltempMain = () => import('../pages/main/index.vue')

export default {
  path: '/terminaltemps',
  component: TerminaltempIndex,
  children: [
    {
      name: 'TempsList',
      path: '',
      component: TerminaltempList
    },
    {
      name: 'TempsMain',
      path: 'main',
      component: TerminaltempMain
    }
  ]
}
