<template>
  <div
    class="menu-product-two"
    :name="tagname"
    :style="{
      height: modelData.height + 'px',
      marginTop: modelData.top + 'px',
      marginBottom: modelData.top + 'px'
    }">
    <div class="two-aside">
      <ul>
        <li
          v-for="(value, name, index) in menuList"
          :class="{'two-aside-active': name == currMenu}"
          @click="selectMenu(name)">
          {{value.cname}}
          <i v-show="value.num > 0" class="number-icon">{{value.num}}</i>
        </li>
      </ul>
    </div>
    <div class="two-main">
      <div
        v-for="(product, index) in productData"
        :key="product.key"
        class="two-main-list"
        :style="{
          height: productHeight + 'px',
          marginLeft: index % 3 == 0 ? '0' : '2.45%'
        }">
        <template
          v-for="(item, i) in product.attr">
          <el-image v-if="item.type == 'image'" :src="item.val" alt="图片" :preview-src-list="[item.val]"></el-image>
          <div
            v-else-if="item.type == 'text'"
            :style="{ fontSize: item.size / 10 + 'rem', color: item.color }"
            :data-tname="item.tname">
            <span v-if="item.tname == 'sell_price'" class="one-main-list-price">￥</span>
            <span v-if="item.tname == 'buy_price'">&nbsp;&nbsp;&nbsp;&nbsp;<span style="text-decoration: line-through;">{{item.val}}</span></span>
            <span v-else>{{item.val}}</span>
          </div>
        </template>
        <input-num
          v-if="product.attr[product.attr.length-1].val == ''"
          :min="0"
          :max="100"
          :idx="index"
          :mId="modelIndex"
          :item="newCartData[index]"
          :miniWidth="true"
          @getNumber="getNumber">
        </input-num>
        <div
          v-else
          class="select-attr-btn el-icon-more-outline"
          @click="selectAttr(product)">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { mallPage } from '../../static/js/mallPage.js'
import InputNum from '../uicoms/inputNum.vue'

