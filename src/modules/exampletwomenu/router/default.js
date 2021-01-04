const Exampletwomenu = () => import('../pages/index.vue')

const List = () => import('../pages/list/index.vue')

export default {
  path: 'exampletwomenu',
  name: 'exampletwomenu',
  component: Exampletwomenu,
  redirect: '/exampletwomenu/list',
  children: [
    {
      name: 'exampletwomenuList',
      path: 'list',
      component: List
    }
  ]
}
