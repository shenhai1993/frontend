'use strict'

const CategoryIndex = () => import('../pages/index.vue')
const CategoryList = () => import('../components/list.vue')

export default {
  path: '/categories',
  component: CategoryIndex,
  children: [
    {
      name: 'categories',
      path: '',
      component: CategoryList
    }
  ]
}
