<template>
  <div class="oneColumnLayout">
    <router-view>
      <span slot="submenuName">药品管理</span>
    </router-view>
  </div>
</template>

<script>
import RouterView from '@/components/RouterView.vue'

export default {
  name: 'drug',
  components: {
    RouterView
  }
}
</script>
