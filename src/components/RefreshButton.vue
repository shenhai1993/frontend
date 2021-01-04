<template>
  <el-tooltip class="item" effect="dark" content="刷新" placement="bottom">
    <el-button :size="size" @click="refresh" plain>
      <i class="fa fa-refresh"></i>
    </el-button>
  </el-tooltip>
</template>

<script>
export default {
  props: {
    size: {
      type: String,
      default: ''
    }
  },

  methods: {
    refresh () {
      this.$emit('refresh')
    }
  }
}
</script>

<style scoped>
/* file car style */
.time {
  font-size: 13px;
  color: #999;
}
</style>
