import sortable from '../pages/sortable'

const Demo = () => import('../pages/index.vue')

const List = () => import('../pages/list/index.vue')

export default {
  path: 'demo',
  name: 'demo',
  component: Demo,
  redirect: '/demo/list',
  children: [
    {
      name: 'demoList',
      path: 'list',
      component: List
    },
    {
      name: 'sortable',
      path: 'test',
      component: sortable
    }
  ]
}
