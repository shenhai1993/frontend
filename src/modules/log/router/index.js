'use strict'

const Log = () => import('../pages/index.vue')
const LogList = () => import('../components/LogList.vue')

export default {
  path: '/logs',
  component: Log,
  children: [
    {
      name: 'logs',
      path: '',
      component: LogList
    }
  ]
}
