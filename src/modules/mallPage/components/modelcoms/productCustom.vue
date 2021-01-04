<template>
  <div
    class="product-custom"
    :name="tagname"
    :style="{
      height: modelData.height + 'px',
      marginTop: modelData.top + 'px',
      marginBottom: modelData.top + 'px'
    }">
    <div
      v-for="(product, index) in productData"
      :key="product.key"
      :style="{
        width: product.width + 'px',
        height: product.height + 'px',
        top: product.top + 'px',
        left: product.left + 'px'
      }">
      <component
        :is="product.type"
        :modelIndex="modelIndex"
        :itemData="product"
        @getShop="getShop"
        @getAttr="getAttr">
      </component>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { mallPage } from '../../static/js/mallPage.js'

export default {
  components: {
    ProductLeft: () => import ('./productLeft.vue'),
    ProductTop: () => import ('./productTop.vue')
  },

  props: {
    modelIndex: {
      type: Number
    },

    comData: {
      type: Object
    },

    tagname: {
      type: String
    }
  },

  data () {
    return {
      modelData: {},
      productData: []
    }
  },

  computed: {
    ...mapState({
      simsResetWH: state => state.mallPage.simsResetWH,
      baseWH: state => state.mallPage.baseWH,
      shoppingCartData: state => state.mallPage.shoppingCartData
    })
  },

  created () {
    this.initData()
  },

  methods: {
    initData () {
      let data = JSON.parse(JSON.stringify(this.comData))
      let itemData = JSON.parse(data.comData)
      itemData.id = data.id

      const oldSimsWH = [parseFloat(this.baseWH[0]), parseFloat(this.baseWH[1])]
      const newSimsWH = [parseFloat(this.simsResetWH[0]), parseFloat(this.simsResetWH[1])]
      itemData.height = mallPage.getNewH(itemData.height, oldSimsWH, newSimsWH)
      itemData.top = mallPage.getNewH(itemData.top, oldSimsWH, newSimsWH)
      itemData.width = mallPage.getNewW(itemData.width, oldSimsWH, newSimsWH)
      itemData.leftlength = mallPage.getNewW(itemData.leftlength, oldSimsWH, newSimsWH)

      this.modelData = itemData
      this.productData = this.modelData.comData
      for (let i = 0; i < this.productData.length; i++) {
        this.productData[i].width = mallPage.getNewW(this.productData[i].width, oldSimsWH, newSimsWH)
        this.productData[i].height = mallPage.getNewH(this.productData[i].height, oldSimsWH, newSimsWH)
        this.productData[i].top = mallPage.getNewH(this.productData[i].top, oldSimsWH, newSimsWH)
        this.productData[i].left = mallPage.getNewW(this.productData[i].left, oldSimsWH, newSimsWH)
      }
    },

    getShop (data) {
      this.$emit('getShopData', data)
    },

    getAttr (data) {
      this.$emit('getAttrData', data)
    }
  }
}
</script>

<style lang="scss" scoped>
  .product-custom {
    position: relative;
    width: 100%;
    overflow: hidden;
    > div {
      position: absolute;
    }
  }
</style>
