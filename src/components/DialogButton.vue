<template>
  <div class="btn-container">
    <slot name="buttons">
      <el-button @click="cancel">{{cancelText}}</el-button>
      <el-button type="primary" @click="confirm">{{confirmText}}</el-button>
    </slot>
  </div>
</template>

<script>
export default {
  props: {
    confirmText: {
      type: String,
      default: '确定'
    },
    cancelText: {
      type: String,
      default: '取消'
    }
  },

  methods: {
    cancel () {
      this.$emit('clickCancel')
    },

    confirm () {
      this.$emit('clickConfirm')
    }
  }
}
</script>
