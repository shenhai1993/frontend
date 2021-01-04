<template>
  <div class="oneColumnLayout">
    <router-view>
      <span slot="submenuName">权限列表</span>
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
