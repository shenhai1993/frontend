<template>
  <div class="stepsList-height">
    <el-steps :active="active" process-status="success" simple>
      <el-step title="选择商品" @click.native="changeActive(0)"></el-step>
      <el-step title="添加内容" @click.native="changeActive(1)"></el-step>
    </el-steps>
    <product-table
      v-show="active == 0"
      @productEmit="productEmit">
    </product-table>
    <bute-table
      v-show="active == 1"
      :comData="comData"
      :active="active"
      :currData="currProduct"
      @buteEmit="buteEmit">
    </bute-table>
  </div>
</template>

<script>
import ProductTable from './productTable.vue'
import ButeTable from './buteTable.vue'

export default {
  components: {
    ProductTable,
    ButeTable
  },

  props: {
    comData: {
      type: Object
    }
  },

  data () {
    return {
      active: 0,
      currProduct: {}
    }
  },

  mounted () {

  },

  methods: {
    changeActive (v) {
      this.active = v
    },

    productEmit (v) {
      this.currProduct = JSON.parse(JSON.stringify(v))
      this.changeActive(1)
      const data = {
        id: this.currProduct.id,
        category_id: this.currProduct.category_id,
        cname: this.currProduct.cname
      }
      this.$emit('stepsIdEmit', data)
    },

    buteEmit (v) {
      this.$emit('stepsEmit', v)
    }
  }
}
</script>

<style lang="scss" scoped>
  .stepsList-height{
    height: 100%;
    overflow: hidden;
  }
  .el-step {
    cursor: pointer;
  }
</style>
