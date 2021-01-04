<template>
  <div class="mainpage threeColumnLayout" id="playlistTpl">
      <router-view>
          <!--<span slot="submenuName">播出单</span>-->
      </router-view>
  </div>
</template>

<script>
import SideBar from '@/components/SideBar.vue'
import RouterView from '@/components/RouterView.vue'
import Status from '@static/js/utils/status'

import { mapState } from 'vuex'

export default {
  components: {
    SideBar, RouterView
  },

  methods: {
  }
}
</script>

<style lang="scss">
  #playlistTpl {
    .parentConent {
      .templateContainer{
        padding: 0px;
      }
    }
  }
</style>
