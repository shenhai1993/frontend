<template>
  <div class="parentConent">
    <!-- header -->
    <headerbar>
      <span slot='submenuName'>授权</span>
    </headerbar>
    <!-- container -->
    <div class="templateContainer">
      <!-- 按钮区 -->
      <div class="btn-context">
        <refresh-button v-on:refresh="refresh"></refresh-button>
        <!-- 选择文件按钮 -->
        <el-tooltip effect="dark" content="选择本地文件上传" placement="bottom">
          <el-button @click="showUploadDialog = true" plain><i class="fa fa-cloud-upload"></i></el-button>
        </el-tooltip>
      </div>
      <div v-loading="loading">
        <div class="rows-box">
          <label>终端上限：</label>
          <span>{{ license.termianl_max }}</span>
        </div>
        <div class="rows-box">
          <label>UUID：</label>
          <span>{{ license.uuid }}</span>
        </div>
        <div class="rows-box">
          <label>生效日期：</label>
          <span>{{ license.start_date }}</span>
        </div>
        <div class="rows-box">
          <label>失效日期：</label>
          <span>{{ license.end_date }}</span>
        </div>
      </div>

    </div>

    <!-- 上传文件dialog -->
    <el-dialog title="上传授权文件" width="500px" @close="dialogUploadFile" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="showUploadDialog">
      <el-form  label-width="100px"  class="demo-dynamic">
        <el-form-item label="选择授权文件">
          <el-upload
            ref="upload"
            class="upload-demo"
            :action="uploadAction"
            :limit="1"
            :with-credentials="true"
            :on-success="fileUploadSuccess"
            :on-error="fileOnError"
            :on-progress="fileProgress"
            :show-file-list="false"
            :auto-upload="true">
            <el-input id="filesName" v-model="fileName"></el-input>
            <el-button size="small" type="primary">选择</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item v-show="fileName !== ''">
          <div style="width: 260px">
            <el-progress :text-inside="true" :stroke-width="18" :percentage="percentage" status="success"></el-progress>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showUploadDialog = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import RefreshButton from '@/components/RefreshButton'
import headerbar from '@/components/HeaderBar'
import http from '../../../../static/js/utils/http'
import LiteMD5 from '../../../../static/js/utils/litemd5'

export default {
  components: {
    RefreshButton, headerbar
  },

  data() {
    return {
      showUploadDialog: false,
      percentage: 0,
      fileName: '',
      uploadAction: process.env.API_BASE + 'license'
    }
  },

  computed: {
    ...mapState({
      loading: state => state.setting.loading,
      license: state => state.setting.license
    })
  },

  methods: {
    ...mapMutations([
      'GET_LICENSE', 'UPDATE_LOADING_STATUS'
    ]),

    refresh () {
      this.UPDATE_LOADING_STATUS(true)
      setTimeout(() => {
        this.UPDATE_LOADING_STATUS(false)
        this.GET_LICENSE()
      }, 300)
    },

    fileProgress (event, file, fileList) {
      this.percentage = Math.floor(event.percent)
      this.fileName = file.name
    },

    fileUploadSuccess (response, file, fileList) {
      if(response.success){
        this.showUploadDialog = false
        this.$notify({
          title: '成功',
          type: 'success',
          message: '授权文件上传成功！'
        })
        sessionStorage.setItem('license', JSON.stringify(response.message))
        this.GET_LICENSE()
      }
    },

    fileOnError (err, file, fileList) {
      let that = this
      this.$notify({
        title: '失败',
        type: 'error',
        message: JSON.parse(err.message).message
      })
      this.showUploadDialog = false
    },

    dialogUploadFile () {
      this.fileName = ''
      this.percentage = 0
      this.$refs.upload.clearFiles()
    }
  },

  mounted () {
    this.GET_LICENSE()
  }
}
</script>

<style lang="scss" scoped>
  .parentConent {
    height: 100%;
    width: 100%;
  }
  .btn-context {
    width: 100%;
    height: 80px;
  }
  .fileUploadBtn {
    visibility: hidden;
    height: 0px;
  }
  .el-input--medium {
    display: inline-block;
    width: 260px;
    margin-right: 10px;
  }
  .paperPlane-rightBtn {
    float: right;
  }
  .rows-box {
    width: 100%;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    label {
      width: 110px;
      text-align: right;
      float: left;
      font-size: 14px;
      color: #606266;
      line-height: 40px;
      padding: 0 12px 0 0;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }
    span {
      display: inline-block;
      width: 160px;
    }
  }
</style>
