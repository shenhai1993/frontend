'use strict'

const DrugIndex = () => import(/* webpackChunkName: "drug-index" */ '../pages/index.vue')
const DrugList = () => import(/* webpackChunkName: "drug-list" */ '../components/list.vue')

export default {
  path: '/drug',
  component: DrugIndex,
  children: [
    {
      name: '药品管理',
      path: '',
      component: DrugList
    }
  ]
}
