'use strict'

const TagIndex = () => import(/* webpackChunkName: "tag-index" */ '../pages/index.vue')
const TagList = () => import(/* webpackChunkName: "tag-list" */ '../components/list.vue')

export default {
  path: '/tag',
  component: TagIndex,
  children: [
    {
      name: '标签管理',
      path: '',
      component: TagList
    }
  ]
}
