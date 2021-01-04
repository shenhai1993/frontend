<template>
  <div
    class="product-left"
    :class="{ 'level-state': posData.index == currCustomData.key }"
    :data-key="currCustomData.key"
    @click.stop="getPositionData()"
    :style="{
      fontSize: currCustomData.size + 'px',
      color: currCustomData.color,
      width: currCustomData.width + 'px',
      height: currCustomData.height + 'px',
      top: currCustomData.top + 'px',
      left: currCustomData.left + 'px'
    }">
    <div class="product-left-img"><img v-if="productItem.img_url" :src="productItem.img_url" alt="图片" /><div class="product-left-stock" :style="{ fontSize: currCustomData.size - 2 + 'px' }">{{productItem.stock}}</div></div>
    <div class="product-left-text">
      <div class="product-left-name">{{productItem.name}}</div>
      <div v-if="productItem.spec" :style="{ fontSize: currCustomData.size - 2 + 'px' }">{{'（' + productItem.spec + '）'}}</div>
      <div v-if="productItem.sell_price"><span style="font-size: 10px;">￥</span>{{productItem.sell_price}}&nbsp;&nbsp;<span style="text-decoration: line-through;" :style="{ fontSize: currCustomData.size - 2 + 'px' }">{{productItem.buy_price}}</span></div>
      <div v-else-if="productItem.buy_price"><span style="font-size: 10px;">￥</span>{{productItem.buy_price}}</div>
    </div>
    <i class="product-left-icon-plus"></i>
  </div>
</template>

<script>
import $ from 'jquery'
import 'jquery-ui/ui/widgets/draggable'
import 'jquery-ui/ui/widgets/resizable'

export default {
  props: {
    itemData: {
      type: Object
    },

    state: {
      type: Boolean
    },

    posData: {
      type: Object
    },

    posWatch: {
      type: Object
    },

    proItem: {
      type: Array
    }
  },

  data () {
    return {
      currCustomData: {},
      productItem: {},
      proItemOrg: []
    }
  },

  created () {
    this.currCustomData = JSON.parse(JSON.stringify(this.itemData))
    this.initData(this.proItem)
  },

  mounted () {
    this.initEditAction()
  },

  methods: {
    initData (v) {
      this.productItem = {}
      const data = JSON.parse(JSON.stringify(v))
      this.proItemOrg = data
      for (let i = 0; i < data.length; i++) {
        if (data[i].tname == 'img_url') {
          this.proItemOrg[i].val = '/static/images/model_thumb/model_list_thumb_001.png'
        } else {
          this.proItemOrg[i].val = data[i].sname
        }

        let newData = {}
        newData[data[i].tname] = this.proItemOrg[i].val
        this.productItem = Object.assign({}, this.productItem, newData)
      }
    },

    initEditAction () {
      $('.product-left[data-key=' + this.currCustomData.key + ']').draggable({
        containment: 'parent',
        cursor: 'move',
        stop: (event, ui) => {
          this.getDraggableData(event, ui)
        }
      })
      $('.product-left[data-key=' + this.currCustomData.key + ']').resizable({
        containment: 'parent',
        stop: (event, ui) => {
          this.getResizableData(event, ui)
        }
      })
    },

    getDraggableData (event, ui) {
      const top = parseFloat(ui.position.top)
      const left = parseFloat(ui.position.left)
      this.currCustomData = Object.assign({}, this.currCustomData, { top: top, left: left })
    },

    getResizableData (event, ui) {
      const width = parseFloat(ui.size.width)
      const height = parseFloat(ui.size.height)
      this.currCustomData = Object.assign({}, this.currCustomData, { width: width, height: height })
    },

    getPositionData () {
      const data = {
        type: 'image',
        index: this.currCustomData.key,
        active: 'drag',
        size: this.currCustomData.size,
        color: this.currCustomData.color,
        top: Math.round(this.currCustomData.top),
        left: Math.round(this.currCustomData.left),
        width: Math.round(this.currCustomData.width),
        height: Math.round(this.currCustomData.height)
      }
      this.$emit('getItemData', data)
    },

    commitData () {
      let subData = JSON.parse(sessionStorage.getItem('product_custom_submit_data'))
      let index = -1
      for (let i = 0; i < subData.length; i++) {
        if (subData[i].key == this.currCustomData.key) {
          this.currCustomData.attr = this.proItemOrg
          this.currCustomData.id = 0
          this.currCustomData.category_id = 0
          this.currCustomData.cname = '全部'
          subData.splice(i, 1, this.currCustomData)
          break
        }
      }
      sessionStorage.setItem('product_custom_submit_data', JSON.stringify(subData))
    }
  },

  watch: {
    state (v) {
      if (v) {
        this.commitData()
      }
    },

    posWatch (v) {
      if (this.currCustomData.key == v.index) {
        let data = {}
        data[v.type] = v.val
        this.currCustomData = Object.assign({}, this.currCustomData, data)
      }
    },

    proItem (v) {
      this.initData(v)
    }
  }
}
</script>

<style lang="scss" scoped>
  .product-left {
    position: absolute;
    width: 0px;
    height: 0px;
    left: 0px;
    top: 0px;
    border-radius: 6px;
    background-color: #FFFFFF;
    overflow: hidden;
    .product-left-img {
      position: relative;
      width: 100%;
      height: 54%;
      img {
        display: block;
        width: 100%;
        height: 100%;
      }
      .product-left-stock {
        position: absolute;
        right: 5px;
        bottom: 5px;
        padding: 0 5px;
        border-radius: 6px;
        background-color: #EBEEF5AD;
      }
    }
    .product-left-text {
      padding: 5px 10px;
      .product-left-name {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .product-left-icon-plus {
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
  .level-state {
    border: 1px solid #3F94EF;
  }
</style>
