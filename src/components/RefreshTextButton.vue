<template>
<!--    <el-button :size="size" @click="refresh" plain>-->
<!--      <i class="fa fa-refresh"></i>-->
<!--    </el-button>-->
  <el-button type="text" @click="refresh" ><i class="fa fa-refresh"></i> 刷新</el-button>
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
