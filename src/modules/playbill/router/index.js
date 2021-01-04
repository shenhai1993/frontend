'use strict'

const Playbill = () => import('../pages/index.vue')
const PlaybillList = () => import('../components/PlaybillList.vue')

export default {
  path: 'playbill',
  component: Playbill,
  children: [
    {
      name: 'playbill',
      path: '',
      component: PlaybillList
    }
  ]
}
