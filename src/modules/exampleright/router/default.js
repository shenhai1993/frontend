const Exampleleftright = () => import('../pages/index.vue')

const List = () => import('../pages/list/index.vue')

export default {
  path: 'exampleleftright',
  name: 'exampleleftright',
  component: Exampleleftright,
  redirect: '/exampleleftright/list',
  children: [
    {
      name: 'exampleleftrightlist',
      path: 'list',
      component: List
    }
  ]
}
