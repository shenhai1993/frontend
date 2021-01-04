<template>
  <div class="parentConent">
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

<style lang="scss">
.el-input {
  width: 200px;
}
.templateContainer {
  padding: 0!important;
  overflow-y: inherit;
}
</style>
