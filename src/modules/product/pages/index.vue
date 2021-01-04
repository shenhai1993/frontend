<template>
  <div class="oneColumnLayout" id="productPage">
    <router-view>
      <span slot="submenuName">菜品管理</span>
    </router-view>
  </div>
</template>

<script>
import RouterView from '@/components/RouterView.vue'

export default {
  name: 'product',
  components: {
    RouterView
  }
}
</script>
