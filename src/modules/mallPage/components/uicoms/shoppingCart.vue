<template>
  <div class="shopping-cart" :class="{ 'shopping-cart-show': showOperation }" :style="{width: width}">
    <div v-if="showOperation" class="shopping-header" @click="showCartOperation">
      <i class="el-icon-s-operation"></i>
      &nbsp;&nbsp;我的订单
      <el-divider v-if="orderType != ''" direction="vertical"></el-divider>
      {{orderType}}
      <div class="shopping-total"><span>总计：</span>{{orderTotal}}元</div>
    </div>
    <div v-else class="shopping-header-hide" @click="showCartOperation">
      <i class="el-icon-s-operation"></i>
      &nbsp;&nbsp;我的订单
      <el-divider direction="vertical"></el-divider>
      {{orderType}}({{Object.keys(cartList).length}}件商品)
      <div class="shopping-total"><span>总计：</span>{{orderTotal}}元</div>
      <div class="shopping-header-btn" @click.stop="submitOrder">去结算</div>
    </div>
    <div class="shopping-main">
      <div v-if="Object.keys(cartList).length == 0" class="shopping-no-data">请添加商品...</div>
      <div v-else style="height: 100%;" :style="{ width: shoppingMainWidth }">
        <cart-item
          v-for="(value, name, index) in cartList"
          v-if="value.num > 0"
          :key="name"
          :cData="value"
          @getCartData="getCartData">
        </cart-item>
      </div>
    </div>
    <div class="shopping-footer">
      <el-row>
        <el-col :span="12">
          <div class="shopping-cancel-btn" @click="clearCart">取消订单</div>
        </el-col>
        <el-col :span="12">
          <div class="shopping-confirm-btn" @click="submitOrder">完成订单</div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { floatCount } from '@/assets/js/floatcount.js'
import { mallPage } from '../../static/js/mallPage.js'
import { mapState, mapMutations, mapActions } from 'vuex'
import CartItem from './cartItem.vue'

