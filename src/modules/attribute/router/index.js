'use strict'

const AttributeIndex = () => import('../pages/index.vue')
const AttributeList = () => import('../components/list.vue')

export default {
  path: '/attributes',
  component: AttributeIndex,
  children: [
    {
      name: 'attributes',
      path: '',
      component: AttributeList
    }
  ]
}
