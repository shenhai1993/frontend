'use strict'

const Vod = () => import('../pages/index.vue')
const VodList = () => import('../components/VodList.vue')

export default {
  component: Vod,
  path: 'vod',
  children: [
    {
      name: 'vodList',
      path: '',
      component: VodList
    }
  ]
}
