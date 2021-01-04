import Vue from 'vue'
import Router from 'vue-router'
import MainPage from '@/pages/mainpage.vue'

import RouterWelcome from '@/modules/welcome/router/default'
import RouterLogin from '@/modules/login/router/default'
import RouterLogout from '@/modules/logout/router/default'
import RouterTerminal from '@/modules/terminal/router/index'
import RouterRole from '@/modules/role/router'
import RouterUser from '@/modules/user/router'
import RouterElement from '@/modules/element/router'
import RouterTemplate from '@/modules/template/router'
import RouterMpdp from '@/modules/mpdp/router/'
// import RouterPlaylist from '@/modules/playlist/router/'
import RouterPlaylistMutipleTPL from '@/modules/playlistMutipleTPL/router/'
import RouterMarquee from '@/modules/marquee/router/'
// import RouterPlaybill from '@/modules/playbill/router/'
// import RouterServer from '@/modules/server/router/'
// import RouterVod from '@/modules/vod/router/'
import RouterSetting from '@/modules/setting/router/'
import RouterExamine from '@/modules/examine/router/'
import RouterLicense from '@/modules/license/router/default'
import RouterLogs from '@/modules/log/router/'
import RouterStatistics from '@/modules/terminalStatistics/router/'

import RouterTpl from '@/modules/tpl/router/'
// import RouterFiles from '@/modules/files/router/'
import RouterManage from '@/modules/terminal/router/manage'
import RouterCustomMade from '@/modules/customMade/router/index'
/** example layout */
// import RouterExample from '@/modules/example/router'
import RouterDrug from '@/modules/drug/router'
import RouterDrugs from '@/modules/drugs/router'
import RouterWeather from '@/modules/weather/router'
import RouterPermission from '@/modules/permission/router'
import RouterTag from '@/modules/tag/router'
import RouterProduct from '@/modules/product/router'
import RouterCategory from '@/modules/category/router'
import RouterPacket from '@/modules/packet/router'
import RouterAttribute from '@/modules/attribute/router'
import RouterPayment from '@/modules/payment/router'
import RouterTerminaltemp from '@/modules/terminaltemp/router'
import RouterMallPage from '@/modules/mallPage/router'
import RouterOrdering from '@/modules/ordering/router'

Vue.use(Router)

// const originalPush = Router.prototype.push
// Router.prototype.push = function push (location) {
//   return originalPush.call(this, location).catch(err => err)
// }
export default new Router({
  routes: [
    {
      path: '/',
      component: MainPage,
      redirect: '/login',
      children: [
        RouterWelcome,
        RouterTerminal,
        RouterRole,
        RouterUser,
        RouterElement,
        // RouterPlaylist,
        RouterTemplate,
        RouterMpdp,
        RouterMarquee,
        RouterPlaylistMutipleTPL,
        // RouterPlaybill,
        // RouterServer,
        // RouterVod,
        RouterTpl,
        // RouterFiles,
        RouterSetting,
        RouterExamine,
        RouterManage,
        RouterLogs,
        RouterStatistics,
        // RouterExample,
        RouterDrug,
        RouterDrugs,
        RouterWeather,
        RouterCustomMade,
        RouterPermission,
        RouterTag,
        RouterProduct,
        RouterCategory,
        RouterPacket,
        RouterAttribute,
        RouterPayment,
        RouterTerminaltemp,
        RouterOrdering
      ]
    },
    RouterLogin,
    RouterLogout,
    RouterLicense,
    RouterMallPage
  ]
})
