<template>
  <el-dialog @close="click_cancel" :title="showWindowTitle" :visible="showEditWindow" width="700px" center>
    <el-form :model="formDrug" ref="formDrug" :rules="rules" size="mini" label-width="212px">
      <el-form-item prop="payment_name" label="支付类型名称：">
        <el-input v-model="formDrug.payment_name" placeholder="请输入" auto-complete="off" style="width: 60%" :disabled="action === 'edit'"></el-input>
      </el-form-item>
      <el-form-item prop="payment_code" label="支付代码名称：">
        <el-input v-model="formDrug.payment_code" placeholder="请输入" auto-complete="off" style="width: 60%" :disabled="action === 'edit'"></el-input>
      </el-form-item>

      <!--
      <el-form-item prop="payment_config" label="支付接口配置信息：">
        <el-input v-model="formDrug.payment_config" placeholder="请输入" auto-complete="off" style="width: 60%"></el-input>
      </el-form-item>
      -->

      <el-form-item
        v-for="(con, index) in formDrug.payment_config"
        :key="con.key"
        :prop="'payment_config.' + index + '.value'"
        :label="con.name + '：'"
        :rules="{
          required: true, message: '请填写完整信息', trigger: 'blur'
        }">
        <el-input v-model="con.value" placeholder="请输入" auto-complete="off" style="width: 60%"></el-input>
      </el-form-item>

      <el-form-item prop="payment_state" label="状态：">
        <el-switch
          v-model="formDrug.payment_state"
          active-value="1"
          inactive-value="0"
          active-text="启用"
          inactive-text="禁用">
        </el-switch>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="submitForm('formDrug')" type="primary">保 存</el-button>
      <el-button @click="click_cancel">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import http from '@static/js/utils/http'
import uploadCmp from '@/components/upload'
import {mapState, mapMutations, mapActions} from 'vuex'

export default {
  data () {
    return {
      formDrug: {
        id: 0,
        payment_code: '',
        payment_name: '',
        payment_config: [
          {
            code: 'partner',
            name: '合作者身份',
            value: ''
          }
        ],
        payment_state: '1'
      },
      title: '新增支付类型',
      action: 'add',
      rules: {
        payment_name: [{ required: true, message: '支付类型名称不能为空', trigger: 'blur' }],
        payment_code:[{ required: true, message: '支付代码名称不能为空', trigger: 'blur' }],
        payment_config:[{ required: true, message: '支付接口配置信息不能为空', trigger: 'blur' }]
      }
    }
  },
  computed : {
    ...mapState({
      showEditWindow: state => state.attribute.showEditWindow,
      productsTypeList: state => state.attribute.productsTypeList
    }),

    showWindowTitle: function () {
      return this.formDrug.id == 0 ? '新增支付类型' : '编辑支付类型'
    }
  },

  props: {
    item: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    },

    index: {
      type: Number
    }
  },

  components: {},

  created () {
    this.action = this.item.id != 0 ? 'edit' : 'add'
    if (this.action === 'edit') {
      this.formDrug = JSON.parse(JSON.stringify(this.item))
    }
  },

  methods: {
    ...mapMutations([
      'SHOW_EDIT_WINDOW'
    ]),
    ...mapActions([
      'getPaymentsPageList', 'createPaymentItem'
    ]),

    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this._saveItems()
          return true
        } else {
          return false
        }
      })
    },

    click_cancel () {
      this._hiddenForm()
    },

    _setPayload () {
      let data = JSON.parse(JSON.stringify(this.formDrug))
      let configArr = data.payment_config
      let configStr = ''
      for (let i=0; i<configArr.length; i++) {
        if (i == 0) {
          configStr += configArr[i].code + ':' + configArr[i].value
        } else {
          configStr += ',' + configArr[i].code + ':' + configArr[i].value
        }
      }
      data.payment_config = configStr
      return data
    },
    /**
     * 添加/编辑药品
     * */
    _saveItems () {
      let data = this._setPayload()
      this.createPaymentItem(data)
        .then(res => {
          this._notify('成功', '操作成功', 'success')
          this.getPaymentsPageList({
            page: 1,
            perpage: 10
          })
          this.$emit('refreshList')
        })
        .catch(e => {
          this._notify('错误', '操作失败，请重试', 'error')
          console.log(e)
        })
    },

    _notify (title, message, type) {
      this.$notify({
        title,
        message,
        type
      })
    },

    _hiddenForm () {
      this.SHOW_EDIT_WINDOW(false)
    }
  },

  watch: {}
}
</script>
