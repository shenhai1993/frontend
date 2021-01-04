// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import 'element-ui/lib/theme-chalk/index.css'
import './icon'
import router from './router/index'
import store from './store'
import element from 'element-ui'
import VueMoment from 'vue-moment'
import 'moment/locale/zh-cn'
import VueCookie from 'vue-cookies'
import { sync } from 'vuex-router-sync'

import '../node_modules/font-awesome/css/font-awesome.min.css'

import auth from '../static/js/api/auth'
import http from '../static/js/utils/http'

import MyPlugin from '@/plugin/MyPlugin'

import * as filters from './assets/js/filters'

import BebelPolyfill from 'babel-polyfill'

if (process.env.NODE_ENV === 'development') {
  require('element-ui/lib/theme-chalk/index.css')
  require('jquery-ui/themes/base/resizable.css')
}

Vue.use(element, {size: 'medium'})
Vue.use(VueCookie)
Vue.use(VueMoment)
Vue.use(MyPlugin)
Vue.config.productionTip = false

sync(store, router)

// filters
Vue.filter('fromnow', filters.fromNow)
Vue.filter('filesize', filters.fileSize)
Vue.filter('macstyle', filters.MACStyle)
Vue.filter('network', filters.network)
Vue.filter('direction', filters.screenDirection)
Vue.use(BebelPolyfill)

http.setOptions({
  cb: function (options) {
    if (!options.auth) {
      return element.MessageBox({
        type: 'warning',
        title: '未登录',
        center: false,
        message: '您尚未登录或超过2小时未进行操作，请您重新登录！',
        callback: () => { router.push({ path: '/logout' }) }, // improve me
        closeOnHashChange: false,
        closeOnClickModal: false,
        closeOnPressEscape: false
      })
    }

    return element.Notification({
      title: options.title,
      type: options.type,
      message: options.message
    })
  }
})

window.log = console.log

// router 全局守卫
router.beforeEach(auth)
/* eslint-disable no-new */
export default {
  fn () {
    new Vue({
      el: '#app',
      router,
      store,
      components: { App },
      template: '<App/>'
    })
  }
}
