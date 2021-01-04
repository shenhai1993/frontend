<template>
  <el-dialog class="packet-page-edit" @close="click_cancel" :title="showWindowTitle" :visible="showEditWindow" width="700px" center>
    <el-form :model="formDrug" ref="formDrug" :rules="rules" size="mini" label-width="212px">
      <el-form-item prop="img_path" label="套餐图片：">
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
      <el-form-item prop="name" label="套餐名称：">
        <el-input v-focus v-model="formDrug.name" auto-complete="off" maxlength="20" style="width: 60%"></el-input>
      </el-form-item>
      <el-form-item prop="pack_product" label="选择套餐商品：">
        <el-cascader
          style="width: 60%;"
          v-model="formDrug.pack_product"
          :options="options"
          :props="props"
          :show-all-levels="false"
          @change="checkedChange"
          clearable>
        </el-cascader>
      </el-form-item>
      <el-form-item prop="intro" label="套餐描述：">
        <el-input type="textarea" v-model="formDrug.intro" auto-complete="off" maxlength="100" style="width: 60%"></el-input>
      </el-form-item>
      <el-form-item prop="category_id" label="套餐分类：">
        <el-select v-model="formDrug.category_id" placeholder="请选择" style="width: 60%">
          <el-option
            v-for="item in productsTypeList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="stock" label="每日上架数量：">
        <el-input v-model.number="formDrug.stock" maxlength="8" auto-complete="off" style="width: 60%"></el-input>
      </el-form-item>
      <el-form-item prop="pack_price" label="套餐价：">
        <el-input v-model="formDrug.pack_price" maxlength="10" auto-complete="off" style="width: 60%"></el-input>
      </el-form-item>
      <el-form-item prop="expiry_date" label="有效期管理：">
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
      <el-form-item prop="expiry_time" label="生效时段设置：">
        <el-button @click="showSetWeekTime" type="primary" size="mini">设 置</el-button>
        <span class="el-upload__tip">&nbsp;&nbsp;&nbsp;&nbsp;(默认全天生效)</span>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="submitForm('formDrug', 'sale')" type="warning">上 架</el-button>
      <el-button @click="submitForm('formDrug')" type="primary">保 存</el-button>
      <el-button @click="click_cancel">取 消</el-button>
    </span>

    <set-week-time
      v-if="showWeekTimeDialog"
      :show="showWeekTimeDialog"
      :timeArray="timeArray"
      @cancelWeekTimeDialog="cancelWeekTimeDialog"
      @submitWeekTimeDialog="submitWeekTimeDialog">
    </set-week-time>

  </el-dialog>
</template>

<script>
import http from '@static/js/utils/http'
import uploadCmp from '@/components/upload'
import {mapState, mapMutations, mapActions} from 'vuex'
import DialogButton from '@/components/DialogButton'
import {Packet} from '../static/js/packet.js'
import SetWeekTime from './setWeekTime'

