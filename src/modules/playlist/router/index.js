'use strict'

const index = () => import(/* webpackChunkName: "playlist-main" */ '../pages/index')

const playlists = () => import(/* webpackChunkName: "playlist-index" */ '../pages/playlist/index.vue')
const playlistedit = () => import(/* webpackChunkName: "playlist-editor" */ '../pages/playlist/editor.vue')
const playliststable = () => import(/* webpackChunkName: "playlist-lists" */ '../pages/playlist/lists.vue')

const expired = () => import(/* webpackChunkName: "playlist-expired" */ '../pages/expired/index.vue')

export default {
  path: 'playlist',
  name: 'playlist',
  redirect: '/playlist/index',
  component: index,
  children: [
    {
      path: 'index',
      component: playlists,
      redirect: '/playlist/index/lists',
      name: 'palylistsindex',
      children: [
        {
          path: 'lists',
          component: playliststable
        },
        {
          path: 'edit/:id',
          name: 'playlistedit',
          component: playlistedit
        },
        {
          path: 'edit',
          component: playlistedit
        }
      ]
    }, {
      path: 'expired',
      component: expired,
      name: 'playlistexpired'
    }, {
      path: 'trash',
      name: 'playlisttrash'
    }
  ]
}
