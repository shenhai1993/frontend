'use strict'

const Permission = () => import('../pages/index.vue')
const PermissionList = () => import('../components/List.vue')

export default {
  name: '',
  path: '/permission',
  component: Permission,
  children: [
    {
      name: '角色',
      path: '',
      component: PermissionList
    }
  ]
}
