<template>
  <el-upload
    :action="uploadAction"
    :on-success="fileUploadSuccess"
    :before-upload="fileUploadPicurlBefore"
    :on-remove="handleRemove"
    :file-list="fileList"
    :limit="1"
    :with-credentials="true"
    :on-exceed="handleEceed"
    list-type="picture"
    accept="image/jpeg, image/jpg, image/png"
    style="width: 90%;">
    <el-button size="small" type="primary">图片上传</el-button>
    <span slot="tip" class="el-upload__tip">&nbsp;&nbsp;&nbsp;&nbsp;仅支持png、jpg格式，不超过 2MB！</span>
  </el-upload>
</template>

<script>
import { Terminaltemp } from '../../static/js/terminaltemp.js'

export default {
  components: {

  },

  props: {
    logoList: {
      type: Array
    }
  },

  data () {
    return {
      uploadAction: process.env.API_BASE + 'products/uploadTrueImage',
      fileList: []
    }
  },

  created () {
    for (let i = 0; i < this.logoList.length; i++) {
      const name = 'logo图'
      this.fileList.push({
        name: name,
        url: this.logoList[i].mainImg
      })
    }

  },

  methods: {
    fileUploadSuccess (response, file, fileList) {
      const name = 'logo图'
      this.fileList.push({
        name: name,
        url: response.message
      })
      this.$emit('logoUpdateEmit', this.fileList)
    },

    fileUploadPicurlBefore (file) {
      const maxSize = 400
      const state = Terminaltemp.fileUploadPicurlBefore(file, maxSize)
      if (state == 1) {
        this.$message({
          message: '仅支持 png、jpg 格式图片！',
          type: 'warning'
        })
        return false
      }
      if (state == 2) {
        this.$message({
          message: '图片大小不超过 ' + maxSize + 'KB !',
          type: 'warning'
        })
        return false
      }
    },

    handleRemove (file, fileList) {
      this.fileList = fileList
      this.$emit('logoUpdateEmit', this.fileList)
    },

    handleEceed (files, fileList) {
      this.$alert('最多添加1张图片，请点击预览列表右上角删除，再重新上传！', '提醒')
    }
  }
}
</script>
