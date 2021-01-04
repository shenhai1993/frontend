'use strict'

const Element = () => import(/* webpackChunkName: "element-index" */ '../pages/index.vue')
const ElementList = () => import(/* webpackChunkName: "element-list" */ '../pages/element.vue')

// const filelist = () => import('../components/filelist')

export default {
  path: '/elements',
  name: '素材管理',
  component: Element,
  // redirect: '/elements/',
  // children: [{
  //   path: 'all/:id',
  //   component: ElementList,
  //   meta: {token: 'elements'}
  // }, {
  //   path: 'image/:id',
  //   component: ElementList,
  //   meta: {token: 'elements'}
  // }, {
  //   path: 'video/:id',
  //   component: ElementList,
  //   meta: {token: 'elements'}
  // }, {
  //   path: 'audio/:id',
  //   component: ElementList,
  //   meta: {token: 'elements'}
  // }, {
  //   path: 'stream/:id',
  //   component: ElementList,
  //   meta: {token: 'elements'}
  // }, {
  //   path: 'webpage/:id',
  //   component: ElementList,
  //   meta: {token: 'elements'}
  // }],
  children: [
    {
      name: '素材管理列表',
      path: 'directory/:id',
      component: ElementList
    }
  ]
}
