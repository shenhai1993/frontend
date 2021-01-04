<template>
  <el-dialog @close="click_cancel" :title="showWindowTitle" :visible="showEditWindow" width="700px" center>
    <el-form :model="formDrug" ref="formDrug" :rules="rules" size="mini" label-width="212px">
      <el-form-item prop="name" label="菜品分类名称：">
        <el-input v-focus v-model="formDrug.name" auto-complete="off" maxlength="8" style="width: 60%"></el-input>
      </el-form-item>
      <el-form-item prop="sort" label="权重：">
        <el-input  v-model.number="formDrug.sort" auto-complete="off" maxlength="8" style="width: 60%"></el-input>
      </el-form-item>
      <el-form-item prop="islock" label="状态：">
        <el-select v-model="formDrug.islock" placeholder="请选择" style="width: 60%">
          <el-option
            v-for="item in lockList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="picurl" label="图标：">
        <el-upload
          :action="uploadAction"
          :on-success="fileUploadPicurlSuccess"
          :before-upload="fileUploadPicurlBefore"
          :file-list="fileList"
          :limit="1"
          :with-credentials="true"
          :on-exceed="handleEceed"
          list-type="picture"
          accept="image/jpeg, image/jpg, image/png">
          <el-button size="small" type="primary">自定义图标</el-button>
          <span slot="tip" class="el-upload__tip">&nbsp;&nbsp;&nbsp;&nbsp;体积：不超过400KB&nbsp;&nbsp;格式：png、jpg</span>
        </el-upload>

        <!--
        <uploadCmp acceptType="image/jpeg,image/jpg,image/png"
          :uploadAction="uploadAction"
          @success="fileUploadPicurlSuccess"
          :posterURL="posterPicurlURL">
        </uploadCmp>
        -->

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
import DialogButton from '@/components/DialogButton'

export default {
  data () {
    let validatorName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('分类名称不能为空'))
      }
      callback()
    }

    return {
      uploadAction: process.env.API_BASE + 'products/upload-img',
      formDrug: {
        id: 0,
        picurl: '',
        name: '',
        sort: 0,
        islock: ''
      },
      title: '新增分类',
      action: 'add',
      options: [], // 药品类型
      lockList: [
        {
          id: 0,
          name: '开启'
        },
        {
          id: 1,
          name: '关闭'
        }
      ],
      rules: {
        name: [{ validator: validatorName,required: true, trigger: 'blur' }],
        sort:[
          { required: true, message: '请输入权重', trigger: 'blur' },
          { required: true, pattern: /^\d+$/, message: '请输入正整数', trigger: 'blur' }
        ],
        islock:[{ required: true, message: '请选择状态', trigger: 'change' }],
        picurl:[{ required: true, message: '请上传图标', trigger: 'change' }]
      },
      posterPicurlURL: '',
      fileList: []
    }
  },
  computed : {
    ...mapState({
      showEditWindow: state => state.product.showEditWindow,
    }),
    showWindowTitle: function () {
      return this.formDrug.id == 0 ? '新增菜品分类' : '菜品分类编辑'
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
    //this.posterPicurlURL = this.item.picurlPath
    if (this.action === 'edit'){
      this.formDrug = JSON.parse(JSON.stringify(this.item))
      this.fileList.push({
        name: 'pic',
        url: this.formDrug.picurlPath
      })
    }
  },

  methods: {
    ...mapMutations([
      'SHOW_EDIT_WINDOW'
    ]),
    ...mapActions([
      'createCategoryItem','getCategoriesPageList'
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

    /**
     * 图标文件上传
     * */
    fileUploadPicurlSuccess (response, file, fileList) {
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

    _setPayload () {
      let data = this.formDrug
      return data
    },
    /**
     * 添加/编辑药品
     * */
    _saveItems () {
      let data = this._setPayload()
      this.createCategoryItem(data)
      .then(res => {
        if (!res.data.success) {
          this._notify('错误', res.data.message, 'error')
          return
        }

        this._notify('成功', '操作成功', 'success')
        this.getCategoriesPageList({
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
