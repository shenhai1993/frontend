<template>
  <div
    class="product-top"
    :style="{
      fontSize: currCustomData.size / 10 + 'rem',
      color: currCustomData.color
    }">
    <div class="product-top-img"><el-image v-if="productItem.img_url" :src="productItem.img_url" alt="图片" :preview-src-list="[productItem.img_url]"></el-image><div v-if="productItem.stock" class="product-top-stock" :style="{ fontSize: (currCustomData.size - 2) / 10 + 'rem' }">剩余：{{productItem.stock}}</div></div>
    <div class="product-top-text">
      <div class="product-top-name">{{productItem.name}}</div>
      <div v-if="productItem.spec" class="product-top-name" :style="{ fontSize: (currCustomData.size - 2) / 10 + 'rem' }">{{'（' + productItem.spec + '）'}}</div>
      <div v-if="productItem.sell_price"><span style="font-size: 1rem;">￥</span>{{productItem.sell_price}}&nbsp;&nbsp;<span style="text-decoration: line-through;" :style="{ fontSize: (currCustomData.size - 2) / 10 + 'rem' }">{{productItem.buy_price}}</span></div>
      <div v-else-if="productItem.buy_price"><span style="font-size: 1rem;">￥</span>{{productItem.buy_price}}</div>
    </div>
    <input-num
      v-if="productItem.attributes == ''"
      :min="0"
      :max="100"
      :idx="currCustomData.key"
      :mId="modelIndex"
      :item="newCartData"
      :miniWidth="true"
      @getNumber="getNumber">
    </input-num>
    <div
      v-else
      class="select-attr-btn el-icon-more-outline"
      @click="selectAttr">
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import InputNum from '../uicoms/inputNum.vue'

export default {
  components: {
    InputNum
  },

  props: {
    modelIndex: {
      type: Number
    },

    itemData: {
      type: Object
    }
  },

  data () {
    return {
      currCustomData: {},
      productItem: {},
      newCartData: {}
    }
  },

  computed: {
    ...mapState({
      shoppingCartData: state => state.mallPage.shoppingCartData,
      updateStockData: state => state.mallPage.updateStockData
    })
  },

  mounted () {
    this.initData(this.itemData)
    this.getStock(this.updateStockData)
  },

  methods: {
    initData (v) {
      this.currCustomData = JSON.parse(JSON.stringify(v))
      const data = JSON.parse(JSON.stringify(v))
      const attr = data.attr
      this.productItem = {}
      for (let i = 0; i < attr.length; i++) {
        let newData = {}
        newData[attr[i].tname] = attr[i].val
        this.productItem = Object.assign({}, this.productItem, newData)
      }
      const productId = data.id + (data.packet_id > 0 ? 'p' : '') + '-0'
      let d = {
        cId: productId
      }
      if (this.shoppingCartData[productId] !== undefined) {
        d.num = this.shoppingCartData[productId].num
      }
      this.newCartData = Object.assign({}, this.newCartData, d)
    },

    getStock (v) {
      if (!this.productItem.stock) {
        return
      }
      if (v[this.itemData.id]) {
        this.productItem = Object.assign({}, this.productItem, { stock: v[this.itemData.id] })
      }
    },

    getNumber (v) {
      const res = JSON.parse(JSON.stringify(v))
      if (res.mId != this.modelIndex) {
        return
      }
      const data = JSON.parse(JSON.stringify(this.currCustomData))
      const attr = data.attr
      const id = data.id
      let shopData = {
        id: id,
        packet_id: data.packet_id,
        cId: id + (data.packet_id > 0 ? 'p' : '') + '-0',
        num: res.num,
        category_id: data.category_id,
        cname: data.cname
      }
      for (let i = 0; i < attr.length; i++) {
        shopData[attr[i].tname] = attr[i].val
      }
      this.$emit('getShop', shopData)
    },

    selectAttr () {
      this.$emit('getAttr', this.currCustomData)
    }
  },

  watch: {
    updateStockData (v) {
      this.getStock(v)
    }
  }
}
</script>

<style lang="scss">
  .product-top {
    .el-image-viewer__close {
      width: 3rem;
      height: 3rem;
      top: 15rem;
      font-size: 3rem;
      color: #FFFFFF;
    }
  }
</style>
<style lang="scss" scoped>
  .product-top {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0px;
    top: 0px;
    border-radius: 0.625rem;
    background-color: #FFFFFF;
    overflow: hidden;
    .product-top-img {
      position: relative;
      float: left;
      width: 39.13%;
      height: 100%;
      .el-image {
        display: block;
        width: 100%;
        height: 100%;
      }
      .product-top-stock {
        position: absolute;
        right: 5px;
        bottom: 5px;
        padding: 0 5px;
        border-radius: 0.625rem;
        background-color: #EBEEF5AD;
      }
    }
    .product-top-text {
      float: right;
      width: 60%;
      height: 100%;
      padding: 5px 10px;
      .product-top-name {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .select-attr-btn {
      position: absolute;
      width: 1.8rem;
      height: 1.8rem;
      line-height: 1.8rem;
      right: 5px;
      bottom: 5px;
      font-size: 1.4rem;
      color: #FFFFFF;
      text-align: center;
      border-radius: 50%;
      background-color: #FFC241;
      cursor: pointer;
    }
  }
</style>
