<template>
  <div
    class="card product-card"
    :data-id="comData.id"
    :style="{
      width: componentData.width + 'px',
      height: componentData.height + 'px',
      top: componentData.top + 'px',
      left: componentData.leftlength + 'px'
    }">
    <div
      v-for="(item, index) in attrData"
      :key="item.tname"
      :style="{
        top: item.top + 'px',
        left: item.left + 'px',
        width: item.width + 'px',
        height: item.height + 'px',
        color: item.color,
        fontSize: item.size + 'px',
        fontWeight: item.weight
      }">
      <el-image v-if="item.type == 'image'" :src="item.val">
        <div slot="error" style="text-align: center;">图片</div>
      </el-image>
      <div v-else-if="item.type == 'text'">{{item.val}}</div>
    </div>
    <input-num
      :min="0"
      :max="100"
      :item="cartData"
      @getNumber="getNumber">
    </input-num>
  </div>
</template>

<script>
import { mallPage } from '../../static/js/mallPage.js'
import { mapState, mapMutations, mapActions } from 'vuex'
import InputNum from '../uicoms/inputNum.vue'

export default {
  components: {
    InputNum
  },

  props: {
    comData: {
      type: Object
    }
  },

  data () {
    return {
      componentData: {},
      attrData: [],
      cartData: {}
    }
  },

  computed: {
    ...mapState({
      simsResetWH: state => state.mallPage.simsResetWH
    })
  },

  created () {
    this.initData()
  },

  mounted() {

  },

  methods: {
    initData () {
      const newSimsWH = [parseFloat(this.simsResetWH[0]), parseFloat(this.simsResetWH[1])]
      let data = JSON.parse(JSON.stringify(this.comData))
      data = data.item_data
      const oldSimsWH = data.simsWH
      data.width = mallPage.getNewW(data.width, oldSimsWH, newSimsWH)
      data.leftlength = mallPage.getNewW(data.leftlength, oldSimsWH, newSimsWH)
      data.height = mallPage.getNewH(data.height, oldSimsWH, newSimsWH)
      data.top = mallPage.getNewH(data.top, oldSimsWH, newSimsWH)
      for (let i = 0; i < data.comData[0].attr.length; i++) {
        const width = data.comData[0].attr[i].width
        const left = data.comData[0].attr[i].left
        const height = data.comData[0].attr[i].height
        const top = data.comData[0].attr[i].top
        if (width !== undefined) {
          data.comData[0].attr[i].width = mallPage.getNewW(width, oldSimsWH, newSimsWH)
        }
        if (height !== undefined) {
          data.comData[0].attr[i].height = mallPage.getNewH(height, oldSimsWH, newSimsWH)
        }
        data.comData[0].attr[i].left = mallPage.getNewW(left, oldSimsWH, newSimsWH)
        data.comData[0].attr[i].top = mallPage.getNewH(top, oldSimsWH, newSimsWH)
      }
      this.componentData = data
      this.attrData = data.comData[0].attr
      this.cartData = Object.assign({}, this.cartData, { cId: data.comData[0].id + '-0' })
    },

    getNumber (v) {
      const id = this.componentData.comData[0].id
      let val = ''
      let buy_price = 0
      let sell_price = -1
      let spec = '标准'
      for (let i = 0; i < this.attrData.length; i++) {
        if (this.attrData[i].tname == 'name') {
          val = this.attrData[i].val
        }
        if (this.attrData[i].tname == 'buy_price') {
          buy_price = this.attrData[i].val
          buy_price = buy_price.replace('元', '')
          buy_price = parseFloat(buy_price)
        }
        if (this.attrData[i].tname == 'sell_price') {
          sell_price = this.attrData[i].val
          sell_price = sell_price.replace('元', '')
          sell_price = parseFloat(sell_price)
        }
        if (this.attrData[i].tname == 'spec') {
          spec = this.attrData[i].val
        }
      }
      const data = {
        id: id,
        cId: id + '-0',
        num: v,
        val: val,
        buy_price: buy_price,
        sell_price: sell_price > -1 ? sell_price : buy_price,
        spec: spec
      }
      this.$emit('getShopData', data)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../static/css/mallPage.scss';

  .product-card {
    .el-image {
      border-radius: 4px;
    }
  }
</style>
