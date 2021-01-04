<template>
  <div class="twoColumnLayout">
    <div>
      <side-bar :menus='menus'>
        <span slot='title' class="title">终端</span>
        <el-menu slot="component"
                 class="el-menu-vertical-demo"
                 :default-active="$route.path"
                 router>
          <el-menu-item :index="menu.path"
                        v-for='menu in menus'
                        :key='menu.name'>
            <i :class="menu.icon"></i>
            <span>{{ menu.name }}</span>
          </el-menu-item>
        </el-menu>
      </side-bar>
    </div>

    <router-view>
      <span slot="submenuName">终端列表</span>
    </router-view>
  </div>
</template>

<script>
import SideBar from '@/components/SideBar.vue'
import RouterView from '@/components/RouterView.vue'

export default {
  name: 'terminal',
  components: {
    SideBar, RouterView
  },
  data () {
    return {
      menus: [
        {name: '终端列表', icon: 'el-icon-tickets', path: '/terminal/list'}
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
  .twoColumnLayout {
    > div {
      &:nth-child(1) {
        float: right;
        > aside.submenu {
          border-right: 0;
          border-left: 1px solid #ddd;
        }
      }
      &:nth-child(2) {
        margin-left: 0;
        margin-right: 150px;
      }
    }
  }
</style>
