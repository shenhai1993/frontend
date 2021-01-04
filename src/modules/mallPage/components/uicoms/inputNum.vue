<template>
  <div
    class="mall-inputnum"
    :class="{
      'mall-inputnum-width': miniWidth
    }">
    <el-button
      v-if="!miniWidth"
      class="mall-inputnum-minus"
      icon="el-icon-minus"
      @click.stop.prevent="inputNumChange('minus')"
      circle>
    </el-button>
    <span
      v-if="!miniWidth"
      class="mall-inputnum-value">
      {{addNum}}
    </span>
    <el-button
      class="mall-inputnum-plus"
      :class="{ 'mall-inputnum-plus-mini': miniWidth}"
      icon="el-icon-plus"
      @click.stop.prevent="inputNumChange('plus')"
      type="text"
      circle>
    </el-button>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  components: {

  },

  props: {
    min: {
      type: Number
    },

    max: {
      type: Number
    },

    item: {
      type: Object
    },

    idx: {
      type: Number
    },

    mId: {
      type: Number
    },

    miniWidth: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      addNum: 0,
      currData: this.item,
      index: this.idx
    }
  },

  computed: {
    ...mapState({
      shoppingCartData: state => state.mallPage.shoppingCartData
    })
  },

  created () {
    if (this.currData.num !== undefined) {
      this.addNum = parseInt(this.currData.num)
    }
  },

  methods: {
    inputNumChange (type) {
      if (type === 'minus') {
        if (this.addNum > this.min) {
          this.addNum--
        }
      } else if (type === 'plus') {
        if (this.addNum < this.max) {
          this.addNum++
        }
      }
      this.$emit('getNumber', { num: this.addNum, idx: this.index, mId: this.mId })
    }
  },

  watch: {
    shoppingCartData (v) {
      const data = JSON.parse(JSON.stringify(v))
      if (data[this.currData.cId] === undefined) {
        this.addNum = 0
      } else {
        this.addNum = parseInt(data[this.currData.cId].num)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .mall-inputnum {
    position: absolute;
    right: 5px;
    bottom: 5px;
    width: 6rem;
    height: 1.8rem;
    line-height: 1.8rem;
    font-size: 1.4rem;
    overflow: hidden;
    .mall-inputnum-minus, .mall-inputnum-value, .mall-inputnum-plus {
      position: absolute;
      top: 0px;
      left: 0px;
      width: 1.8rem;
      height: 1.8rem;
    }
    .mall-inputnum-value {
      left: 1.8rem;
      width: 2.4rem;
      text-align: center;
    }
    .mall-inputnum-plus {
      left: 4.2rem;
      color: #FFFFFF;
      background-color: #FF8F1F;
    }
    .mall-inputnum-plus-mini {
      left: 0px;
    }
  }
  .mall-inputnum-width {
    width: 1.8rem;
  }
</style>

<style lang="scss">
  .mall-inputnum {
    .el-button--medium.is-circle {
      padding: 0;
      font-size: 1.4rem;
    }
  }
</style>
