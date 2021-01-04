<template>
  <div class="oneColumnLayout" id="content">
    <router-view>
      <span slot="submenuName">内容管理</span>
    </router-view>
  </div>
</template>

<script>
import RouterView from '@/components/RouterView.vue'
import {mapMutations} from "vuex"

export default {
  name: 'drugs',
  components: {
    RouterView
  },
  methods:{
  ...mapMutations([
      'CLEAR_SELECT_AUDIO', 'CLEAR_SELECT_BGIMG'
    ])
  },
  watch: {
    '$route' (to, from) {
      if (to.path==='/content/list'){
        this.CLEAR_SELECT_AUDIO()
        this.CLEAR_SELECT_BGIMG()
      }
    }
  }
}
</script>
