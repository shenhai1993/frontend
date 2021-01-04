<template>
  <div class="oneColumnLayout">
    <router-view>
      <span slot="submenuName">点播管理</span>
    </router-view>
  </div>
</template>

<script>
import RouterView from '@/components/RouterView.vue'
import { mapActions } from 'vuex'

export default {
  name: 'vod',
  components: {
    RouterView
  }
}
</script>
