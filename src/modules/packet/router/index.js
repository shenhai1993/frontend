'use strict'

const PacketIndex = () => import('../pages/index.vue')
const PacketList = () => import('../components/list.vue')

export default {
  path: '/packets',
  component: PacketIndex,
  children: [
    {
      name: 'packets',
      path: '',
      component: PacketList
    }
  ]
}
