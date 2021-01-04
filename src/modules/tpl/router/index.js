'use strict'

import TemplateEditor from '../pages/editor.vue'
const Template = () => import(/* webpackChunkName: "tpl-index" */ '../pages/index.vue')
const TemplateList = () => import(/* webpackChunkName: "tpl-list" */ '../pages/list.vue')
// const TemplateEditor = () => import(/* webpackChunkName: "tpl-editor" */ '../pages/editor.vue')

export default {
  path: 'tpl',
  component: Template,
  redirect: '/tpl/list',
  children: [
    {
      name: '模板',
      path: '/tpl/list',
      component: TemplateList
    },
    {
      path: 'editor',
      name: '',
      component: TemplateEditor
    },
    {
      name: '模板编辑',
      path: 'editor/:id',
      component: TemplateEditor
    }
  ]
}
