'use strict'

const ManageTerminal = () => import('../pages/manage')
const Terminals = () => import('../pages/terminal/terminals')

export default {
  name: 'manage',
  path: '/manage',
  component: ManageTerminal,
  redirect: '/manage/terminal',
  children: [
    {
      name: '终端维护',
      path: 'terminal',
      component: Terminals
    },
    {
      name: '',
      path: 'terminal/:id',
      component: Terminals
    }
  ]
}
