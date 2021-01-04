<template>
  <div class="drug-warpper">
    <div class="new-btn">
      <el-button @click="createPaymentItem" type="primary" size="small" icon="el-icon-plus">新增支付类型</el-button>
      <edit
        v-if="showEditWindow"
        @refreshList="getPaymentsList"
        ref="editWindow"
        :index="index"
        :item="currentItem">
      </edit>
    </div>
    <div class="drug-warpper-main">
      <el-table
        v-loading="loading"
        :data="pagesList.data"
        style="width: 100%"
        height="100%">
        <el-table-column prop="payment_name" label="支付类型" width="150"></el-table-column>
        <el-table-column></el-table-column>
        <el-table-column prop="payment_state" label="状态" width="150">
          <template slot-scope="scope">
            <div v-if="scope.row.payment_state == 1" class="dot-open"><span></span>已启用</div>
            <div v-else="" class="dot-close"><span></span>未禁用</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button @click="editPayment(scope)" type="text" size="small">编辑</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button @click="deletePayment(scope.row.id)" type="text" size="small">删除</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button @click="showCode(scope.row)" type="text" size="small">演示</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      :title="codeName"
      :visible.sync="showCodeCard"
      width="30%">
      <img :src="codeImg" />
    </el-dialog>
  </div>
</template>

<script>
import Edit from './edit'
import { mapState, mapMutations, mapActions } from 'vuex'
import {Payment} from '../static/js/payment.js'

export default {
  components: {
     Edit
  },
  data () {
    return {
      showCodeCard: false,
      codeImg: '',
      codeName: '请扫码支付',
      currentItem: {},
      index: -1,
      currentPage: 1,
      customizePages: 10,
      paymentConfig: {
        1: [
          {
            code: 'partner',
            name: '合作者身份',
            value: ''
          }
        ],
        2: [
          {
            code: 'account',
            name: '支付宝账号',
            value: ''
          },
          {
            code: 'key',
            name: '交易安全校验码',
            value: ''
          },
          {
            code: 'partner',
            name: '合作者身份',
            value: ''
          }
        ],
        3: [
          {
            code: 'partner',
            name: '合作者身份',
            value: ''
          },
          {
            code: 'key',
            name: '交易安全校验码',
            value: ''
          }
        ],
        4: [
          {
            code: 'partner',
            name: '合作者身份',
            value: ''
          }
        ],
        5: [
          {
            code: 'partner',
            name: '合作者身份',
            value: ''
          }
        ]
      }
    }
  },

  computed: {
    ...mapState({
      showEditWindow: state => state.payment.showEditWindow,
      loading: state => state.payment.loading,
      pagesList: state => state.payment.paymentsPageList
    })
  },

  mounted () {

  },

  methods: {
    ...mapMutations([
      'GET_PAYMENT_PAGE_LIST', 'SHOW_EDIT_WINDOW', 'UPDATE_LOADING_STATUS'
    ]),

    ...mapActions([
      'getPaymentsPageList'
    ]),

    /**
     * *添加
     * **/
    createPaymentItem() {
      this.currentItem = { id: 0 }
      this.SHOW_EDIT_WINDOW(true)
    },

    /**
     * *编辑更新
     * **/
    editPayment(scope){
      this.currentItem = JSON.parse(JSON.stringify(scope.row))
      let configStr = this.currentItem.payment_config
      let configObj = configStr.split(',')
      let configArr = this.paymentConfig[this.currentItem.id]
      let payment_config = []
      for (let i=0; i<configArr.length; i++) {
        const code = configArr[i].code
        let currentArr = configArr[i]
        for (let i=0; i<configObj.length; i++) {
          const currentObj = configObj[i].split(':')
          if (code == currentObj[0]) {
            currentArr.value = currentObj[1]
            payment_config.push(currentArr)
          }
        }
      }
      this.currentItem.payment_config = payment_config
      this.SHOW_EDIT_WINDOW(true)
    },

    /**
     * *删除
     * **/
    deletePayment(val){
      this.$confirm("删除分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        Payment.remove (val)
          .then(res => {
            this.$message({
              type: "success",
              message: res.data.message
            });
            this.getPaymentsPageList({
              page: 1,
              perpage: this.customizePages
            })
          })
          .catch(function(error) {
            alert(error.response.data.msg)
          })
      })
    },

    showCode (data) {
      let code = data.payment_code
      if (code == 'tenpay') {
        code = 'wechat'
        this.codeName = '请用微信扫码支付'
      } else if (code == 'alipay') {
        code = 'alipay'
        this.codeName = '请用支付宝扫码支付'
      } else {
        code = ''
        this.codeName = '系统正在更新...'
        this.codeImg = ''
        this.showCodeCard = true
        return false
      }
      Payment.showCode(code).then(res => {
        if (res.data.success) {
          this.codeImg = res.data.message
          this.showCodeCard = true
        } else {
          alert(res.data.message)
        }
      }).catch(function (error) {
        alert(error.response.data.msg)
      })
    },

    _notify (title, message, type) {
      this.$notify({
        title,
        message,
        type
      })
    },

    getPaymentsList () {}
  },

  mounted () {
    this.getPaymentsPageList({
      page: 1,
      perpage: this.customizePages
    })
  }
}
</script>

<style lang="scss" scoped>
.drug-warpper{
  height: 100%;
  .new-btn{
    margin-bottom: 20px
  }
  .list{
    display: flex;
    flex-wrap: wrap;
    padding-left: 50px;
    .item{
    flex-basis: 180px
    }
  }
}
.el-icon-question{
  font-size: 18px;
  vertical-align: text-bottom
}
.pages-block {
  margin-top: 20px;
  text-align: right;
  .customize-box {
    text-align: right;
    font-size: 13px;
    font-weight: 400;
    color: #606266;
    .customize-pages {
      width: 130px;
      display: inline-block;
      margin: 5px 10px;
    }
  }
}
</style>