export default {
  components: {
    CartItem
  },

  props: {
    width: {
      type: String
    }
  },

  data () {
    return {
      showOperation: false,
      addNum: 0,
      orderType: '',
      orderTotal: 0,
      goodsAmount: 0,
      cartList: {},
      shoppingMainWidth: '100%'
    }
  },

  computed: {
    ...mapState({
      shoppingCartData: state => state.mallPage.shoppingCartData,
      simsResetWH: state => state.mallPage.simsResetWH
    })
  },

  methods: {
    ...mapMutations([
      'CLEAR_SHOPPING_CART',
      'LOADING_STATUS'
    ]),

    ...mapActions([
      'clearShoppingCart',
      'loadingStatus'
    ]),

    showCartOperation () {
      this.showOperation = !this.showOperation
      this.$emit('cartOperation', this.showOperation)
    },

    getCartData (data) {
      this.$emit('getShopData', data)
    },

    getTotal (data) {
      const totalData = JSON.parse(JSON.stringify(data))
      let orderResult = 0
      let goodsResult = 0
      for (let o in totalData) {
        const sell_price = totalData[o].sell_price ? totalData[o].sell_price : totalData[o].buy_price
        const orderRes = floatCount.accMul(sell_price, totalData[o].num)
        const goodsRes = floatCount.accMul(totalData[o].buy_price, totalData[o].num)
        orderResult = floatCount.accAdd(orderResult, orderRes)
        goodsResult = floatCount.accAdd(goodsResult, goodsRes)
      }
      this.orderTotal = orderResult
      this.goodsAmount = goodsResult
    },

    clearCart () {
      this.clearShoppingCart()
      const h = parseInt(this.simsResetWH[1])
      this.$message({
        message: '已取消！',
        offset: h - h * 0.27
      })
    },

    getSubmitData () {
      let submitData = {
        goods_amount: this.goodsAmount,
        order_amount: this.orderTotal,
        goods_detail: []
      }
      const data = JSON.parse(JSON.stringify(this.cartList))
      for (let o in data) {
        const curr = {
          pack_id: data[o].packet_id,
          goods_id: data[o].packet_id == 0 ? data[o].id : 0,
          goods_name: data[o].name,
          goods_price: data[o].buy_price,
          goods_num: data[o].num,
          goods_pay_price: data[o].sell_price ? data[o].sell_price : data[o].buy_price,
          goods_spec: data[o].spec ? data[o].spec : '',
          goods_img_url: data[o].img_url ? data[o].img_url : ''
        }
        submitData.goods_detail.push(curr)
      }
      return submitData
    },

    submitOrder () {
      if (Object.keys(this.cartList).length == 0) {
        const h = parseInt(this.simsResetWH[1])
        this.$message({
          message: '请添加商品...',
          type: 'warning',
          offset: h - h * 0.27
        })
        return false
      }
      const data = this.getSubmitData()
      this.$emit('confirm', data)
    }
  },

  watch: {
    shoppingCartData (v) {
      //console.log(v)
      this.cartList = JSON.parse(JSON.stringify(v))
      this.getTotal(v)
      const length = Object.keys(this.cartList).length
      if (length > 0) {
        this.$nextTick(() => {
          this.shoppingMainWidth = 16 * length + 'rem'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .shopping-cart {
    position: fixed;
    width: 100%;
    height: 20.43rem;
    bottom: -17.23rem;
    background-color: #ffffff;
    transition: bottom 400ms;
    -webkit-transition: bottom 400ms;
    opacity: .92;
    overflow: hidden;
    z-index: 9;
    .shopping-header, .shopping-header-hide {
      position: relative;
      color: #3A3A3A;
      height: 3.2rem;
      line-height: 3.2rem;
      padding: 0 15px;
      font-size: 1.3rem;
      background-color: #FF8F1F;
      background-image: linear-gradient(#FFC242, #FF8F1F);
      .el-divider {
        width: 1px;
        background-color: #111111;
      }
      .shopping-total {
        position: absolute;
        color: #BF1616;
        width: 25%;
        height: 100%;
        right: 15px;
        top: 0px;
        text-align: right;
        font-size: 1.4rem;
        > span {
          color: #272727;
          font-size: 1.2rem;
        }
      }
    }
    .shopping-header-hide {
      background-color: #EBEBEB;
      background-image: linear-gradient(#FEFAF1, #EBEBEB);
      .shopping-total {
        right: calc(30% + 15px);
      }
      .shopping-header-btn {
        position: absolute;
        width: 30%;
        height: 100%;
        right: 0px;
        top: 0px;
        color: #FFFFFF;
        text-align: center;
        background-color: #FF9221;
        background-image: linear-gradient(#FFC241, #FF9221);
        cursor: pointer;
      }
    }
    .shopping-main {
      width: 100%;
      height: 11.3rem;
      padding: 5px 0;
      overflow-y: hidden;
      overflow-x: auto;
      .shopping-no-data {
        font-size: 1.4rem;
        line-height: 10rem;
        padding-left: 15px;
      }
    }
    .shopping-main::-webkit-scrollbar {
      height: 2px;
    }
    .shopping-main::-webkit-scrollbar-thumb {
      border-radius: 1px;
      background: #606266;
    }
    .shopping-main::-webkit-scrollbar-track {
      border-radius: 1px;
      background: transparent;
    }
    .shopping-footer {
      height: 5.9rem;
      border-top: 1px solid #DFE3E9;
      .shopping-cancel-btn, .shopping-confirm-btn {
        width: 91.3%;
        height: 3rem;
        line-height: 3rem;
        text-align: center;
        margin: 1.45rem auto;
        border-radius: 0.625rem;
        font-size: 1.4rem;
        cursor: pointer;
      }
      .shopping-confirm-btn {
        color: #FFFFFF;
        background-color: #FF9221;
        background-image: linear-gradient(#FFC241, #FF9221);
      }
      .shopping-cancel-btn {
        color: #3A3A3A;
        background-color: #F1F1F1;
        background-image: linear-gradient(#FFFDF8, #F1F1F1);
      }
    }
  }
  .shopping-cart-show {
    bottom: 0rem;
  }
</style>
