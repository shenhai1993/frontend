<template>
  <div class="mainpage twoColumnLayout" 
       v-loading="isrefresh"
       element-loading-background="rgba(0, 0, 0, 0.3)">
    <div>
      <submenu></submenu>
    </div>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import submenu from './submenu.vue'

export default {
  name: 'terminal',
  components: {
    submenu
  },
  computed: {
    ...mapState({
      isrefresh: state => state.terminal.isrefresh
    })
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
  .twoColumnLayout {
    > div {
      &:nth-child(2) {
        position: relative;
      }
    }
  }
</style>

