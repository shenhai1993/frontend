<template>
  <div class="parentConent">
    <headerbar>
      <span slot='submenuName'>过期播出单</span>
    </headerbar>

    <div class="templateContainer">
      <lists></lists>
    </div>
  </div>
</template>

<script>
import headerbar from '@/components/HeaderBar'
import lists from '../playlist/lists'

export default {
  components: {
    headerbar, lists
  }
}
</script>
