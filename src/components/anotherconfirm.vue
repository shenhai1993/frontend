<template>
  <!-- 写此组件是因为使用饿了么原生的confirm组件会对模板中的hover动画产生不知名的影响
       so用改写的el-dialog代替 -->
  <el-dialog title="提示" class="anotherconfirm"
             :visible.sync="confirm"
             @close="click_cancel">
    <span><i class="el-icon-info"></i> {{ priceTips }}</span>
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" @click="click_cancel">取 消</el-button>
      <el-button size="mini" type="primary" @click="click_save">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: ['confirmvisible', 'currentItem'],
  watch: {
    confirmvisible (v, nv) {
      this.confirm = v
    },
    currentItem (v, nv) {
      let item = v
      this.priceTips = Number(item.price) === 0 ? '此模板免费！' : `您确定要购买该模板吗? 购买将消耗 ￥${item.price}点券！`
    }
  },
  data () {
    return {
      confirm: false,
      priceTips: ''
    }
  },
  methods: {
    click_cancel () {
      this.$emit('issave', false)
    },
    click_save () {
      this.$emit('issave', true)
    }
  }
}
</script>

<style lang="scss">
  .anotherconfirm {
    .el-dialog {
      width: 425px;
      .el-dialog__header {
        padding: 10px 20px;
      }
      .el-dialog__body {
        padding: 10px 20px;
      }
      i {
        font-size: 26px;
        vertical-align: middle;
        color: #888;
        display: inline-block;
        margin-right: 10px;
      }
    }
  }
</style>
