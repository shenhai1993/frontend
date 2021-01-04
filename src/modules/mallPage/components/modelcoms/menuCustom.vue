<template>
  <div
    class="menu-custom"
    :name="tagname"
    :style="{
      height: modelData.height + 'px',
      marginTop: modelData.top + 'px',
      marginBottom: modelData.top + 'px'
    }">
    <div
      class="product-main"
      :style="{
        width: product.width + 'px',
        height: product.height + 'px',
        top: product.top + 'px',
        left: product.left + 'px'
      }">
      <div
        v-for="(item, index) in newCartData"
        :key="item.key"
        class="pro-cus-main-item"
        :style="{
          height: item.height + 'px'
        }">
        <div
          v-for="(proItem, i) in item.data"
          :key="item.key + '-' + proItem.key"
          :style="{
            width: proItem.width + 'px',
            height: proItem.height + 'px',
            top: proItem.top + 'px',
            left: proItem.left + 'px'
          }">
          <component
            :is="proItem.type"
            :itemData="proItem"
            @getShop="getShop"
            @getAttr="getAttr">
          </component>
        </div>
      </div>
    </div>

    <div
      v-if="menuData.key > 0"
      :style="{
        width: menuData.width + 'px',
        height: menuData.height + 'px',
        top: menuData.top + 'px',
        left: menuData.left + 'px'
      }">
      <component
        :is="menuData.type"
        :itemData="menuData"
        @getNewProductList="getNewProductList">
      </component>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { mallPage } from '../../static/js/mallPage.js'

