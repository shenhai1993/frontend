<template>
  <el-dialog
    :visible="showEditImage"
    @close="closeDialog"
    title="图片更换"
    append-to-body
    width="400px"
    center>
    <el-form :model="editData" ref="editData" size="mini" label-width="100px">
      <el-form-item
        prop="val"
        label="图片上传："
        :rules="{
          required: true, message: '请上传图片'
        }">
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
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="commitEditData('editData')" type="primary">完 成</el-button>
      <el-button @click="closeDialog">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { Terminaltemp } from '../../static/js/terminaltemp.js'

export default {
  components: {

  },

  props: {
    showImage: {
      type: Boolean
    },

    currData: {
      type: Object
    },

    index: {
      type: Number
    }
  },

  data () {
    return {
      uploadAction: process.env.API_BASE + 'products/uploadTrueImage',
      showEditImage: this.showImage,
      editData: this.currData,
      fileList: []
    }
  },

  created () {
    this.fileList.push({
      name: 'image',
      url: this.editData.val
    })
  },

  methods: {
    commitEditData (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.showEditImage = false
          this.$emit('editImageEmit', JSON.parse(JSON.stringify(this.editData)), this.index)
        } else {
          return false
        }
      })
    },

    closeDialog () {
      this.$confirm('正在编辑，确认关闭吗？', '提示', {
        type: 'warning'
      }).then(() => {
          this.showEditImage = false
          this.$emit('editImageEmit')
      }).catch(() => {})
    },

    fileUploadSuccess (response, file, fileList) {
      this.editData.val = response.message
      this.$refs['editData'].clearValidate('val')
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
      this.editData.val = ''
    },

    handleEceed (files, fileList) {
      this.$alert('最多添加一张图片，请点击预览框右上角删除，再重新上传！', '提醒')
    }
  }
}
</script>
