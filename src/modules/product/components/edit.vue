<template>
  <el-dialog class="product-page-edit" @close="click_cancel" :title="showWindowTitle" :visible="showEditWindow" width="700px" center>
    <el-form :model="formDrug" ref="formDrug" :rules="rules" size="mini" label-width="212px">
      <el-form-item prop="img_path" label="图片上传：">
        <el-upload
          :action="uploadAction"
          :on-success="fileUploadSuccess"
          :before-upload="fileUploadPicurlBefore"
          :file-list="fileList"
          :limit="1"
          :with-credentials="true"
          :on-exceed="handleEceed"
          list-type="picture"
          accept="image/jpeg, image/jpg, image/png">
          <el-button size="small" type="primary">图片上传</el-button>
          <span slot="tip" class="el-upload__tip">&nbsp;&nbsp;&nbsp;&nbsp;体积：不超过400KB&nbsp;&nbsp;格式：png、jpg</span>
        </el-upload>
      </el-form-item>
      <el-form-item prop="name" label="菜品名称：">
        <el-input v-model="formDrug.name" auto-complete="off" maxlength="20" style="width: 60%"></el-input>
      </el-form-item>
      <el-form-item prop="intro" label="菜品描述：">
        <el-input type="textarea" v-model="formDrug.intro" auto-complete="off" maxlength="100" style="width: 60%"></el-input>
      </el-form-item>
      <el-form-item prop="buy_price" label="原价：">
        <el-input v-model="formDrug.buy_price" maxlength="10" auto-complete="off" style="width: 60%"></el-input>
      </el-form-item>
      <el-form-item prop="sell_price" label="折扣价：">
        <el-input v-model="formDrug.sell_price" maxlength="10" auto-complete="off" style="width: 60%"></el-input>
      </el-form-item>
      <el-form-item prop="category_id" label="菜品分类：">
        <el-select v-model="formDrug.category_id" placeholder="请选择" style="width: 60%">
          <el-option
            v-for="item in productsTypeList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="spec" label="规格：">
        <el-input v-model="formDrug.spec" auto-complete="off" style="width: 60%"></el-input>
      </el-form-item>
      <el-form-item prop="stock" label="每日上架数量：">
        <el-input v-model.number="formDrug.stock" maxlength="8" auto-complete="off" style="width: 60%"></el-input>
      </el-form-item>
      <el-form-item prop="threshold" label="商品低库存阈值：" >
        <el-input v-model.number="formDrug.threshold" maxlength="8" auto-complete="off" style="width: 60%"></el-input>
        <el-tooltip class="item" effect="dark" content="设定商品低库存阈值，该商品库存低于该阈值则视为需补货商品" placement="top">
          <i class="el-icon-question" style="vertical-align: middle; font-size: 20px"></i>
        </el-tooltip>
      </el-form-item>
      <el-form-item prop="expiry_date" label="生效时段管理：">
        <el-date-picker
          style="width: 60%;"
          v-model="formDrug.expiry_date"
          type="daterange"
          unlink-panels
          range-separator="至"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>


      <!--
      <el-form-item prop="img_path" label="商品图片：">
        <uploadCmp acceptType ="image/jpeg,image/jpg,image/png"
          :uploadAction = "uploadAction"
          @success="fileUploadSuccess"
          :posterURL = "posterURL">
        </uploadCmp>
      </el-form-item>
      <el-form-item prop="picurl" label="海报图片：">
        <uploadCmp acceptType ="image/jpeg,image/jpg,image/png"
                   :uploadAction = "uploadAction"
                   @success="fileUploadPicurlSuccess"
                   :posterURL = "posterPicurlURL"
        ></uploadCmp>
      </el-form-item>
      <el-form-item prop="height" label="权重：">
        <el-input  v-model="formDrug.height" auto-complete="off"></el-input>
      </el-form-item>
      -->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="submitForm('formDrug', 'sale')" type="warning">上 架</el-button>
      <el-button @click="submitForm('formDrug')" type="primary">保 存</el-button>
      <el-button @click="click_cancel">取 消</el-button>
    </span>

    <!--
    <div slot="footer" class="dialog-footer">
      <dialog-button @clickCancel="click_cancel" @clickConfirm="submitForm('formDrug')"></dialog-button>
      <el-button @click="resetForm('formDrug')">清空</el-button>
    </div>
    -->

  </el-dialog>
</template>

<script>
import http from '@static/js/utils/http'
import uploadCmp from '@/components/upload'
import {mapState, mapMutations, mapActions} from 'vuex'
import DialogButton from '@/components/DialogButton'
import {Product} from '../static/js/product.js'