export default {
  components: {
    MenuLeft: () => import ('./menuLeft.vue'),
    MenuTop: () => import ('./menuTop.vue'),
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
      product: {},
      productData: [],
      newCartData: [],
      menuData: {
        key: 0,
        list: {
          0: {
            cname: '全部',
            num: 0
          }
        }
      }
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
      this.modelData = JSON.parse(data.comData)
      const oldSimsWH = [parseFloat(this.baseWH[0]), parseFloat(this.baseWH[1])]
      const newSimsWH = [parseFloat(this.simsResetWH[0]), parseFloat(this.simsResetWH[1])]
      this.modelData.height = mallPage.getNewH(this.modelData.height, oldSimsWH, newSimsWH)
      this.modelData.top = mallPage.getNewH(this.modelData.top, oldSimsWH, newSimsWH)
      const item = this.modelData.comData
      if (item.menu) {
        this.menuData = Object.assign({}, this.menuData, item.menu)
        this.menuData.width = mallPage.getNewW(this.menuData.width, oldSimsWH, newSimsWH)
        this.menuData.left = mallPage.getNewW(this.menuData.left, oldSimsWH, newSimsWH)
        this.menuData.height = mallPage.getNewH(this.menuData.height, oldSimsWH, newSimsWH)
        this.menuData.top = mallPage.getNewH(this.menuData.top, oldSimsWH, newSimsWH)
      }
      this.product = item.product
      this.product.width = mallPage.getNewW(this.product.width, oldSimsWH, newSimsWH)
      this.product.left = mallPage.getNewW(this.product.left, oldSimsWH, newSimsWH)
      this.product.height = mallPage.getNewH(this.product.height, oldSimsWH, newSimsWH)
      this.product.top = mallPage.getNewH(this.product.top, oldSimsWH, newSimsWH)
      this.productData = item.product.data
      for (let i = 0; i < this.productData.length; i++) {
        this.productData[i].height = mallPage.getNewH(this.productData[i].height, oldSimsWH, newSimsWH)
        const proItem = this.productData[i].data
        for (let j = 0; j < proItem.length; j++) {
          this.productData[i].data[j].width = mallPage.getNewW(proItem[j].width, oldSimsWH, newSimsWH)
          this.productData[i].data[j].left = mallPage.getNewW(proItem[j].left, oldSimsWH, newSimsWH)
          this.productData[i].data[j].height = mallPage.getNewH(proItem[j].height, oldSimsWH, newSimsWH)
          this.productData[i].data[j].top = mallPage.getNewH(proItem[j].top, oldSimsWH, newSimsWH)
        }
      }
      this.newCartData = JSON.parse(JSON.stringify(this.productData))
      this.getMenuList(this.newCartData)
    },

    getMenuList (v) {
      const data = JSON.parse(JSON.stringify(v))
      delete this.menuData.list
      let list = {
        0: {
          cname: '全部',
          num: 0
        }
      }
      this.menuData = Object.assign({}, this.menuData, { list: list })
      for (let i = 0; i < data.length; i++) {
        const item = data[i].data
        for (let i = 0; i < item.length; i++) {
          const id = item[i].category_id
          let menu = {}
          menu[id] = {
            cname: item[i].cname,
            num: 0
          }
          list = Object.assign({}, list, menu)
        }
      }
      this.menuData = Object.assign({}, this.menuData, { list: list })
    },

    getShop (data) {
      this.$emit('getShopData', data)
    },

    getAttr (data) {
      this.$emit('getAttrData', data)
    },

    getNewProductList (id) {
      this.newCartData = []
      this.$nextTick(() => {
        const data = JSON.parse(JSON.stringify(this.productData))
        if (id == 0) {
          this.newCartData = data
          return
        }
        let oldCartData = []
        for (let i = 0; i < data.length; i++) {
          const item = data[i].data
          for (let i = 0; i < item.length; i++) {
            const category_id = item[i].category_id
            if (category_id == id) {
              oldCartData.push(item[i])
            }
          }
        }
        let _oldData = JSON.parse(JSON.stringify(data))
        let oldIndex = 0
        let _oldIndex = 0
        const oldLength = data.length
        for (let i = 0; i < oldLength; i++) {
          const newLength = data[i].data.length
          let newIndex = 0
          for (let j = 0; j < newLength; j++) {
            if (oldIndex < oldCartData.length) {
              newIndex++
              _oldData[i].data[j] = Object.assign({}, _oldData[i].data[j], { attr: oldCartData[oldIndex].attr, category_id: oldCartData[oldIndex].category_id, cname: oldCartData[oldIndex].cname, id: oldCartData[oldIndex].id })
            } else {
              data[i].data.splice(newIndex, 1)
            }
            oldIndex++
          }
          if (data[i].data.length == 0) {
            _oldData.splice(_oldIndex, 1)
          } else {
            _oldIndex++
            _oldData[i].data.length = data[i].data.length
          }
        }
        this.newCartData = _oldData
      })
    },

    getMenuListNum (v) {
      const data = v
      let obj = {}
      let count = 0
      for (let i in data) {
        const id = data[i].category_id
        if (this.menuData.list[id] != undefined) {
          if (obj[id] == undefined) {
            obj[id] = {}
            obj[id].num = data[i].num
          } else {
            obj[id].num += data[i].num
          }
          obj[id].cname = data[i].cname
          count += data[i].num
        }
      }
      let menu = {}
      for (let i in this.menuData.list) {
        const cname = obj[i] == undefined ? this.menuData.list[i].cname : obj[i].cname
        const num = obj[i] == undefined ? 0 : obj[i].num
        menu[i] = {
          cname: cname,
          num: num
        }
      }
      this.menuData = Object.assign({}, this.menuData, { list: menu })
      if (Object.keys(obj).length > 0) {
        menu[0] = {
          cname: '全部',
          num: count
        }
        this.menuData = Object.assign({}, this.menuData, { list: menu })
      }
    }
  },

  watch: {
    shoppingCartData (v) {
      this.getMenuListNum(v)
    }
  }
}
</script>

<style lang="scss" scoped>
  .menu-custom {
    position: relative;
    width: 100%;
    overflow: hidden;
    > div {
      position: absolute;
    }
    .product-main {
      overflow: auto;
      .pro-cus-main-item {
        position: relative;
        > div {
          position: absolute;
        }
      }
      .pro-cus-main-item + .pro-cus-main-item {
        margin-top: 1rem;
      }
    }
    .product-main::-webkit-scrollbar {
      width: 0px;
      height: 0px;
    }
    .product-main::-webkit-scrollbar-thumb {
      background: transparent;
    }
    .product-main::-webkit-scrollbar-track {
      background: transparent;
    }
  }
</style>
