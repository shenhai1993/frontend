'use strict'

const Marquee = () => import('../pages/index.vue')
const MarqueeList = () => import('../components/MarqueeList.vue')

export default {
  component: Marquee,
  path: '/marquee',
  redirect: '/marquee/list',
  children: [
    {
      name: '跑马灯',
      path: 'list',
      component: MarqueeList,
      meta: {token: 'marquee'}
    },
    {
      path: 'published',
      component: MarqueeList,
      meta: {token: 'marquee'}
    },
    {
      path: 'audit',
      component: MarqueeList,
      meta: {token: 'marquee'}
    },
    {
      path: 'unpassed',
      component: MarqueeList,
      meta: {token: 'marquee'}
    },
    {
      path: 'expired',
      component: MarqueeList,
      meta: {token: 'marquee'}
    }
  ]

}
