<template>
  <el-dialog width="500px" :title="title" :visible="showStockWindow" @close="click_cancel">
    <el-form :model="formDrug" ref="formDrug" size="mini" :rules="rules"  label-width="160px" style="padding-right: 80px" >
      <el-row>
        <el-col :span="24">
          <el-form-item  label="药品图片：">
            <div class="stockImg">
              <img :src="posterURL" >
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="药品名称：">
            <div>{{name}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="规格：">
            <div>{{spec}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="sku码：">
            <div>{{sku}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="buy_price" label="买入价：">
            <el-input  v-model="formDrug.buy_price" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="sell_price" label="卖出价：">
            <el-input  v-model="formDrug.sell_price" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="num` int" label="进货数：">
            <el-input  v-model="formDrug.num" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <dialog-button @clickCancel="click_cancel" @clickConfirm="submitForm('formDrug')"></dialog-button>
      <!--<el-button @click="resetForm('formDrug')">清空</el-button>-->
    </div>
  </el-dialog>
</template>

<script>
  import {mapState, mapMutations, mapActions} from 'vuex'
  import DialogButton from '@/components/DialogButton'

  export default {
    data () {
      return {
        posterURL: '',
        name: '',
        sku: '',
        spec:'',
        formDrug: {
        },
        title: '新增库存',
        action: 'add',
        options: [], // 药品类型
        rules: {
          sell_price: [{  required: true, message: '请填写卖出价', trigger: 'blur' }], // 规格
          buy_price: [{ required: true,  message: '请填写买入价',trigger: 'blur'}],
          num: [{  required: true, message: '进货数不能为空', trigger: 'blur' }], // sku码
        }
      }
    },
    computed : {
      ...mapState({
        showStockWindow: state => state.product.showStockWindow,
        productsTypeList: state => state.product.productsTypeList //读取vuex中的药品类型
      })
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

    components: {
      DialogButton
    },

    created () {
      this.action = this.item.id != 0 ? 'edit' : 'add'
      this.posterURL = this.item.img_url
      this.name  = this.item.name
      this.spec  = this.item.spec
      this.sku  = this.item.sku
      this.formDrug.drug_id = this.item.id
    },

    methods: {
      ...mapMutations([
        'SHOW_STOCK_WINDOW'
      ]),
      ...mapActions([
        'createStock','getProductsPageList'
      ]),
      /**
       * *关闭弹窗
       * */
      click_cancel () {
        this.SHOW_STOCK_WINDOW(false)
      },
      /**
       * * 保存库存
       * */
      submitForm () {
        this.createStock(this.formDrug).then(res => {
            this._notify('成功', '操作成功', 'success')
            // this._hiddenForm()
            this.getProductsPageList({
              page: 1,
              perpage:5
            })
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
      }
    }
  }
</script>
<style lang="scss">
  .stockImg{
    position: absolute;
    top:50%;
    margin-top:-35px;
    width: 70px;
    height: 70px;
    img{
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      max-width: 100%;
      vertical-align: middle;
    }
  }
</style>
