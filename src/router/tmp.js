import Vue from 'vue'
import Router from 'vue-router'

import RouterWelcome from '@/modules/welcome/router/default'
import RouterLogin from '@/modules/login/router/default'
import RouterLogout from '@/modules/logout/router/default'

Vue.use(Router)

let baseRoute = [
  {
    path: '/',
    component: () => import('@/pages/mainpage.vue'),
    redirect: '/login',
    children: [
      RouterWelcome
    ]
  },
  RouterLogin,
  RouterLogout
]

let router = new Router({
  routes: baseRoute
})

export default router
