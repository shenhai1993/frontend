'use strict'

const Index = () => import('../pages/index')
const Server = () => import('../pages/server')
// const Weather = () => import('../pages/weather')
const Examine = () => import('../pages/examine')
const AutoDelete = () => import('../pages/autoDelete')
const Upgrade = () => import('../pages/upgrade')
const UpgradeList = () => import('../pages/upgradeList')
const Authorize = () => import('../pages/authorize')

export default {
  path: 'setting',
  name: 'setting',
  redirect: 'setting/server',
  component: Index,
  children: [
    {
      path: 'server',
      component: Server,
      name: '系统设置'
    },
    // {
    //   path: 'weather',
    //   component: Weather
    // },
    {
      name: '系统设置审核',
      path: 'examine',
      component: Examine
    },
    {
      path: 'autoDelete',
      component: AutoDelete
    },
    {
      path: 'upgrade',
      component: Upgrade,
      children: [
        {
          path: 'list',
          name: 'list',
          component: UpgradeList
        }
      ]
    },
    {
      path: 'authorize',
      component: Authorize
    }
  ]
}
