<template>
  <el-dialog
    title=""
    :visible="showOrder"
    @close="cancelDialog"
    fullscreen
    append-to-body
    :show-close="false"
    center>
    <div class="order-detail">
      <div class="order-detail-header" @click="goBack">返回</div>
      <div class="order-detail-main">
        <div class="order-detail-main-title">我的订单</div>
        <div class="order-detail-main-list">
          <ul>
            <li
              v-for="(item, index) in orderData.goods_detail"
              :key="index">
              <el-row>
                <el-col :span="5">
                  <img :src="item.goods_img_url" alt="图片" />
                </el-col>
                <el-col :span="14">
                  <div class="list-content">
                    <div>{{item.goods_name}}</div>
                    <div style="font-size: 1.2rem; color: #777777;">{{item.goods_spec}}</div>
                    <div>X{{item.goods_num}}</div>
                  </div>
                </el-col>
                <el-col :span="5" style="text-align: right;">
                  <div><span style="font-size: 1rem;">￥</span>{{item.goods_pay_price ? item.goods_pay_price : item.goods_price}}</div>
                  <div v-if="item.goods_pay_price" style="text-decoration: line-through; font-size: 1.2rem;">{{item.goods_price}}</div>
                </el-col>
              </el-row>
            </li>
          </ul>
          <div class="circle-left"></div>
          <div class="circle-right"></div>
        </div>
        <div class="order-detail-main-amount">
          <el-row>
            <el-col :span="12">
              <div>已优惠：<span style="color: #BF1616; font-size: 1.6rem;"><span style="font-size: 1rem;">￥</span>{{count}}</span></div>
            </el-col>
            <el-col :span="12">
              <div style="text-align: right;">总计：<span style="color: #000000; font-size: 1.8rem;"><span style="font-size: 1rem;">￥</span>{{orderData.order_amount}}</span></div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="shopping-footer">
        <el-row>
          <el-col :span="1">
            &nbsp;
          </el-col>
          <el-col :span="10">
            <div class="shopping-cancel-btn" @click="cancelDialog">取消订单</div>
          </el-col>
          <el-col :span="2">
            &nbsp;
          </el-col>
          <el-col :span="10">
            <div class="shopping-confirm-btn" @click="submitOrder">确认支付</div>
          </el-col>
          <el-col :span="1">
            &nbsp;
          </el-col>
        </el-row>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { floatCount } from '@/assets/js/floatcount.js'
import { mallPage } from '../../static/js/mallPage.js'
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  components: {

  },

  props: {
    width: {
      type: String
    },

    isOrder: {
      type: Boolean
    },

    currData: {
      type: Object
    }
  },

  data () {
    return {
      showOrder: this.isOrder,
      orderData: this.currData,
      count: 0
    }
  },

  mounted () {
    this.count = floatCount.accSub(this.orderData.goods_amount, this.orderData.order_amount)
  },

  methods: {
    ...mapMutations([
      'LOADING_STATUS'
    ]),

    ...mapActions([
      'loadingStatus'
    ]),

    goBack () {
      this.showOrder = false
      this.$emit('back')
    },

    cancelDialog () {
      this.$confirm('订单尚未支付，确认关闭吗？', '提示', {
        type: 'warning'
      }).then(() => {
          this.showOrder = false
          this.$emit('cancel')
      }).catch(() => {})
    },

    submitOrder () {
      let newData = JSON.parse(JSON.stringify(this.orderData))
      for (let i = 0; i < newData.goods_detail.length; i++) {
        //this.$delete(newData.goods_detail[i], 'goods_spec')
        this.$delete(newData.goods_detail[i], 'goods_img_url')
      }
      this.loadingStatus(true)
      mallPage.submitOrderPost(newData).then(res => {
        this.loadingStatus(false)
        if (res.data.success) {
          this.$emit('confirm', res.data.message)
        } else {
          this.$alert(res.data.message, '错误', {
            confirmButtonText: '知道了'
          })
        }
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
  .order-detail {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    color: #3A3A3A;
    font-size: 1.4rem;
    padding: 2.5rem;
    background-color: #FFD2A5;
    .order-detail-main, .order-detail-header {
      border-radius: 0.625rem;
      box-shadow: 0 0 5px 2px #E0E0E0;
      background-color: #FFFFFF;
    }
    .order-detail-header {
      width: 11.3rem;
      height: 3rem;
      line-height: 3rem;
      text-align: center;
      margin-top: 1rem;
    }
    .order-detail-main {
      width: 100%;
      height: 85%;
      margin: 2rem auto 1rem;
      .order-detail-main-title {
        padding: 2.5rem 2.5rem 1rem;
        font-size: 2rem;
      }
      .order-detail-main-list {
        position: relative;
        width: 100%;
        height: 80%;
        ul {
          width: 100%;
          height: 100%;
          padding: 0 2.5rem;
          border-bottom: 1px solid #EBEBEB;
          overflow-y: auto;
          li {
            width: 100%;
            height: 9.3rem;
            padding: 1.5rem 0;
            .el-row {
              height: 100%;
              .el-col {
                height: 100%;
                img {
                  width: 95%;
                  height: 100%;
                  border-radius: 0.5rem;
                }
                .list-content {
                  width: 100%;
                  height: 100%;
                  padding-left: 1rem;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                }
              }
            }
          }
          li + li {
            border-top: 1px solid #EBEBEB;
          }
        }
        ul::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        ul::-webkit-scrollbar-thumb {
          border-radius: 2px;
          background: #606266;
        }
        ul::-webkit-scrollbar-track {
          background: transparent;
        }
        .circle-left, .circle-right {
          position: absolute;
          width: 3.2rem;
          height: 3.2rem;
          bottom: -1.6rem;
          border-radius: 50%;
          background-color: #FFD2A5;
        }
        .circle-left {
          left: -1.6rem;
        }
        .circle-right {
          right: -1.6rem;
        }
      }
      .order-detail-main-amount {
        font-size: 1.2rem;
        padding: 3rem 2.5rem 1rem;
      }
    }
    .shopping-footer {
      height: 5.9rem;
      .shopping-cancel-btn, .shopping-confirm-btn {
        width: 100%;
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
        background-color: #F1F1F1;
        background-image: linear-gradient(#FFFDF8, #F1F1F1);
      }
    }
  }
</style>