export default {
  data () {
    let validatorName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('套餐名称不能为空'))
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
        manufacturer: 'tcl',
        pack_product: '',
        expiry_time: '00:00-23:59,00:00-23:59,00:00-23:59,00:00-23:59,00:00-23:59,00:00-23:59,00:00-23:59'
      },
      title: '新建套餐',
      action: 'add',
      //options: [],
      rules: {
        name: [{ validator: validatorName,required: true, trigger: 'blur' }], // 商品名
        spec: [{  required: true, message: '请输入规格', trigger: 'blur' }], // 规格
        img_path: [{ required: true,  message: '请上传套餐图片'}],
        pack_price: [
          { required: true, message: '请输入套餐价', trigger: 'blur' },
          { required: true, pattern: /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/, message: '请输入正确格式', trigger: 'blur' }
        ],
        intro: [{ required: true, message: '请输入描述', trigger: 'blur' }],
        pack_product: [{ required: true, message: '请添加套餐商品', trigger: 'change' }],
        stock: [
          { required: true, message: '请输入库存', trigger: 'blur' },
          { required: true, pattern: /^[1-9]\d*$/, message: '请输入正整数', trigger: 'blur' }
        ],
        category_id:[{ required: true, message: '请选择分类', trigger: 'change' }],
        expiry_date:[{ required: true, message: '请选择日期', trigger: 'change' }],
        expiry_time:[{ required: true, message: '请设置生效日期' }]
      },
      posterPicurlURL: '',
      fileList: [],
      props: {
        multiple: true,
        emitPath: false,
        value: 'id',
        label: 'name',
        children: 'pro'
      },
      options: [],
      showWeekTimeDialog: false,
      timeArray: [
        {
          startTime: '00:00',
          endTime: '23:59'
        },
        {
          startTime: '00:00',
          endTime: '23:59'
        },
        {
          startTime: '00:00',
          endTime: '23:59'
        },
        {
          startTime: '00:00',
          endTime: '23:59'
        },
        {
          startTime: '00:00',
          endTime: '23:59'
        },
        {
          startTime: '00:00',
          endTime: '23:59'
        },
        {
          startTime: '00:00',
          endTime: '23:59'
        }
      ],
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
    showWindowTitle () {
      return this.formDrug.id == 0 ? '新建套餐' : '编辑套餐'
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
    },

    productOptions: {
      type: Array,
      required: true,
      default() {
        return []
      }
    }
  },

  components: {
    uploadCmp,
    DialogButton,
    SetWeekTime
  },

  created () {
    this.action = this.item.id != 0 ? 'edit' : 'add'
    this.options = JSON.parse(JSON.stringify(this.productOptions))
    //this.posterURL = this.item.img_url
    //this.posterPicurlURL = this.item.picurlPath
    if (this.action === 'edit'){
      this.formDrug = JSON.parse(JSON.stringify(this.item))
      const pack = JSON.parse(JSON.stringify(this.formDrug.pack_product))
      this.formDrug.pack_product = []
      for (let i=0; i<pack.length; i++) {
        this.formDrug.pack_product.push(pack[i].id)
      }
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
      'createPacketItem','getPacketsPageList'
    ]),

    /**
     * 文件上传成功
     * */
    fileUploadSuccess(response, file, fileList) {
      this.formDrug.img_path = response.message
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
      if (this.formDrug.pack_product.length > 6) {
        this.$alert('套餐商品最多添加 6 个！', '提示', {
          confirmButtonText: '知道了'
        })
        return false
      }
      let _date = this.formDrug.expiry_date
      this.formDrug.expiry_date = _date[0] + '/' + _date[1]
      this.formDrug.pack_product = this.getPackProduct()
      let data = this.formDrug
      return data
    },
    /**
     * 添加/编辑药品
     * */
    _saveItems (type) {
      let data = this._setPayload()
      if (!data) {
        return
      }
      this.createPacketItem(data)
        .then(res => {
          if (!res.data.success) {
            this._notify('错误', res.data.message, 'error')
            return
          }

          if (type == 'sale') {
            Packet.sale ({ id: res.data.message.id, issale: 1 })
              .then(res => {
                if (!res.data.success) {
                  this._notify('错误', res.data.message, 'error')
                  return
                }

                this._notify('成功', '操作成功', 'success')
                this.getPacketsPageList({
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
          this.getPacketsPageList({
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
    },

    /*
    * 选择套餐商品变化时
    */
    checkedChange (val) {

    },

     getPackProduct () {
      let pack = JSON.parse(JSON.stringify(this.formDrug.pack_product))
      let opt = JSON.parse(JSON.stringify(this.options))
      let packProduct = []
      for (let i=0; i<pack.length; i++) {
        const id = pack[i]
        for (let i=0; i<opt.length; i++) {
          const o = opt[i].pro
          for (let i=0; i<o.length; i++) {
            if (id == o[i].id){
              packProduct.push(o[i])
            }
          }
        }
      }
      return packProduct
    },

    /*
    * 选择时段
    */
    showSetWeekTime () {
      this.showWeekTimeDialog = true
      if (this.formDrug.expiry_time.indexOf(',') > -1) {
        this.timeArray = []
      } else {
        return
      }

      const timeArr = this.formDrug.expiry_time.split(',')
      for (let i=0; i<timeArr.length; i++) {
        const timeString = timeArr[i].split('-')
        const timeObj = { startTime: timeString[0], endTime: timeString[1] }
        this.timeArray.push(timeObj)
      }
    },

    /*
    * 接收时段设置组件回传
    */
    submitWeekTimeDialog (data) {
      this.showWeekTimeDialog = false
      let arr = data
      let timeString = ''
      for (let i=0; i<arr.length; i++) {
        const st = arr[i].startTime
        const et = arr[i].endTime
        const str = st + '-' + et
        if (i == 0) {
          timeString += str
        } else {
          timeString += ',' + str
        }
      }
      this.formDrug.expiry_time = timeString
    },

    cancelWeekTimeDialog () {
      this.showWeekTimeDialog = false
    }
  },

  watch: {
  }
}
</script>

<style lang="scss">
  .packet-page-edit {
    .el-date-editor .el-range-separator {
      width: 10%;
    }
  }
</style>
