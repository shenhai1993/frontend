const Exampleright = () => import('../pages/index.vue')

const List = () => import('../pages/list/index.vue')

export default {
  path: 'exampleright',
  name: 'exampleright',
  component: Exampleright,
  redirect: '/exampleright/list',
  children: [
    {
      name: 'examplerightlist',
      path: 'list',
      component: List
    }
  ]
}
