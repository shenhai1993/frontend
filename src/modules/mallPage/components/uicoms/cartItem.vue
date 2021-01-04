<template>
  <div class="cartItem-list">
    <div class="cartItem-name">{{cartData.name}}</div>
    <div class="cartItem-detail">{{cartData.spec == '' || cartData.spec == undefined ? '&nbsp' : '(' + cartData.spec + ')'}}</div>
    <div class="cartItem-price"><span>￥</span>{{cartData.sell_price ? cartData.sell_price : cartData.buy_price}}</div>
    <input-num
      :min="0"
      :max="100"
      :idx="-1"
      :mId="-1"
      :item="cartData"
      @getNumber="getNumber">
    </input-num>
  </div>
</template>

<script>
import InputNum from './inputNum.vue'

export default {
  components: {
    InputNum
  },

  props: {
    cData: {
      type: Object
    }
  },

  data () {
    return {
      cartData: this.cData
    }
  },

  created () {

  },

  methods: {
    getNumber (v) {
      let data = this.cartData
      data.num = v.num
      this.$emit('getCartData', data)
    }
  },

  watch: {
    cData (v) {
      this.cartData = Object.assign({}, this.cartData, v)
    }
  }
}
</script>

<style lang="scss" scoped>
  .cartItem-list {
    float: left;
    position: relative;
    color: #414141;
    width: 14.9rem;
    height: 9.5rem;
    margin-top: 0.7rem;
    margin-left: 0.9rem;
    padding: 0.5rem;
    border-radius: 0.625rem;
    border: 1px solid #DFE3E9;
    box-shadow: 0 0 5px 1px #E0E0E0;
    .cartItem-name {
      font-size: 1.3rem;
      display: -webkit-box;
      white-space: normal;
      overflow: hidden;
      text-overflow: -o-ellipsis-lastline;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .cartItem-detail {
      font-size: 1.1rem;
    }
    .cartItem-price {
      font-size: 1.4rem;
      span {
        font-size: 1.1rem;
      }
    }
  }
</style>