export default {
  data () {
    let validatorName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入商品名称'))
      }
      callback()
    }

    return {
      uploadAction: process.env.API_BASE + 'products/upload-img',
      formDrug: {
        id: 0,
        name: '',
        img_path: '',
        pack_price: 0,
        height: 0,
        picurl: 'http://',
        threshold: 100,
        sku: 0,
        manufacturer: 'tcl'
      },
      title: '新增菜品',
      action: 'add',
      options: [], // 药品类型
      rules: {
        name: [{ validator: validatorName, required: true, trigger: 'blur' }], // 商品名
        spec: [{ required: true, message: '请输入规格', trigger: 'blur' }], // 规格
        img_path: [{ required: true, message: '请上传菜品图片' }],
        buy_price: [
          { required: true, message: '请输入原价', trigger: 'blur' },
          { required: true, pattern: /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/, message: '请输入正确格式', trigger: 'blur' }
        ],
        sell_price: [
          { required: true, message: '无折扣请输入与原价相等', trigger: 'blur' },
          { required: true, pattern: /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/, message: '请输入正确格式', trigger: 'blur' }
        ],
        intro: [{ required: true, message: '请输入描述', trigger: 'blur' }],
        stock: [
          { required: true, message: '请输入库存', trigger: 'blur' },
          { required: true, pattern: /^[1-9]\d*$/, message: '请输入正整数', trigger: 'blur' }
        ],
        threshold: [
          { required: true, message: '请输入阈值', trigger: 'blur' },
          { required: true, pattern: /^\d+$/, message: '请输入正整数', trigger: 'blur' }
        ],
        category_id:[{ required: true, message: '请选择菜品分类', trigger: 'change' }],
        expiry_date:[{ required: true, message: '请选择日期', trigger: 'blur' }]
      },
      posterPicurlURL: '',
      fileList: [],
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    }
  },
  computed : {
    ...mapState({
      showEditWindow: state => state.product.showEditWindow,
      productsTypeList: state => state.product.productsTypeList
    }),
    showWindowTitle: function () {
      return this.formDrug.id == 0 ? '新增菜品' : '编辑菜品'
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
    },

    customizePages: {
      type: Number
    },

    currentPage: {
      type: Number
    }
  },

  components: {
    uploadCmp,
    DialogButton
  },

  created () {
    this.action = this.item.id != 0 ? 'edit' : 'add'
    //this.posterURL = this.item.img_url
    //this.posterPicurlURL = this.item.picurlPath
    if (this.action === 'edit'){
      this.formDrug = JSON.parse(JSON.stringify(this.item))
      const date = this.formDrug.expiry_date.split('/')
      this.formDrug.expiry_date = date
      this.fileList.push({
        name: 'pic',
        url: this.formDrug.img_url
      })
    }
  },

  methods: {
    ...mapMutations([
      'SHOW_EDIT_WINDOW'
    ]),

    ...mapActions([
      'createProductItem','getProductsPageList'
    ]),

    /**
     * 文件上传成功
     * */
    fileUploadSuccess(response, file, fileList) {
      this.formDrug.img_path = response.message
    },

    /**
     * 海报文件上传
     * */
    fileUploadPicurlSuccess(response, file, fileList) {
      this.formDrug.picurl = response.message
    },

    /**
     * 上传前判断
     * */
    fileUploadPicurlBefore (file) {
      const type = file.name.substring(file.name.lastIndexOf('.') + 1)
      const size = file.size / 1024
      const typeState = type === 'png' || type === 'PNG' || type === 'jpg' || type === 'JPG' || type === 'jpeg' || type === 'JPEG'
      const sizeState = size <= 400
      if (!typeState) {
        this.$message({
          message: '仅支持 png、jpg 格式图片！',
          type: 'warning'
        })
        return false
      }
      if (!sizeState) {
        this.$message({
          message: '图片大小不超过 400KB !',
          type: 'warning'
        })
        return false
      }
    },

    submitForm (formName, type) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this._saveItems(type)
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
      let _date = this.formDrug.expiry_date
      this.formDrug.expiry_date = _date[0] + '/' + _date[1]
      let data = this.formDrug
      return data
    },

    /**
     * 添加/编辑药品
     * */
    _saveItems (type) {
      let data = this._setPayload()
      this.createProductItem(data)
        .then(res => {
          if (!res.data.success) {
            this._notify('错误', res.data.message, 'error')
            return
          }

          if (type == 'sale') {
            Product.sale ({ id: res.data.message.id, issale: 1 })
              .then(res => {
                if (!res.data.success) {
                  this._notify('错误', res.data.message, 'error')
                  return
                }

                this._notify('成功', '操作成功', 'success')
                this.getProductsPageList({
                  page: this.currentPage,
                  perpage: this.customizePages
                })
                this.$emit('refreshList')
              })
              .catch(function(error) {
                alert(error.response.data.msg);
              });
            return
          }

          this._notify('成功', '操作成功', 'success')
          this.getProductsPageList({
            page: this.currentPage,
            perpage: this.customizePages
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
    },

    handleEceed (files, fileList) {
      this.$alert('最多添加一张图片，请点击预览框右上角删除，再重新上传！', '提醒');
    }
  },

  watch: {
  }
}
</script>

<style lang="scss">
  .product-page-edit {
    .el-date-editor .el-range-separator {
      width: 10%;
    }
  }
</style>
