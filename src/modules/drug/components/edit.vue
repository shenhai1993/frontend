<template>
  <el-dialog width="700px" :title="showWindowTitle" :visible="showEditWindow" @close="click_cancel">
    <el-form :model="formDrug" ref="formDrug" size="mini" :rules="rules"  label-width="140px" >
      <el-row>
        <el-col :span="12">
          <el-form-item prop="name" label="药品名称：">
            <el-input v-focus  v-model="formDrug.name" auto-complete="off" maxlength="100"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="spec" label="规格：">
            <el-input  v-model="formDrug.spec" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="sku" label="sku码：">
            <el-input  v-model="formDrug.sku" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="threshold" label="商品低库存阈值：" >
            <el-input   v-model="formDrug.threshold" auto-complete="off" style="width:calc(100% - 25px)"></el-input>
            <el-tooltip class="item" effect="dark" content="设定商品低库存阈值，该商品库存低于该阈值则视为需补货商品" placement="top">
              <i class="el-icon-question" style="vertical-align: middle; font-size: 20px"></i>
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="category_id" label="药品类型：">
            <el-select v-model="formDrug.category_id" placeholder="请选择" style="width: 100%">
              <el-option
                v-for="item in drugsTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="expiry_date" label="有效期管理：">
            <el-date-picker
              style="width: 100%"
              v-model="formDrug.expiry_date"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="manufacturer" label="厂家：">
            <el-input  v-model="formDrug.manufacturer" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="intro" label="文字介绍：">
            <el-input  type="textarea"  v-model="formDrug.intro" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="img_path" label="商品图片：">
            <uploadCmp acceptType ="image/jpeg,image/jpg,image/png"
                       :uploadAction = "uploadAction"
                       @success="fileUploadSuccess"
                       :posterURL = "posterURL"
            ></uploadCmp>
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
import http from '@static/js/utils/http'
import uploadCmp from '@/components/upload'
import {mapState, mapMutations, mapActions} from 'vuex'
import DialogButton from '@/components/DialogButton'

export default {
  data () {
    let validatorName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('药品名称不能为空'))
      }
      callback()
    }

    return {
      uploadAction: process.env.API_BASE + 'drugs/upload-img',
      formDrug: {
        id: 0,
        name: '',
        img_path: '',
        threshold: 100
      },
      title: '新增药品',
      action: 'add',
      options: [], // 药品类型
      rules: {
        name: [{ validator: validatorName,required: true, trigger: 'blur' }], // 药品名
        spec: [{  required: true, message: '规格不能为空', trigger: 'blur' }], // 规格
        img_path: [{ required: true,  message: '请上传商品图片'}],
        sku: [{  required: true, message: 'sku码不能为空', trigger: 'blur' }], // sku码
        threshold: [{  required: true, message: '阈值不能为空', trigger: 'blur' }],
        category_id:[{  required: true, message: '药品类型不能为空', trigger: 'change' }],
        expiry_date:[{  required: true, message: '请选择有效期', trigger: 'blur' }],
        manufacturer: [] //厂家
      }
    }
  },
  computed : {
    ...mapState({
      showEditWindow: state => state.drug.showEditWindow,
      drugsTypeList: state => state.drug.drugsTypeList //读取vuex中的药品类型
    }),
    showWindowTitle: function () {
      return this.formDrug.id == 0 ? '新增药品' : '编辑药品'
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

  components: {
    uploadCmp,
    DialogButton
  },

  created () {
    this.action = this.item.id != 0 ? 'edit' : 'add'
    log('create action: ' + this.action)
    // console.log(this.$store.state.drugsTypeList)
    this.posterURL = this.item.img_url
    if (this.action === 'edit'){
      this.formDrug = this.item
    }
  },

  methods: {
    ...mapMutations([
      'SHOW_EDIT_WINDOW'
    ]),
    ...mapActions([
      'createItem','getDrugsPageList'
    ]),
    /**
     * 文件上传成功
     * */
    fileUploadSuccess(fileItem) {
      this.formDrug.img_path = fileItem.response.message
    },
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this._saveItem()
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
      let data
      data = this.formDrug
      return data
    },
    /**
     * 添加/编辑药品
     * */
    _saveItem () {
      let data = this._setPayload()
      this.createItem(data)
      .then(res => {
        this._notify('成功', '操作成功', 'success')
        this.getDrugsPageList({
          page: 1,
          perpage:5
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

  },

  watch: {
  }
}
</script>
