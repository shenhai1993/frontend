<template>
  <div class="oneColumnLayout" id="attributePage">
    <router-view>
      <span slot="submenuName">菜品属性</span>
    </router-view>
  </div>
</template>

<script>
import RouterView from '@/components/RouterView.vue'

export default {
  name: 'attribute',
  components: {
    RouterView
  }
}
</script>
