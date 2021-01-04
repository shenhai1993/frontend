<template>
  <!--上传组件-->
  <div style="position:absolute;top: 50%;left: 50%;transform: translate(-50%,-50%)" @click.stop>
    <div class="mUpload-content">
      <el-upload
        class="upload-content toggleImg"
        list-type="picture-card"
        :show-file-list="false"
        :auto-upload="autoUpload"
        :accept="acceptType"
        :data = "uploadData"
        :action="uploadAction"
        :before-upload="beforeUpload"
        :with-credentials="true"
        :limit="8"
        :on-change="handleChange"
        :on-remove="handleRemove"
        :on-preview="handlePreview"
        :file-list="handledFileList"
        multiple>选择图片
<!--        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>-->
      </el-upload>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'mUpload',
    data() {
      return {
        dialogImageUrl: '',
        dialogVisible: false,
        baseUrl: process.env.API_BASE, // 请求基础地址
        uploadData: {
        },
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
      autoUpload: {
        type: Boolean,
        default: false
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
        default: '.png,.jpg,.jpeg,.bmp,gif'
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
        this.uploadData.template_id = this.$route.query.id
        this.uploadData.image = file
        const isLt3M = file.size / 1024 / 1024 < 1
        if (!isLt3M) {
          this.$message.error('上传头像图片大小不能超过 1MB!');
        }
      },
      /**
       * 上传文件后
       * */
      handleChange(file) {
        this.$emit('success', file)
        // if (file.response) {
        //   this.$emit('success', file)
        // }
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
  .toggleImg{
    overflow: hidden;
    .el-upload-list + .el-upload-list__item{
      display: none;}
    .el-upload--picture-card{
      background: #3f94ef;
      border: 0px;
      height: 80px;
      width: 240px;
      border-radius: 15px;
      line-height: 80px;
      text-align: center;
      font-size: 29px;
      color: #ffffff;
    }
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
