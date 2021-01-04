.<template>
  <div class="text-center welcome">
    <el-col :span="12" :offset="6" style="color: #fff;">
      <div class="logo text-center">
        <img src="../../../../static/images/eshow.png" />
      </div>
    </el-col>
    <el-col :span="10" :offset="7">

      <p class="message-info" v-if="license && license.code != 'ok'">授权文件不存在或已失效，请联系TCL工作人员。
        <br/>
        <span v-if="license && license.end_date">失效日期：{{ license.end_date }}</span>
      </p>
      <p class="message-info">如果要生成License，请将下面显示的UUID码发送给TCL工作人员。</p>
      <div class="uuid-code">{{ hostuuid }}</div>
      <div>
        <el-form>
          <el-form-item>
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
              <div class="position-box">
                <label>选择授权文件</label>
                <el-input id="filesName" v-model="fileName"></el-input>
                <el-button size="small" type="primary">选择</el-button>
                <div class="progress-box" v-show="fileName !== ''">
                  <el-progress :text-inside="true" :stroke-width="18" :percentage="percentage" status="success"></el-progress>
                </div>
              </div>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
    </el-col>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import http from '../../../../static/js/utils/http'
import LiteMD5 from '../../../../static/js/utils/litemd5'

export default {
  data() {
    return {
      percentage: 0,
      fileName: '',
      uploadAction: process.env.API_BASE + 'license'
    }
  },

  computed: {
    ...mapState({
      hostuuid: state => state.license.hostuuid,
      license: state => state.license.license
    })
  },

  methods: {
    ...mapActions([
      'getHostUuid'
    ]),

    ...mapMutations([
      'GET_LICENSE'
    ]),

    fileProgress (event, file, fileList) {
      this.percentage = Math.floor(event.percent)
      this.fileName = file.name
    },

    fileUploadSuccess (response, file, fileList) {
      if(response.success){
        this.$notify({
          title: '成功',
          type: 'success',
          message: '授权文件上传成功！'
        })
        sessionStorage.setItem('license', JSON.stringify(response.message))
        let that = this
        setTimeout(function () {
          that.fileName = ''
          that.percentage = 0
          that.$refs.upload.clearFiles()
        }, 1000)
        this.$router.push('/login')
      }
      else {
        this.$notify({
          title: '失败',
          type: 'error',
          message: response.message
        })
      }
    },

    fileOnError (err, file, fileList) {
      let that = this
      this.$notify({
        title: '失败',
        type: 'error',
        message: JSON.parse(err.message).message
      })
      setTimeout(function () {
        that.fileName = ''
        that.percentage = 0
        that.$refs.upload.clearFiles()
      }, 1000)
    }
  },

  mounted () {
    this.getHostUuid()
    this.GET_LICENSE()
  }
}
</script>

<style lang="scss" scoped>
  .welcome {
    position: absolute;
    width: calc(100% - 64px);
    top: 10%;
    .logo {
      font-size: 60px;
      color: #409EFF;
      margin-top: 10%;
    }
    .message-info {
      font-size: 18px;
      color: #606266;
      line-height: 30px;
      text-align: center;
    }
    .uuid-code {
      font-size: 30px;
      color: #606266;
      line-height: 40px;
      margin: 60px 0 20px;
    }
    .upload-demo {
      text-align: center;
      width: 100%;
      div.position-box {
        position: relative !important;
        margin-right: -100px !important;
        label {
          position: absolute;
          display: inline-block;
          top: 0;
          left: -100px;
        }
      }
    }
    .fileUploadBtn {
      visibility: hidden;
      height: 0px;
    }
    .progress-box {
      margin-top: 20px;
      width: 260px;
    }
    .el-input--medium {
      width: 260px;
      margin-right: 10px;
    }
  }
</style>
