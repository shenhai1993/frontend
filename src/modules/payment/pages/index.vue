<template>
  <div class="oneColumnLayout" id="paymentPage">
    <router-view>
      <span slot="submenuName">支付管理</span>
    </router-view>
  </div>
</template>

<script>
import RouterView from '@/components/RouterView.vue'

export default {
  name: 'payment',
  components: {
    RouterView
  }
}
</script>
