<template>
  <el-dialog
    title="支付完成"
    :visible="showPayCallback"
    @close="closeDialog"
    fullscreen
    append-to-body
    center>
    <div style="font-size: 1.6rem; text-align: center; margin-top: 50%;"><span v-if="tipsData.completeTips == ''">支付完成信息提示：成功/失败，原因说明</span>{{tipsData.completeTips}}</div>
    <div v-if="tipsData.completeType == 'success'" style="font-size: 1.2rem; text-align: center; margin-top: 20px;">{{countDown}}秒后自动返回首页</div>
    <span slot="footer" class="dialog-footer">
      <el-button v-if="tipsData.completeType == 'error'" @click="goBack" type="warning" size="medium">重新支付</el-button>
      <el-button @click="closeDialog" size="medium">返回首页</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  components: {

  },

  props: {
    show: {
      type: Boolean
    },

    data: {
      type: Object
    }
  },

  data () {
    return {
      showPayCallback: this.show,
      tipsData: {
        completeTips: this.data.tips,
        completeType: this.data.type
      },
      countDown: 30,
      countDownTimeout: -1
    }
  },

  created () {

  },

  mounted () {
    if (this.tipsData.completeType == 'success') {
      this.getCountDown()
    }
  },

  methods: {
    goBack () {
      this.showPayCallback = false
      this.$emit('completeEmit', 'back')
    },

    closeDialog () {
      this.showPayCallback = false
      this.$emit('completeEmit', 'home')
    },

    getCountDown () {
      this.countDownTimeout = setInterval(() => {
        this.countDown--
        if (this.countDown == 0) {
          clearInterval(this.countDownTimeout)
          this.closeDialog()
        }
      }, 1000)
    }
  },

  destroyed () {
    clearInterval(this.countDownTimeout)
  }
}
</script>
