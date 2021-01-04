<template>
  <div class="editSimsAdsingle">
    <div class="editSims-header">编辑更换图片：</div>
    <el-upload
      :action="uploadAction"
      :on-success="fileUploadSuccess"
      :before-upload="fileUploadPicurlBefore"
      :on-remove="handleRemove"
      :file-list="fileList"
      :limit="1"
      :with-credentials="true"
      :on-exceed="handleEceed"
      list-type="picture-card"
      accept="image/jpeg, image/jpg, image/png">
      <i class="el-icon-plus"></i>
    </el-upload>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { Terminaltemp } from '../../static/js/terminaltemp.js'

export default {
  components: {

  },

  props: {

  },

  data () {
    return {
      uploadAction: process.env.API_BASE + 'products/uploadTrueImage',
      fileList: []
    }
  },

  computed: {
    ...mapState({
      simsUpdateAdsingleData: state => state.terminaltemp.simsUpdateAdsingleData
    })
  },

  created () {
    this.getFileList(this.simsUpdateAdsingleData)
  },

  methods: {
    ...mapMutations([
      'SIMS_UPDATE_ADSINGLE'
    ]),

    ...mapActions([
      'getSimsUpdateAdsingleData'
    ]),

    getFileList (v) {
      const data = JSON.parse(JSON.stringify(v))
      for (let i = 0; i < data.length; i++) {
        const name = 'logo图' + (i + 1)
        this.fileList.push({
          name: name,
          url: data[i].mainImg
        })
      }
    },

    setFileList (v) {
      const data = JSON.parse(JSON.stringify(v))
      let newData = []
      for (let i = 0; i < data.length; i++) {
        newData.push({
          mainImg: data[i].url
        })
      }
      this.getSimsUpdateAdsingleData(newData)
    },

    fileUploadSuccess (response, file, fileList) {
      const name = '广告图' + fileList.length
      this.fileList.push({
        name: name,
        url: response.message
      })
      this.setFileList(this.fileList)
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
      this.setFileList(this.fileList)
    },

    handleEceed (files, fileList) {
      this.$alert('最多添加1张图片！', '提醒')
    }
  }
}
</script>

<style lang="scss">
  .editSimsAdsingle {
    width: 90%;
    margin: 0 auto;
    .editSims-header {
      font-size: 16px;
      padding: 20px 0 10px;
    }
    .el-upload-list--picture-card .el-upload-list__item, .el-upload--picture-card {
      width: 103px;
      height: 61px;
      border-radius: 0;
    }
    .el-upload--picture-card {
      background-image: url(../../static/images/icon-plus-upload.png);
      background-size: 100%;
    }
    .el-upload--picture-card i {
      display: none;
    }
  }
</style>
