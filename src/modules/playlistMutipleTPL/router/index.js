'use strict'

const index = () => import('../pages/index')
const playlistedit = () => import('../components/editor.vue')

const playlists = () => import('../components/list.vue')

export default {
  path: 'playlistmutipletpl',
  name: 'playlistmutipletpl',
  redirect: '/playlistmutipletpl/lists',
  component: index,
  children: [
    {
      path: 'lists',
      component: playlists,
      name: '播出单',
      meta: {token: 'playlist'}
    },
    {
      path: 'published',
      component: playlists,
      name: '已发布播出单',
      meta: {token: 'playlist'}
    },
    {
      path: 'edit',
      component: playlistedit,
      name: '播出单详情'
    },
    {
      name: '',
      path: 'edit/:id',
      component: playlistedit
    },
    {
      path: 'audit',
      component: playlists,
      name: '待审核播出单',
      meta: {token: 'playlist'}
    },
    {
      path: 'unpassed',
      component: playlists,
      name: '未过审核播出单',
      meta: {token: 'playlist'}
    },
    {
      path: 'expired',
      component: playlists,
      name: '过期播出单',
      meta: {token: 'playlist'}
    }
  ]
}
