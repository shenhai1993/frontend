<template>
  <div class="editAdCustom">
    <div class="editSims-header">{{editData.type == 'image' ? '编辑更换图片：' : '编辑更换文本：'}}</div>
    <el-upload
      v-if="editData.type == 'image'"
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
    <div
      v-else-if="editData.type == 'text'"
      style="font-size: 16px;">
      请输入：<el-input v-model="editData.val" @change="editDataChange" style="width: 70%;"></el-input>
    </div>
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
      fileList: [],
      editData: {}
    }
  },

  computed: {
    ...mapState({
      simsEditAdCustomData: state => state.terminaltemp.simsEditAdCustomData
    })
  },

  created () {
    this.initData(this.simsEditAdCustomData)
  },

  mounted () {

  },

  methods: {
    ...mapMutations([
      'SIMS_EDIT_ADCUSTOM'
    ]),

    ...mapActions([
      'getSimsEditAdCustomData'
    ]),

    initData (v) {
      this.editData = JSON.parse(JSON.stringify(v))
      if (this.editData.type == 'image') {
        this.fileList = [{
          name: '图片',
          url: this.editData.val
        }]
      } else if (this.editData.type == 'text') {

      }
    },

    fileUploadSuccess (response, file, fileList) {
      this.editData = Object.assign({}, this.editData, { val: response.message })
      this.getSimsEditAdCustomData(this.editData)
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

    },

    handleEceed (files, fileList) {
      this.$alert('最多添加1张图片！', '提醒')
    },

    editDataChange () {
      this.getSimsEditAdCustomData(this.editData)
    }
  },

  watch: {
    simsEditAdCustomData (v) {
      this.initData(v)
    }
  }
}
</script>

<style lang="scss">
  .editAdCustom {
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
