<template>
  <div class="oneColumnLayout">
    <router-view>
      <span slot="submenuName">标签管理</span>
    </router-view>
  </div>
</template>

<script>
import RouterView from '@/components/RouterView.vue'

export default {
  name: 'tag',
  components: {
    RouterView
  }
}
</script>
