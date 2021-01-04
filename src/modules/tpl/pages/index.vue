<template>
  <div class="twoColumnLayout">
    <div>
      <side-bar :ischangeLayout='true'>
        <span slot='title' class="title">服务器管理</span>
        <sub-menu slot="component" :menu="menu" :defaultActive="defaultMenu"></sub-menu>
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

export default {
  components: {
    SideBar, RouterView, SubMenu
  },

  data () {
    return {
      title: '模板',
      menu: [
        { title: '模板列表', icon: 'el-icon-menu', index: '/tpl/list' },
        { title: '模板制作', icon: 'el-icon-edit', index: '/tpl/editor' }
      ]
    }
  },

  computed: {
    defaultMenu: function () {
      return this.$route.path.replace(/\/\d*$/, '')
    }
  }
}
</script>
