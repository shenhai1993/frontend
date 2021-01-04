<template>
  <div class="oneColumnLayout">
    <router-view>
      <span slot="submenuName">角色管理</span>
    </router-view>
  </div>
</template>

<script>
import RouterView from '@/components/RouterView.vue'

export default {
  name: 'role',
  components: {
    RouterView
  }
}
</script>
