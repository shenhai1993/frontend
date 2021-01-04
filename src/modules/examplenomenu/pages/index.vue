<template>
  <div class="oneColumnLayout">
    <router-view>
      <span slot="submenuName">终端列表</span>
    </router-view>
  </div>
</template>

<script>
import RouterView from '@/components/RouterView.vue'

export default {
  name: 'terminal',
  components: {
    RouterView
  }
}
</script>
