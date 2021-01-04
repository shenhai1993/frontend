<template>
  <div class="oneColumnLayout" id="orderingPage">
    <router-view>
      <span slot="submenuName">订单管理</span>
    </router-view>
  </div>
</template>

<script>
import RouterView from '@/components/RouterView.vue'

export default {
  name: 'ordering',
  components: {
    RouterView
  }
}
</script>
