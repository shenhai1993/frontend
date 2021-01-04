<template>
  <div class="content" v-bind:style="mapStyle">
    <el-progress :text-inside="true" :show-text="true" :stroke-width="12" :percentage="percentage" status="success"></el-progress>
    <div class="remaining-space">
      <span>{{ oneSize }}</span>/
      <span>{{ allSize }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'filesize',
  props: {
    width: {
      type: Number,
      default: 200
    },
    allSize: {
      type: String
    },
    oneSize: {
      type: String
    },
    percentage: {
      type: Number,
      default: 0
    }
  },
  components: {},
  data () {
    return {
      mapStyle:  {
        width: this.width + 'px'
        // position: 'absolute',
        // left: 0,
        // bottom: 10
      }
    }
  }
}
</script>

<style scoped>
.content {
  margin: 0 auto;
}
.remaining-space {
  font-size: 14px;
  margin: 5px 0 10px;
}
</style>
