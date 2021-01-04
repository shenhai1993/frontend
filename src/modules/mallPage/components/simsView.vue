<template>
  <div class="main" :style="{ width: simsResetWH[0], height: simsResetWH[1] }">
    <component
      v-for="(item, index) in newSimsViewData"
      :key="item.key"
      :is="item.special_type"
      :tagname="item.special_type + '_' + index"
      :modelIndex="index"
      :comData="item"
      @getShopData="getShopData"
      @getAttrData="getAttrData">
    </component>
    <div class="bottom-cover" style="position: relative;" :style="{ height: showOperation ? '20.43rem' : '3.2rem' }"></div>
    <shopping-cart
      :width="simsResetWH[0]"
      @cartOperation="cartOperation"
      @getShopData="getShopData"
      @cancel="cancelOrder"
      @confirm="showOrderDetail">
    </shopping-cart>
    <select-attr
      v-if="showSelect"
      :show="showSelect"
      :data="selectAttrData"
      @closeSelect="closeSelect"
      @confirmSelect="confirmSelect">
      </select-attr>
    </select-attr>
    <order-detail
      v-if="showOrder"
      :width="simsResetWH[0]"
      :isOrder="showOrder"
      :currData="orderData"
      @back="orderDetailBack"
      @cancel="cancelOrder"
      @confirm="confirmOrder">
    </order-detail>
    <pay-dialog
      v-if="showPay"
      :width="simsResetWH[0]"
      :isPay="showPay"
      :currData="payData"
      @cancel="cancelPay"
      @closePay="closePay">
    </pay-dialog>
  </div>
</template>

<script>
import { mallPage } from '../static/js/mallPage.js'
import { mapState, mapMutations, mapActions } from 'vuex'
import ShoppingCart from './uicoms/shoppingCart.vue'
import PayDialog from './uicoms/payDialog.vue'
import OrderDetail from './uicoms/orderDetail.vue'
import SelectAttr from './uicoms/selectAttr.vue'

export default {
  components: {
    AdCarousel: () => import ('./modelcoms/adCarousel.vue'),
    AdSingle: () => import ('./modelcoms/adSingle.vue'),
    LogoModel: () => import ('./modelcoms/logoModel.vue'),
    MenuProductOne: () => import ('./modelcoms/menu-product-one.vue'),
    MenuProductTwo: () => import ('./modelcoms/menu-product-two.vue'),
    AdCustom: () => import ('./modelcoms/adCustom.vue'),
    ProductCustom: () => import ('./modelcoms/productCustom.vue'),
    MenuCustom: () => import ('./modelcoms/menuCustom.vue'),
    DividerCustom: () => import ('./modelcoms/dividerCustom.vue'),
    ShoppingCart,
    PayDialog,
    OrderDetail,
    SelectAttr
  },

  data () {
    return {
      resValue: '',
      simsOffsetWH: ['100%', '100%'],
      simsResetWH: ['100%', '100%'],
      newSimsViewData: [],
      coverTop: 0,
      showPay: false,
      payData: {},
      showOperation: false,
      showOrder: false,
      orderData: {},
      showSelect: false,
      selectAttrData: {}
    }
  },

  computed: {
    ...mapState({
      simsViewData: state => state.mallPage.simsViewData,
      baseWH: state => state.mallPage.baseWH,
      productIdString: state => state.mallPage.productIdString
    })
  },

  created () {
    mallPage.that = this
  },

  mounted () {
    this.initPage()
  },

  methods: {
    ...mapMutations([
      'SHOPPING_CART_DATA',
      'SIMS_RESET_WH',
      'LOADING_STATUS',
      'CLEAR_SHOPPING_CART',
      'SET_PRODUCT_ID',
      'SET_UPDATE_STOCK_DATA'
    ]),

    ...mapActions([
      'saveShoppingCartData',
      'setSimsResetWH',
      'loadingStatus',
      'clearShoppingCart',
      'setProductId',
      'setUpdateStockData'
    ]),

    initPage () {
      this.getSimsOffsetWH('main')
      if (this.resValue != '') {
        this.setSimsWH(this.resValue, this.simsOffsetWH)
      }
    },

    getSimsOffsetWH (name) {
      this.simsOffsetWH = mallPage.getOffsetWH(name)
    },

    setSimsWH (val, wh) {
      this.simsResetWH = mallPage.setWidthXHeight(val, wh)
      this.setSimsResetWH(this.simsResetWH)
    },

    getShopData (data) {
      this.saveShoppingCartData(data)
    },

    getAttrData (val) {
      this.selectAttrData = JSON.parse(JSON.stringify(val))
      this.showSelect = true
    },

    cancelOrder () {
      this.showOrder = false
      this.clearShoppingCart()
      const h = parseInt(this.simsResetWH[1])
      this.$message({
        message: '已取消！',
        type: 'warning',
        offset: h - h * 0.27
      })
    },

    orderDetailBack () {
      this.showOrder = false
    },

    cancelPay () {
      this.closePay()
      const h = parseInt(this.simsResetWH[1])
      this.$message({
        message: '已取消！',
        type: 'warning',
        offset: h - h * 0.27
      })
    },

    closePay () {
      this.showPay = false
      this.clearShoppingCart()
      mallPage.updateStockData(this.newSimsViewData)
    },

    showOrderDetail (val) {
      this.orderData = JSON.parse(JSON.stringify(val))
      this.showOrder = true
    },

    confirmOrder (val) {
      const data = JSON.parse(JSON.stringify(val))
      const h = parseInt(this.simsResetWH[1])
      this.$message({
        message: '提交成功！',
        type: 'success',
        offset: h - h * 0.27
      })
      this.showOrder = false
      this.$nextTick(() => {
        this.showPay = true
        this.payData = data
      })
    },

    cartOperation (s) {
      this.showOperation = s
    },

    closeSelect () {
      this.showSelect = false
    },

    confirmSelect (data) {
      this.showSelect = false
      this.getShopData(data)
    }
  },

  watch: {
    simsViewData (v) {
      //console.log(v)
      if (v.length == 0) {
        this.newSimsViewData = []
        return false
      }
      this.newSimsViewData = JSON.parse(JSON.stringify(v))
      mallPage.updateStockData(this.newSimsViewData)
      // setTimeout(() => {
      //   const val = mallPage.getSimsViewModelTop(this.newSimsViewData)
      //   this.coverTop = val.top + 10
      // }, 2000)
    },

    baseWH (v) {
      const data = JSON.parse(JSON.stringify(v))
      const res = data[0] + 'x' + data[1]
      this.setSimsWH(res, this.simsOffsetWH)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../static/css/mallPage.scss';
</style>
