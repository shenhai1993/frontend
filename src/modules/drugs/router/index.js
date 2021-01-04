'use strict'

const DrugsIndex = () => import(/* webpackChunkName: "drug-index" */ '../pages/index.vue')
const DrugsList = () => import(/* webpackChunkName: "drug-list" */ '../components/list.vue')
const DrugsListedit = () => import('../components/editor.vue')

export default {
  path: '/content',
  redirect: '/content/list',
  component: DrugsIndex,
  children: [
    {
      name: '',
      path: 'list',
      component: DrugsList
    },
    {
      path: 'edit',
      component: DrugsListedit,
      name: '内容管理'
    },
    {
      path: 'edit/:id',
      name: '',
      component: DrugsListedit
    }
  ]
}
