<template>
  <div class="twoColumnLayout">
    <div>
      <side-bar :ischangeLayout='true'>
        <span slot='title' class="title">服务器管理</span>
        <sub-menu slot="component" :menu="menu" :defaultActive="type"></sub-menu>
      </side-bar>
    </div>

    <router-view>
      <span slot="submenuName">{{ title }}</span>
    </router-view>
  </div>
</template>

<script>
// global components
import SideBar from '@/components/SideBar.vue'
import SubMenu from '@/components/SubMenu.vue'
import RouterView from '@/components/RouterView.vue'

import { mapState } from 'vuex'

export default {
  components: {
    SideBar, RouterView, SubMenu
  },

  data () {
    return {
      title: '所有',
      menu: [
        { title: '所有', icon: 'el-icon-menu', index: 'all' },
        { title: '中心服务器', icon: 'el-icon-picture', index: 'center' },
        { title: '媒体服务器', icon: 'el-icon-view', index: 'media' },
        { title: '推流服务器', icon: 'el-icon-upload', index: 'stream' }
      ]
    }
  },

  computed: {
    ...mapState({
      type: state => state.route.params.type
    })
  }
}
</script>
