'use strict'

const Index = () => import('../pages/index')
const Elements = () => import('../pages/elements')
const Marquee = () => import('../pages/marquee')
const PlayList = () => import('../pages/playList')
// const playlists = () => import('../components/list.vue')

export default {
  path: 'examine',
  name: 'examine',
  redirect: 'examine/elements',
  component: Index,
  children: [
    {
      path: 'elements',
      component: Elements,
      name: '系统审核'
    },
    {
      path: 'marquee',
      component: Marquee
    },
    {
      path: 'playList',
      component: PlayList
    }
  ]
}