export default {
  components: {
    InputNum
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
      currMenu: 0,
      menuList: {
        0: {
          cname: '全部',
          num: 0
        }
      },
      productData: [],
      productHeight: 0,
      cartData: [],
      newCartData: []
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

  mounted () {
    this.productHeight = document.getElementsByClassName('two-main-list')[0].offsetWidth * 1.52
  },

  methods: {
    initData () {
      let data = JSON.parse(JSON.stringify(this.comData))
      this.modelData = JSON.parse(data.comData)
      const oldSimsWH = [parseFloat(this.baseWH[0]), parseFloat(this.baseWH[1])]
      const newSimsWH = [parseFloat(this.simsResetWH[0]), parseFloat(this.simsResetWH[1])]
      this.modelData.height = mallPage.getNewH(this.modelData.height, oldSimsWH, newSimsWH)
      this.modelData.top = mallPage.getNewH(this.modelData.top, oldSimsWH, newSimsWH)
      this.productData = this.modelData.comData
      this.getMenuList(this.productData)
    },

    getMenuList (v) {
      const data = JSON.parse(JSON.stringify(v))
      this.menuList = {
        0: {
          cname: '全部',
          num: 0
        }
      }
      for (let i = 0; i < data.length; i++) {
        const id = data[i].category_id
        let menu = {}
        menu[id] = {
          cname: data[i].cname,
          num: 0
        }
        this.menuList = Object.assign({}, this.menuList, menu)

        const productId = data[i].id + (data[i].packet_id > 0 ? 'p' : '') + '-0'
        const d = {
          cId: productId
        }
        this.newCartData.splice(i, 0, d)
        this.cartData.splice(i, 0, d)
      }
    },

    selectMenu (id) {
      if (id == this.currMenu){
        return
      }
      this.currMenu = id
      this.getNewProductList(id)
    },

    getNewProductList (id) {
      this.productData = []
      this.newCartData = []
      this.$nextTick(() => {
        const data = JSON.parse(JSON.stringify(this.modelData.comData))
        if (id == 0) {
          this.productData = data
          for (let i = 0; i < data.length; i++) {
            const productId = data[i].id + (data[i].packet_id > 0 ? 'p' : '') + '-0'
            let d = {
              cId: productId
            }
            if (this.shoppingCartData[productId] !== undefined) {
              d.num = this.shoppingCartData[productId].num
            }
            this.newCartData.splice(i, 0, d)
          }
          return
        }
        for (let i = 0; i < data.length; i++) {
          const category_id = data[i].category_id
          if (category_id == id) {
            this.productData.splice(i, 0, data[i])

            const productId = data[i].id + (data[i].packet_id > 0 ? 'p' : '') + '-0'
            let d = {
              cId: productId
            }
            if (this.shoppingCartData[productId] !== undefined) {
              d.num = this.shoppingCartData[productId].num
            }
            this.newCartData.splice(i, 0, d)
          }
        }
      })
    },

    getNumber (v) {
      const res = JSON.parse(JSON.stringify(v))
      if (res.mId != this.modelIndex) {
        return
      }
      const data = JSON.parse(JSON.stringify(this.productData[res.idx]))
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
      this.$emit('getShopData', shopData)
    },

    selectAttr (data) {
      this.$emit('getAttrData', data)
    },

    getMenuListNum (v) {
      const data = v
      let obj = {}
      let count = 0
      for (let i in data) {
        const id = data[i].category_id
        if (this.menuList[id] != undefined) {
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
      for (let i in this.menuList) {
        let menu = {}
        menu[i] = {
          cname: this.menuList[i].cname,
          num: 0
        }
        this.menuList = Object.assign({}, this.menuList, menu)
      }
      if (Object.keys(obj).length > 0) {
        obj[0] = {
          cname: '全部',
          num: count
        }
        this.menuList = Object.assign({}, this.menuList, obj)
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

<style lang="scss">
  .menu-product-two {
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
  .menu-product-two {
    position: relative;
    width: 96.32%;
    margin-left: 1.84%;
    color: #343434;
    .two-aside {
      float: left;
      width: 19.32%;
      height: 90.7%;
      left: 0px;
      top: 0px;
      padding: 5px 0;
      border-radius: 0.625rem;
      box-shadow: 0 1px 5px 2px #DFE3E9;
      background-color: #FFFFFF;
      overflow: hidden;
      ul {
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        li {
          position: relative;
          width: 80%;
          font-size: 1.4rem;
          padding: 15.3% 0;
          margin: 0 auto;
          text-align: center;
          cursor: pointer;
          .number-icon {
            position: absolute;
            width: 1.6rem;
            height: 1.6rem;
            line-height: 1.6rem;
            top: 5px;
            right: 0px;
            font-size: 1.2rem;
            color: #FFFFFF;
            text-align: center;
            border-radius: 50%;
            background-color: #FF8F1F;
          }
        }
        li + li {
          border-top: 1px solid #DFE3E9;
        }
        .two-aside-active {
          color: #FF8F1F;
        }
      }
      ul::-webkit-scrollbar {
        width: 0px;
        height: 0px;
      }
      ul::-webkit-scrollbar-thumb {
        background: transparent;
      }
      ul::-webkit-scrollbar-track {
        background: transparent;
      }
    }
    .two-main {
      float: right;
      width: 78.6%;
      height: 100%;
      overflow: auto;
      .two-main-list {
        position: relative;
        float: left;
        width: 31.7%;
        margin-bottom: 2.45%;
        border-radius: 0.625rem;
        background-color: #FFFFFF;
        overflow: hidden;
        cursor: pointer;
        .el-image {
          display: block;
          width: 100%;
          height: 57%;
          border-radius: 0.625rem;
        }
        div[data-tname] {
          width: 85%;
          margin: 0 auto;
          display: -webkit-box;
          overflow: hidden;
          text-overflow: -o-ellipsis-lastline;
          text-overflow: ellipsis;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        div[data-tname = name] {
          height: 20.4%;
          margin-top: 5px;
        }
        .two-main-list-price {
          font-size: 1rem;
        }
      }
    }
    .two-main::-webkit-scrollbar {
      width: 0px;
      height: 0px;
    }
    .two-main::-webkit-scrollbar-thumb {
      background: transparent;
    }
    .two-main::-webkit-scrollbar-track {
      background: transparent;
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
