'use strict'

const Template = () => import(/* webpackChunkName: "template-index" */ '../pages/index.vue')
const TemplateList = () => import(/* webpackChunkName: "template-list" */ '../pages/list.vue')
const TemplateStore = () => import(/* webpackChunkName: "template-store" */ '../pages/store.vue')

export default {
  path: 'template',
  component: Template,
  redirect: '/template/list',
  children: [ {
    path: 'list',
    component: TemplateList
  }, {
    path: 'store',
    component: TemplateStore
  }]
}
