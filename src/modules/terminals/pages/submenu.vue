<template>
  <aside class="submenu">
    <header>
      <span class="title">
        终端
      </span>
    </header>
    <div>
      <el-menu class="el-menu-vertical-demo"
                :default-active="$route.path"
                router>
        <el-menu-item :index="menu.path"
                      v-for='menu in menus'
                      :key='menu.name'>
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
          // {name: '总览', icon: 'el-icon-info', path: '/terminal/index'},
          {name: '终端列表', icon: 'el-icon-tickets', path: '/terminal/list'}
          // {name: '未分组终端', icon: 'el-icon-more', path: 'ungroup'},
          // {name: '分组管理', icon: 'el-icon-menu', path: 'group'}
        ]
      }
    }
  }
</script>
