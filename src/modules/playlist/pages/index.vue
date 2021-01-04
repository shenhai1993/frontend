<template>
  <div class="mainpage twoColumnLayout">
    <div>
      <submenu></submenu>
    </div>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import submenu from './submenu.vue'

export default {
  components: {
    submenu
  }
}
</script>
