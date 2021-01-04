<template>
  <el-dialog
    v-loading="loading"
    title="支付订单"
    :visible="showPay"
    @close="cancelDialog"
    fullscreen
    center>
    <div class="pay-amount"><span>￥&nbsp;</span>{{payData.order_amount}}</div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>支付方式</span>
      </div>
      <div
        v-for="(item, index) in paymentData"
        :key="item.id"
        class="pay-item"
        @click="selectPay(index)">
        {{item.payment_name}}
        <i :class="{ 'el-icon-circle-check': payCheck[index], 'pay-check': !payCheck[index] }"></i>
      </div>
    </el-card>
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
          <div class="shopping-confirm-btn" @click="submitPay">确认支付</div>
        </el-col>
        <el-col :span="1">
          &nbsp;
        </el-col>
      </el-row>
    </div>

    <el-dialog
      :title="codeName"
      :visible.sync="showCodeCard"
      @close="closeCodeDialog"
      append-to-body
      fullscreen
      center>
      <div style="margin-top: 50%; text-align: center; font-size: 1.6rem;">
        {{codeName}}
        <img :src="codeImg" style="display: block; width: 50%; margin: 20px auto 0;" />
      </div>
      <div class="shopping-footer">
        <el-row>
          <el-col :span="7">
            &nbsp;
          </el-col>
          <el-col :span="10">
            <div class="shopping-cancel-btn" @click="closeCodeDialog">关闭</div>
          </el-col>
          <el-col :span="7">
            &nbsp;
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <pay-callback
      v-if="showPayCallback"
      :show="showPayCallback"
      :data="payCallbackData"
      @completeEmit="completeEmit">
    </pay-callback>
  </el-dialog>
</template>

<script>
import VueCookie from 'vue-cookies'
import { mallPage } from '../../static/js/mallPage.js'
import { mapState, mapMutations, mapActions } from 'vuex'
import PayCallback from './payCallback.vue'

