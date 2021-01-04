'use strict'

const TerminalStatistics = () => import(/* webpackChunkName: "role-index" */ '../pages/index.vue')
const TerminalsList = () => import(/* webpackChunkName: "role-list" */ '../components/StatisticsTerminalsList.vue')
const DetailsList = () => import(/* webpackChunkName: "role-list" */ '../components/StatisticsDetailsList.vue')
const ElementsList = () => import(/* webpackChunkName: "role-list" */ '../components/StatisticsElementsList.vue')
const Playlist = () => import(/* webpackChunkName: "role-list" */ '../components/StatisticsPlaylist.vue')

export default {
  path: '/statistics',
  redirect: '/statistics/terminals',
  component: TerminalStatistics,
  children: [
    {
      name: '统计管理',
      path: '/statistics/terminals',
      component: TerminalsList
    },
    {
      name: '终端播放统计',
      path: '/statistics/details',
      component: DetailsList
    },
    {
      name: '素材日统计',
      path: '/statistics/element',
      component: ElementsList
    },
    {
      name: '播出单统计',
      path: '/statistics/playlists',
      component: Playlist
    },
    {
      name: '终端统计',
      path: '/statistics/terminals_stat',
      component: Playlist
    },
    {
      name: '内容统计',
      path: '/statistics/contents',
      component: Playlist
    }
  ]
}
