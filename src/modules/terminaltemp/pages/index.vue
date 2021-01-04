<template>
  <div class="terminaltemp-index" id="terminaltempPage">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'terminaltemps',
  beforeDestroy () {
    sessionStorage.removeItem('terminaltemp_productListData')
    sessionStorage.removeItem('terminaltemp_packetListData')
  }
}
</script>

<style lang="scss" scoped>
  @import '../static/css/terminaltemp.scss';
</style>
