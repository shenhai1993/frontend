'use strict'

const Mpdp = () => import(/* webpackChunkName: "dpdp-index" */ '../pages/index.vue')

const Virtual = () => import(/* webpackChunkName: "dpdp-virtual" */ '../pages/virtual.vue')
const Ungrouped = () => import(/* webpackChunkName: "dpdp-ungrouped" */ '../pages/ungrouped.vue')
const Playlist = () => import(/* webpackChunkName: "dpdp-playlist" */ '../pages/playlist.vue')
const Playliststable = () => import(/* webpackChunkName: "dpdp-playlist-stable" */ '../pages/playlist/lists.vue')
const Playlistedit = () => import(/* webpackChunkName: "dpdp-playlist-edit" */ '../pages/playlist/editor.vue')

// const Scene = () => import(/* webpackChunkName: "dpdp-index" */ '../pages/scene/list.vue')
// const Create = () => import(/* webpackChunkName: "dpdp-create" */ '../../scene/pages/editor.vue')
const SceneList = () => import(/* webpackChunkName: "scene-list" */ '../pages/scene/list.vue')
const SceneCreate = () => import(/* webpackChunkName: "scene-editor" */ '../pages/scene/create.vue')
const SceneEditor = () => import(/* webpackChunkName: "scene-editor" */ '../pages/scene/editor.vue')
const Irregular = () => import(/* webpackChunkName: "scene-list" */ '../pages/irregular/index.vue')

export default {
  path: 'mpdp',
  name: 'mpdp',
  component: Mpdp,
  redirect: '/mpdp/ungrouped',
  children: [
    {
      path: 'ungrouped',
      name: '拼接终端',
      component: Ungrouped
    },
    {
      path: 'virtual',
      name: 'virtual',
      component: Virtual
    },
    {
      path: 'playlist',
      name: 'mpdpPlaylist',
      component: Playlist,
      redirect: '/mpdp/playlist/lists',
      children: [
        {
          path: 'lists',
          component: Playliststable
        },
        {
          path: 'edit/:cid/:id',
          name: 'mpdpplaylistedit',
          component: Playlistedit
        },
        {
          path: 'edit',
          component: Playlistedit,
          name: 'playlistedit'
        }
      ]
    },
    {
      path: 'scene/list',
      name: 'scenelist',
      component: SceneList
    }, {
      path: 'scene/create',
      name: 'sceneedit1',
      component: SceneCreate
    }, {
      path: 'create/:type',
      name: 'sceneedit2',
      component: SceneEditor
    }, {
      path: 'edit/:id',
      name: 'sceneedit',
      component: SceneEditor
    },
    {
      path: 'irregular/index',
      name: 'irregular',
      component: Irregular
    }
    // {
    //   path: 'scene',
    //   component: Scene,
    //   redirect: '/mpdp/scene/list',
    //   children: [
    //     {
    //       path: 'list',
    //       name: 'scenelist',
    //       component: SceneList
    //     }, {
    //       path: 'create',
    //       name: 'sceneedit1',
    //       component: SceneEditor
    //     }, {
    //       path: 'create/:type',
    //       name: 'sceneedit2',
    //       component: SceneEditor
    //     }, {
    //       path: 'edit/:id',
    //       name: 'sceneedit',
    //       component: SceneEditor
    //     }
    //   ]
    // }
  ]
}
