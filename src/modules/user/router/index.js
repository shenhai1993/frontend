const User = () => import('../pages/index.vue')
const UserList = () => import('../components/UserList.vue')

export default {
  path: '/users',
  component: User,
  children: [
    {
      name: '用户',
      path: '',
      component: UserList
    },
    {
      name: 'userListParams',
      path: '',
      props: (route) => ({query: route.query.groupId}),
      component: UserList
    }
  ]
}
