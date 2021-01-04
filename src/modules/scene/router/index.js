'use strict'

const Scene = () => import(/* webpackChunkName: "scene-index" */ '../pages/index.vue')
const SceneEditor = () => import(/* webpackChunkName: "scene-editor" */ '../pages/editor.vue')
const SceneList = () => import(/* webpackChunkName: "scene-list" */ '../pages/list.vue')

export default {
  path: 'scene',
  component: Scene,
  redirect: '/scene/list',
  children: [ {
    path: 'list',
    name: 'scenelist',
    component: SceneList
  }, {
    path: 'create',
    name: 'sceneedit1',
    component: SceneEditor
  }, {
    path: 'create/:type',
    name: 'sceneedit2',
    component: SceneEditor
  }, {
    path: 'edit/:id',
    name: 'sceneedit',
    component: SceneEditor
  }]
}
