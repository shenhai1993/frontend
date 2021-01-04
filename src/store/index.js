import Vue from 'vue'
import Vuex from 'vuex'

import element from '@/modules/element/store/'
import template from '@/modules/template/store/'
import scene from '@/modules/scene/store/'
import mpdp from '@/modules/mpdp/store/'
import playlist from '@/modules/playlist/store/'
import playlistMutipleTPL from '@/modules/playlistMutipleTPL/store/'
import terminals from '@/modules/terminal/store/'
import role from '@/modules/role/store/'
import user from '@/modules/user/store/'
import marquee from '@/modules/marquee/store/'
import playbill from '@/modules/playbill/store/'
import vod from '@/modules/vod/store'
import setting from '@/modules/setting/store'
import examine from '@/modules/examine/store'
import license from '@/modules/license/store'
import log from '@/modules/log/store'
import weather from '@/modules/weather/store'
import terminalStatistics from '@/modules/terminalStatistics/store'
import permission from '@/modules/permission/store'
import customMade from '@/modules/customMade/store'
// import files from '@/modules/files/store'
import drug from '@/modules/drug/store'
import drugs from '@/modules/drugs/store'
import tag from '@/modules/tag/store'
import product from '@/modules/product/store'
import category from '@/modules/category/store'
import packet from '@/modules/packet/store'
import attribute from '@/modules/attribute/store'
import payment from '@/modules/payment/store'
import terminaltemp from '@/modules/terminaltemp/store'
import mallPage from '@/modules/mallPage/store'
import ordering from '@/modules/ordering/store'

Vue.use(Vuex)
Vue.config.debug = true

const debug = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
  modules: {
    element,
    template,
    scene,
    mpdp,
    terminals,
    role,
    user,
    marquee,
    playbill,
    playlistMutipleTPL,
    vod,
    setting,
    examine,
    license,
    playlist,
    permission,
    log,
    drug,
    drugs,
    weather,
    terminalStatistics,
    customMade,
    tag,
    product,
    category,
    packet,
    attribute,
    payment,
    terminaltemp,
    mallPage,
    ordering
  },
  strict: debug,
  state: {
    originState: {}
  },
  mutations: {
    RESET (state, originState) {
      state = Object.assign(state, originState)
      let _originState = JSON.stringify(originState)
      state.originState = JSON.parse(_originState)
    },
    SET_ORIGIN (state, originState) {
      state.originState = originState
    }
  }
})

export default store
