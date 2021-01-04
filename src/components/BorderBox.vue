<template>
  <div class="border-box" :style="style">
    <slot name="borderboxContent"></slot>
  </div>
</template>

<script>
export default {
  props: {
    padLR: {
      type: Number
    },
    padTB: {
      type: Number
    }
  },

  data () {
    return {
      paddingLR: 10,
      paddingTB: 8
    }
  },

  computed: {
    style () {
      let style = {}
      let LR = this.padLR?this.padLR:this.paddingLR
      let TB = this.padTB?this.padTB:this.paddingTB

      style.padding = TB + 'px ' + LR + 'px'
      return style
    }
  }
}
</script>


<style lang="scss">
.border-box{
  border-bottom: 1px solid #ebeef5
}
</style>
