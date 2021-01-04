<template>
  <!--通用上传组件-->
  <div>
    <div class="mUpload-content">
      <el-upload
        class="upload-content solaImg"
        list-type="picture-card"
        :accept="acceptType"
        :action="uploadAction"
        :before-upload="beforeUpload"
        :with-credentials="true"
        :limit="1"
        :on-change="handleChange"
        :on-remove="handleRemove"
        :on-preview="handlePreview"
        :file-list="handledFileList"
        multiple>
        <i class="el-icon-plus"></i>
        <img v-if="posterURL" :src="posterURL" class="avatar">
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import http from '@static/js/utils/http'
  export default {
    name: 'mUpload',
    data() {
      return {
        dialogImageUrl: '',
        dialogVisible: false,
        baseUrl: process.env.API_BASE, // 请求基础地址
        fileList: [],
        file:[]
      }
    },
    props: {
      /**
       * 传入的需显示的文件列表
       * */
      fileListData: {
        type: Array,
        default() {
          return []
        }
      },
      uploadAction:{
        type: String,
        default:''
      },
      posterURL:{
        type: String,
        default:''
      },
      /**
       * 允许上传的格式
       * */
      acceptType: {
        type: String,
        default: '.xls,.xlsx,.txt,.doc,.docx,.pdf,.png,.jpg'
      },
      /**
       * 是否禁止编辑
       * */
      disabled: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      /**
       * 序列化文件列表
       * */
      handledFileList() {
        // const arr = []
        // const _this = this
        // this.fileListData.map((file) => {
        //   arr.push({
        //     id: file.id,
        //     name: file.fileName,
        //     url: `${_this.baseUrl}file/download/${file.fileId}`
        //   })
        // })
        // return arr
      }
    },
    methods: {
      /**
       * 上传文件控制
       * */
      beforeUpload(file) {
        const isLt3M = file.size / 1024 / 1024 < 3
        if (!isLt3M) {
          this.$message.error('上传头像图片大小不能超过 3MB!');
        }
      },
      /**
       * 上传文件后
       * */
      handleChange(file) {
        if (file.response) {
          this.$emit('success', file)
        }
      },
      /**
       * 删除对应文件
       * */
      handleRemove({ response }) {
        if (response) {
          const id = response.fileId
        }
      },
      /**
       * 预览下载对应文件
       * */
      handlePreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      }
    }
  }
</script>

<style scoped lang="scss">
  .mUpload-content{
    display: inline-block;
    min-width: 200px;
    .tip-text{
      display: inline-block;
      margin-left: 18px;
      font-size: 12px;
      color: #bbb;
    }
  }
</style>
<style lang="scss">
  .disabled .el-upload--picture-card {
    display: none;
  }
  .solaImg{
    width: 200px;
    height: 150px;
    overflow: hidden;
    .el-upload-list + .el-upload-list__item{
      display: none;}
    .el-upload{
      position: relative;
      .avatar{
        position: absolute;
        top: -1px;
        left: -1px;
        width: 149px;
        height: 149px;
        border-radius: 4px;
      }
    }
  }
</style>
