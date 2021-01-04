<template>
  <div class="oneColumnLayout">
    <router-view>
      <span slot="submenuName">操作日志</span>
    </router-view>
  </div>
</template>

<script>
import RouterView from '@/components/RouterView.vue'

export default {
  name: 'logs',
  components: {
    RouterView
  }
}
</script>
