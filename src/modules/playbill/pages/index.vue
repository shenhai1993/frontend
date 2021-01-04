<template>
  <div class="twoColumnLayout">
    <div>
      <resizable-two-row></resizable-two-row>
    </div>

    <router-view>
      <span slot="submenuName">节目排单管理</span>
    </router-view>
  </div>
</template>

<script>
import ResizableTwoRow from '@/components/ResizableTwoRow.vue'
import RouterView from '@/components/RouterView.vue'

export default {
  name: 'playbill',
  components: {
    ResizableTwoRow, RouterView
  },
  data () {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
  .twoColumnLayout {
    > div {
      &:nth-child(1) {
        float: right;
        > aside.submenu {
          border-right: 0;
          border-left: 1px solid #ddd;
        }
      }
      &:nth-child(2) {
        margin-left: 0;
        margin-right: 150px;
      }
    }
  }
</style>
