'use strict'

const Role = () => import(/* webpackChunkName: "role-index" */ '../pages/index.vue')
const RoleList = () => import(/* webpackChunkName: "role-list" */ '../components/RoleList.vue')

export default {
  path: '/roles',
  component: Role,
  children: [
    {
      name: 'roles',
      path: '',
      component: RoleList
    }
  ]
}
