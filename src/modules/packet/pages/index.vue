<template>
  <div class="oneColumnLayout" id="packetPage">
    <router-view>
      <span slot="submenuName">套餐管理</span>
    </router-view>
  </div>
</template>

<script>
import RouterView from '@/components/RouterView.vue'

export default {
  name: 'packet',
  components: {
    RouterView
  }
}
</script>
