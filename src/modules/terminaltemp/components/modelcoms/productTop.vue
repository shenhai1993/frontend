<template>
  <div
    class="product-top"
    :style="{
      fontSize: currCustomData.size + 'px',
      color: currCustomData.color
    }">
    <div class="product-top-img"><img v-if="productItem.img_url" :src="productItem.img_url" alt="图片" /><div v-if="productItem.stock" class="product-top-stock" :style="{ fontSize: currCustomData.size - 2 + 'px' }">剩余：{{productItem.stock}}</div></div>
    <div class="product-top-text">
      <div class="product-top-name">{{productItem.name}}</div>
      <div v-if="productItem.spec" class="product-top-name" :style="{ fontSize: currCustomData.size - 2 + 'px' }">{{'（' + productItem.spec + '）'}}</div>
      <div v-if="productItem.sell_price"><span style="font-size: 10px;">￥</span>{{productItem.sell_price}}&nbsp;&nbsp;<span style="text-decoration: line-through;" :style="{ fontSize: currCustomData.size - 2 + 'px' }">{{productItem.buy_price}}</span></div>
      <div v-else-if="productItem.buy_price"><span style="font-size: 10px;">￥</span>{{productItem.buy_price}}</div>
    </div>
    <i class="product-top-icon-plus"></i>
  </div>
</template>

<script>
export default {
  props: {
    itemData: {
      type: Object
    }
  },

  data () {
    return {
      currCustomData: this.itemData,
      productItem: {}
    }
  },

  created () {
    this.initData (this.itemData)
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
    }
  },

  watch: {
    itemData (v) {
      this.initData(v)
    }
  }
}
</script>

<style lang="scss" scoped>
  .product-top {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0px;
    top: 0px;
    border-radius: 6px;
    background-color: #FFFFFF;
    overflow: hidden;
    .product-top-img {
      position: relative;
      float: left;
      width: 39.13%;
      height: 100%;
      img {
        display: block;
        width: 100%;
        height: 100%;
      }
      .product-top-stock {
        position: absolute;
        right: 5px;
        bottom: 5px;
        padding: 0 5px;
        border-radius: 6px;
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
    .product-top-icon-plus {
      position: absolute;
      display: block;
      width: 20px;
      height: 20px;
      right: 10px;
      bottom: 10px;
      background-image: url(../../static/images/icon-plus-001.png);
      background-size: 100%;
    }
  }
</style>
