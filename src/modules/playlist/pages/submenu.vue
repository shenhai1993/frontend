<template>
  <aside class="submenu">
    <header>
      <span class="title">播出单</span>
    </header>
    <div>
      <el-menu class="el-menu-vertical-demo"  :default-active="$route.path" router>
        <el-menu-item :index="menu.path" v-for="menu in menus" :key="menu.path">
          <i :class="menu.icon"></i>
          <span>{{ menu.name }}</span>
        </el-menu-item>
      </el-menu>
    </div>
  </aside>
</template>

<script>
export default {
  data () {
    return {
      menus: [
        {name: '播出单', path: '/playlist/index/lists', icon: 'el-icon-circle-check-outline'},
        {name: '过期播出单', path: '/playlist/expired', icon: 'el-icon-remove-outline'}
      ]
    }
  }
}
</script>
