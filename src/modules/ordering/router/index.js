'use strict'

const OrderingIndex = () => import('../pages/index.vue')
const OrderingList = () => import('../components/list.vue')

export default {
  path: '/ordering',
  component: OrderingIndex,
  children: [
    {
      name: 'ordering',
      path: '',
      component: OrderingList
    }
  ]
}
