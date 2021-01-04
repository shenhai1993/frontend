<!--
author: wangwei(w.w@tcl.com)  2017-10-16
-->
<template>
  <div class="mainpage twoColumnLayout">
    <div>
      <aside class="submenu">
      <header>
        <span class="title">模板</span>
      </header>
      <div>
        <el-menu
          class="el-menu-vertical-demo" @select="selected"
          :default-active="curr_active">
          <el-menu-item index="templatelist">
            <i class="el-icon-menu"></i>
            <span>模板列表</span>
          </el-menu-item>
          <el-menu-item index="templateedit1">
            <i class="el-icon-edit"></i>
            <span>模板制作</span>
          </el-menu-item>
        </el-menu>
      </div>
    </aside>
    </div>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      curr_active: '/template/list'
    }
  },
  mounted () {
    let me = this
    this.setActive(this.$route.name)
    this.$router.afterEach((to, from) => {
      me.setActive(to.name)
    })
  },
  methods: {
    setActive (name) {
      if (name === 'templateedit') {
        this.curr_active = 'templateedit1'
      } else {
        this.curr_active = name
      }
    },
    selected (index, indexPath) {
      if (this.$route.name === index) {
      } else if (index.indexOf(this.$route.name) === -1) {
        this.$router.push({name: index})
      } else {
      }
    }
  }
}
</script>