export default {
  components: {
    PayCallback
  },

  props: {
    width: {
      type: String
    },

    isPay: {
      type: Boolean
    },

    currData: {
      type: Object
    }
  },

  data () {
    return {
      showPayCallback: false,
      payCallbackData: {},
      dialogWidth: parseFloat(this.width),
      codeWidth: '250px',
      showPay: this.isPay,
      payData: this.currData,
      idx: 0,
      payCheck: [],
      showCodeCard: false,
      codeName: '请扫码支付',
      codeImg: ''
    }
  },

  computed: {
    ...mapState({
      paymentData: state => state.mallPage.paymentListData,
      loading: state => state.mallPage.loading
    })
  },

  mounted () {
    this.payment()
    window.MALLPAGE_SHOW_COMPLETETIPS = this.showCompleteTips
  },

  methods: {
    ...mapMutations([
      'GET_PAYMENT_LIST',
      'LOADING_STATUS'
    ]),

    ...mapActions([
      'getPaymentList',
      'loadingStatus'
    ]),

    submitPay () {
      this.showCode()
    },

    cancelDialog () {
      this.$confirm('订单尚未支付，确认关闭吗？', '提示', {
        type: 'warning'
      }).then(() => {
          this.showPay = false
          this.$emit('cancel')
      }).catch(() => {})
    },

    payment () {
      if (this.paymentData.length > 0) {
        return false
      }
      this.loadingStatus(true)
      mallPage.getPayment(1, 10).then(res => {
        this.loadingStatus(false)
        if (res.data.success) {
          const data = res.data.message.data
          this.getPaymentList(data)
        } else {
          this.$alert(res.data.message, '错误', {
            confirmButtonText: '知道了'
          })
        }
      }).catch(() => {})
    },

    setPayCheck (v, index) {
      const data = JSON.parse(JSON.stringify(v))
      for (let i = 0; i < data.length; i++) {
        this.payCheck.splice(i, 0, false)
      }
      this.payCheck.splice(index, 1, true)
      this.idx = index
    },

    selectPay (i) {
      this.setPayCheck (this.paymentData, i)
    },

    showCode () {
      const data = this.paymentData[this.idx]
      const code = data.payment_code
      this.codeName = '请使用' + data.payment_name + '扫码支付'
      const showData = {
        m: this.payData.m.original,
        order_sn: this.payData.order_sn,
        order_amount: this.payData.order_amount,
        deviceid: VueCookie.get('deviceId')
      }
      this.loadingStatus(true)
      mallPage.showCode(code, showData).then(res => {
        this.loadingStatus(false)
        if (res.data.success) {
          this.codeImg = res.data.message
          this.showCodeCard = true

          // setTimeout(() => {
          //   this.getPayState()
          // }, 1000)

        } else {
          this.$alert(res.data.message, '错误', {
            confirmButtonText: '知道了'
          })
        }
      }).catch(() => {})
    },

    //mqttMSG () {
      // mqtt连接
    //   client.on('connect', (e) => {
    //     console.log('连接成功:')
    //     let numbers = VueCookie.get('deviceId')
    //     let topic = 'eshow/'+ numbers + '/ordering'
    //     client.subscribe(topic, { qos: 2 }, (error) => {
    //       if (!error) {
    //         //console.log('订阅成功')
    //       } else {
    //         //console.log('订阅失败')
    //       }
    //     })
    //   })
    //   // 接收消息处理
    //   client.on('message', (topic, message) => {
    //     console.log('收到来自', topic, '的消息', message.toString())
    //     this.msg = message.toString()
    //     if(this.msg != ''){
    //       client.end()
    //       alert('支付成功！')
    //       location.reload()      // 增加支付成功承载页来替换跳转体验差
    //     }
    //   })
    //   // 断开发起重连
    //   client.on('reconnect', (error) => {
    //     //console.log('正在重连:', error)
    //   })
    //   // 链接异常处理
    //   client.on('error', (error) => {
    //     //console.log('连接失败:', error)
    //   })
    // }

    closeCodeDialog () {
      this.showCodeCard = false
    },

    showCompleteTips (val) {
      // val = {
      //   type: 'success',
      //   tips: '支付成功！'
      // }

      this.payCallbackData = JSON.parse(JSON.stringify(val))
      this.closeCodeDialog()
      this.showPayCallback = true
    },

    completeEmit (v) {
      this.showPayCallback = false
      const type = v
      if (type == 'home') {
        this.showPay = false
        this.$emit('closePay')
      }
    },

    getPayState () {
      mallPage.getPayStatus().then(res => {
        if (res.data.success) {
          //this.payPageHashchange()
        } else {
          this.$alert(res.data.message, '错误', {
            confirmButtonText: '知道了'
          })
        }
      }).catch(() => {})
    },

    payPageReadState (to) {
      const query = to.query
      const val = {
        type: query.status,
        tips: query.status == 'success' ? '支付成功！' : '支付失败！'
      }
      this.showCompleteTips(val)
    },

    payPageHashchange () {
      const date = new Date()
      const time = date.getTime()
      const random = Math.floor(Math.random() * 2)
      const state = {
        status: random == 1 ? 'success' : 'error',
        time: time
      }
      const route = this.$route
      let query = route.query
      query = Object.assign({}, query, state)
      this.$router.replace({ path: route.path, query: query })
    }
  },

  watch: {
    paymentData (v) {
      this.setPayCheck (v, 0)
    },

    showPayCallback (v) {
      if (v) {
        this.showCodeCard = false
      }
    },

    $route (to, from) {
      this.payPageReadState(to)
    }
  }
}
</script>

<style lang="scss" scoped>
  .pay-amount {
    font-size: 2.8rem;
    text-align: center;
    margin-top: 30%;
    margin-bottom: 20px;
    span {
      font-size: 1.4rem;
    }
  }
  .pay-item {
    padding: 10px 0;
    i {
      float: right;
      transform: translate(0,5px)
    }
    .el-icon-circle-check {
      color: #67C23A;
    }
    .pay-check {
      width: 14px;
      height: 14px;
      border: 1px solid #DCDFE6;
      border-radius: 50%;
    }
  }
  .pay-item + .pay-item {
    border-top: 1px solid #EBEEF5;
  }
  .shopping-footer {
    height: 5.9rem;
    margin-top: 3rem;
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
</style>
