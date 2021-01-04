<template>
  <div class="oneColumnLayout" id="categoryPage">
    <router-view>
      <span slot="submenuName">菜品分类</span>
    </router-view>
  </div>
</template>

<script>
import RouterView from '@/components/RouterView.vue'

export default {
  name: 'category',
  components: {
    RouterView
  }
}
</script>
