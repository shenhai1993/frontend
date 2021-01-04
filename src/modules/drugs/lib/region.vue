<template>
  <div class="region-content">
    <div @click="selectRegion(region)"  class="region" :style="regionStyle">
      <div class="region-type" :style="typeStyle" v-if="region.type !=='text'">{{ region.type }}</div>
      <slot name="view"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    region: {
      type: Object
    },

    rate: {
      type: Number,
      default: 1
    },

    index: {
      type: Number
    }
  },

  computed: {
    regionStyle () {
      let style = {}
      let r = this.region
      let rate = this.rate
      style.width = r.width * rate + 'px'
      style.height = r.height * rate < 25 ? '25px' : r.height * rate + 'px'
      style.position = 'absolute'
      style.left = r.x * rate + 'px'
      style.top = r.y * rate + 'px'
      style.backgroundColor = r.background
      return style
    },

    typeStyle () {
      let style = {}
      let r = this.region
      style.color = r.color
      return style
    }
  },

  methods: {
    selectRegion (region) {
      if (region.type === 'date' || region.type === 'time') {
        return
      }
      this.$emit('setActiveRegion', region)
    }
  }
}
</script>

<style lang="scss">
.region-content{
  position: relative;
  .region {
    overflow: hidden;
    font-family: '宋体';
    font-size: 15px;
  }
  .region-type {
    position: absolute;
    width: 100%;
    text-align: center;
    font-size: 16px;
    cursor: pointer;
  }
}
</style>
