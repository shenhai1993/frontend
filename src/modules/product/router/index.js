'use strict'

const ProductIndex = () => import('../pages/index.vue')
const ProductList = () => import('../components/list.vue')

export default {
  path: '/products',
  component: ProductIndex,
  children: [
    {
      name: 'products',
      path: '',
      component: ProductList
    }
  ]
}
