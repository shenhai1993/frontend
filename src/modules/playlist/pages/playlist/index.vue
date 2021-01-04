<template>
  <div class="parentConent">
    <headerbar>
      <span slot='submenuName'>播出单</span>
    </headerbar>
    <section class="templateContainer">
      <router-view></router-view>
    </section>
  </div>
</template>

<script>
import headerbar from '@/components/HeaderBar'

export default {
  components: {
    headerbar
  }
}
</script>

<style lang="scss" scoped>
.parentConent{
  .el-input {
    width: 200px;
  }
  .templateContainer {
    overflow-y: inherit;
  }
}
</style>
