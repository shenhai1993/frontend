const Terminal = () => import('../pages/index.vue')

// const Exhibition = () => import(/* webpackChunkName: "exhibition-index" */ '../pages/exhibition/index.vue')
const TerminalList = () => import(/* webpackChunkName: "list-index" */ '../pages/list/index.vue')
// const GroupEdit = () => import(/* webpackChunkName: "groupedit-index" */ '../pages/groupedit/index.vue')
// const Ungrouped = () => import(/* webpackChunkName: "ungrouped-index" */ '../pages/ungrouped.vue')

export default {
  path: 'terminals',
  name: 'terminals',
  redirect: '/terminals/list',
  component: Terminal,
  children: [
    // {
    //   path: 'index',
    //   component: Exhibition
    // },
    {
      name: '',
      path: 'list',
      component: TerminalList
    }
    // , {
    //   path: 'group',
    //   component: GroupEdit
    // }, {
    //   path: 'ungroup',
    //   component: Ungrouped
    // }
  ]
}
