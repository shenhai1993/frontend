<template>
  <div class="mainpage twoColumnLayout">
    <div>
      <side-bar>
        <span slot="title" class="title">系统设置</span>
        <el-menu slot="component" class="el-menu-vertical-demo"  :default-active="$route.path" router>
          <el-menu-item :index="menu.path" v-for="menu in menus" :key="menu.path">
            <i :class="menu.icon"></i>
            <span>{{ menu.name }}</span>
          </el-menu-item>
        </el-menu>  
      </side-bar>
    </div>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import SideBar from '@/components/SideBar.vue'

export default {
  components: {
    SideBar
  },

  data () {
    return {
      menus: [
        {name: '服务器', path: '/setting/server', icon: 'fa fa-server'},
        // {name: '天气预报', path: '/setting/weather', icon: 'fa fa-sun-o'},
        {name: '审核', path: '/setting/examine', icon: 'fa fa-check-square-o'},
        {name: '自动删除', path: '/setting/autoDelete', icon: 'el-icon-delete'},
        {name: '升级文件', path: '/setting/upgrade', icon: 'fa fa-level-up'},
        {name: '授权', path: '/setting/authorize', icon: 'fa fa-star'}
      ]
    }
  },

  mounted () { },
  methods: {}
}
</script>

<style scoped>
.el-menu-item [class^=fa] {
  margin-right: 5px;
  width: 24px;
  text-align: center;
  font-size: 18px;
  vertical-align: middle;
}
</style>
