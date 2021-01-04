'use strict'

const Template = () => import(/* webpackChunkName: "template-index" */ '../pages/index.vue')
const TemplateEditor = () => import(/* webpackChunkName: "template-index" */ '../pages/editor.vue')
const TemplateList = () => import(/* webpackChunkName: "template-index" */ '../pages/list.vue')

export default {
  path: 'template',
  component: Template,
  redirect: '/template/list',
  children: [{
    path: 'list',
    name: 'templatelist',
    component: TemplateList
  }, {
    path: 'create',
    name: 'templateedit1',
    component: TemplateEditor
  }, {
    path: 'create/:type',
    name: 'templateedit3',
    component: TemplateEditor
  }, {
    path: 'edit/:id',
    name: 'templateedit',
    component: TemplateEditor
  }]
}
