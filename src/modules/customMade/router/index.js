'use strict'

const index = () => import(/* webpackChunkName: "template-index" */ '../page/index.vue')
const list = () => import(/* webpackChunkName: "template-index" */ '../componts/list.vue')
const edit = () => import(/* webpackChunkName: "template-index" */ '../componts/edit.vue')

export default {
  path: 'customMade',
  redirect: '/customMade/list',
  component: index,
  children: [
    {
      name: '',
      path: 'list',
      component: list
    },
    {
      name: '',
      path: 'edit',
      component: edit
    }
  ]
}
