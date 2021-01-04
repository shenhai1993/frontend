<template>
  <div class="twoColumnLayout"
       v-loading="isrefresh"
       element-loading-background="rgba(0, 0, 0, 0.3)">
    <div>
      <side-bar :ischangeLayout='true'>
        <span slot='title' class="title">拼接屏</span>
        <sub-menu @clickMenu="clickMenu" slot="component" :menu="menus" :default-active="$route.path"></sub-menu>
      </side-bar>
    </div>
    <router-view>
      <span slot="submenuName">{{activeMenuTitle}}</span>
    </router-view>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SideBar from '@/components/SideBar.vue'
import SubMenu from '@/components/SubMenu.vue'
import RouterView from '@/components/RouterView'

export default {
  name: 'terminal',
  components: {
    SubMenu, SideBar, RouterView
  },
  computed: {
    ...mapState({
      isrefresh: false // state => state.terminal.isrefresh
    })
  },
  data () {
    return {
       menus: [
        {title: '拼接终端', icon: 'fa fa-minus-circle', index: '/mpdp/ungrouped'},
        {title: '拼接屏', icon: 'el-icon-tickets', index: '/mpdp/virtual'},
        {title: '场景制作', icon: 'el-icon-edit', index: '/mpdp/scene/create'},
        {title: '拼接场景', icon: 'el-icon-menu', index: '/mpdp/scene/list'},
        {title: '播出单', icon: 'fa fa-newspaper-o', index: '/mpdp/playlist/lists'}
      ],
      activeMenuTitle: '拼接终端'
    }
  },

  methods: {
    clickMenu (index) {
      let _tmp = this.menus.filter(menu => {
        return menu.index === index
      })
      this.activeMenuTitle = _tmp[0].title
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
