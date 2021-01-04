'use strict'
import RouterTerminal from '@/modules/terminal/router'
import RouterRole from '@/modules/role/router'
import RouterUser from '@/modules/user/router'

export default [{
  path: '/',
  component: () => import('@/pages/mainpage.vue'),
  redirect: '/login',
  children: [
    RouterTerminal,
    RouterRole,
    RouterUser
  ]
}]
