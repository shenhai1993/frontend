'use strict'

const PaymentIndex = () => import('../pages/index.vue')
const PaymentList = () => import('../components/list.vue')

export default {
  path: '/payment',
  component: PaymentIndex,
  children: [
    {
      name: 'payment',
      path: '',
      component: PaymentList
    }
  ]
}
