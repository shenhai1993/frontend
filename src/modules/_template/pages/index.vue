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
          <keep-alive>
          <el-menu
            class="el-menu-vertical-demo" :default-active="$route.path" router>
            <el-menu-item index="/template/list">
              <i class="el-icon-menu"></i>
              <span>我的模板</span>
            </el-menu-item>
            <el-menu-item index="/template/store">
              <i class="el-icon-sold-out"></i>
              <span>模板商城</span>
            </el-menu-item>
          </el-menu>
          </keep-alive>
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
}
</script>

<style lang='scss' scoped>
  .content {
    height: 100%;
  }
</style>
