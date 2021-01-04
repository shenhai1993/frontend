<template>
  <el-dialog @close="click_cancel" title="订单详情" :visible="showEditWindow" width="700px" center>
    <el-row class="desc-info">
      <el-col :span="12">
        订单编号：{{descData.order_sn}}
      </el-col>
      <el-col :span="12">
        订单金额：￥{{descData.goods_amount}}
      </el-col>
    </el-row>
    <el-row class="desc-info">
      <el-col :span="12">
        订单状态：{{descData.order_state == 0 ? '已取消' : (descData.order_state == 10 ? '未支付' : '已付款')}}
      </el-col>
      <el-col :span="12">
        支付金额：￥{{descData.order_amount}}
      </el-col>
    </el-row>
    <el-row class="desc-info">
      <el-col :span="12">
        支付类型：{{descData.payment_code == 'wechat' ? '微信' : (descData.payment_code == 'alipay' ? '支付宝' : '其他')}}
      </el-col>
      <el-col :span="12">
        订单时间：{{descData.created_at}}
      </el-col>
    </el-row>
    <el-table :data="listData" height="350">
      <el-table-column property="goods_name" label="商品名称">
        <template slot-scope="scope">
          <div>{{scope.row.goods_name}}</div>
          <div style="font-size: 12px; color: #777777;">{{scope.row.goods_spec}}</div>
        </template>
      </el-table-column>
      <el-table-column property="goods_price" label="单价" width="150"></el-table-column>
      <el-table-column property="goods_pay_price" label="实价" width="150"></el-table-column>
      <el-table-column property="goods_num" label="数量" width="150"></el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import {mapState, mapMutations, mapActions} from 'vuex'

export default {
  props: {
    item: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    },

    show: {
      type: Boolean
    }
  },

  data () {
    return {
      showEditWindow: this.show,
      descData: this.item,
      listData: []
    }
  },

  created () {

  },

  mounted () {
    this.getDesc()
  },

  methods: {
    ...mapMutations([
      'SHOW_EDIT_WINDOW'
    ]),

    ...mapActions([
      'createOrderingItem'
    ]),

    getDesc () {
      this.createOrderingItem(this.descData.id).then(res => {
        if (res.data.success) {
          this.listData = res.data.message
        } else {
          this.$alert(res.data.message, '错误', {
            confirmButtonText: '知道了'
          })
        }
      }).catch((error) => {
        this.$alert(error, '错误', {
          confirmButtonText: '知道了'
        })
      })
    },

    click_cancel () {
      this.showEditWindow = false
      this.$emit('hideEditWindow')
    }
  }
}
</script>

<style lang="scss" scoped>
  .desc-info {
    margin-bottom: 15px;
  }
</style>
