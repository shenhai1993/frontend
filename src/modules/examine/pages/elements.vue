<template>
  <div class="parentConent">
    <!-- header -->
    <headerbar>
      <span slot="submenuName">素材</span>
    </headerbar>
    <!-- container -->
    <div class="templateContainer">
      <!-- 按钮区 -->
      <div class="btn-context">
        <refresh-button v-on:refresh="refresh"></refresh-button>
        <el-button @click="batchOverrule()">
          <i class="fa fa-ban"></i> 驳回
        </el-button>
        <el-button @click="batchAgree()">
          <i class="fa fa-check"></i> 通过
        </el-button>
      </div>
      <!-- 数据表格 -->
      <el-table
        :data="elementsList"
        v-loading="loading"
        height="calc(100% - 80px)"
        stripe
        style="width: 100%"
        @selection-change="onSelectionChange"
      >
        <el-table-column type="selection" width="45"></el-table-column>
        <el-table-column prop="name" label="文件名"></el-table-column>
        <el-table-column prop="duration" label="时长" width="100"></el-table-column>
        <el-table-column prop="size" label="大小" width="100"></el-table-column>
        <el-table-column prop="user.name" label="创建者" width="120"></el-table-column>
        <el-table-column label="创建时间" width="140">
          <template slot-scope="scope">
            <el-tooltip effect="dark" :content="scope.row.created_at" placement="bottom">
              <span>{{ scope.row.created_at | fromnow }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop label="操作" width="100">
          <template slot-scope="scope">
            <template v-if="scope.row.type === 'image'">
              <el-tooltip effect="dark" content="预览" placement="bottom">
                <a class="previewHref" :href="scope.row.path" :data-lightbox="scope.$index">
                  <el-button type="text" size="mini">
                    <i class="fa fa-file-text-o"></i>
                  </el-button>
                </a>
              </el-tooltip>
            </template>

            <template v-if="scope.row.type === 'video'">
              <el-tooltip effect="dark" content="预览" placement="bottom">
                <el-button type="text" @click="playVideo(scope.row.preview_video)" ref="btn" size="mini">
                  <i class="fa fa-file-text-o"></i>
                </el-button>
              </el-tooltip>
            </template>
            <el-tooltip v-if="scope.row.type === 'audio'" effect="dark" content="点击文件名可预览" placement="bottom">
              <el-button type="text" @click="playAudio(scope.row.path)" ref="btn" size="mini" style="color: #0000EE">
                <i class="fa fa-file-text-o"></i>
              </el-button>
            </el-tooltip>
            <template v-if="scope.row.type && scope.row.type == 'webpage'">
              <el-tooltip effect="dark" content="预览" placement="bottom">
                <el-button type="text" @click="playWebPage(scope.row.path)" ref="btn" size="mini">
                  <i class="fa fa-file-text-o"></i>
                </el-button>
              </el-tooltip>
            </template>

            <template v-if="scope.row.type && scope.row.type == 'stream'">
              <el-tooltip effect="dark" content="预览" placement="bottom">
                <el-button type="text" @click="playStream(scope.row.path)" ref="btn" size="mini">
                  <i class="fa fa-file-text-o"></i>
                </el-button>
              </el-tooltip>
            </template>

            <el-tooltip effect="dark" content="驳回" placement="bottom">
              <el-button type="text" size="mini" @click="examineOverrule(scope.row)">
                <i class="fa fa-ban"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="通过" placement="bottom">
              <el-button type="text" size="mini" @click="examineAgree(scope.row)">
                <i class="fa fa-check"></i>
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--video弹出层-->
    <el-dialog title="视频预览" :visible.sync="dialogPlay" width="30%" @close="closeDialog">
     <!-- <video :src="videoUrl" controls autoplay class="video" width="100%"></video>-->
      <flv-video :flvSrc="videoUrl" v-if="dialogPlay"></flv-video>
    </el-dialog>

    <!--webpage弹出层-->
    <el-dialog title="网页|直播流" :visible.sync="dialogWebPage" width="50%" @close="closeIframe">
      <iframe
        :src="htmlUrl"
        width="100%"
        height="500px"
        frameborder="no"
        border="0"
        marginwidth="0"
        marginheight="0"
      ></iframe>
    </el-dialog>
    <el-dialog title="音频预览" class="videoDialog" :visible.sync="dialogAudioPlay" width="30%" @close="closeAudioDialog">
      <audio :src="audioUrl" v-if="dialogAudioPlay" controls style="display:block; margin: 40px auto;"></audio>
    </el-dialog>
    <!-- 驳回弹出层 -->
    <el-dialog @close="cancel('form')" title="驳回" :visible.sync="dialogVisible" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="medium">
        <el-form-item label="驳回原因：" prop="audit_reason">
          <el-input
            v-focus
            autofocus
            type="textarea"
            v-model="form.audit_reason"
            :rows="5"
            placeholder="请输入驳回原因"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取消</el-button>
        <el-button type="primary" @click="submitForm('form')">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import RefreshButton from "@/components/RefreshButton"
import headerbar from "@/components/HeaderBar"
import FlvVideo from '../../element/components/flvVideo'
import { mapState, mapMutations, mapActions } from "vuex"
import http from "../../../../static/js/utils/http";
import $ from "jquery";
import lightbox from "lightbox2"
import "../../../../node_modules/lightbox2/dist/css/lightbox.min.css"
import DialogButton from "@/components/DialogButton"

export default {
  components: {
    RefreshButton,
    headerbar,
    FlvVideo,
    DialogButton
  },
  data() {
    return {
      dialogVisible: false,
      overruleRow: {},
      dialogAudioPlay: false,
      audioUrl: '',
      dialogPlay: false, // 视频弹出窗
      videoUrl: "", // 视频地址
      htmlUrl: "", //网页内容
      dialogWebPage: false, //webpage 弹出框
      selectElementList: [], //选中的素材列表
      form: {
        audit_reason: ""
      },
      rules: {
        audit_reason: [
          { required: true, message: "请输入驳回原因", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    ...mapActions([
      "getElementsList",
      "batchOverruleElements",
      "batchAgreeElements"
    ]),
    ...mapMutations(["UPDATE_LOADING_STATUS"]),

    //预览视频
    playVideo(val) {
      if (val) {
        this.dialogPlay = true;
        this.videoUrl = val;
      } else {
        this.$message({
          message: "视频转码中,暂无法预览",
          type: "warning"
        });
      }
    },
    //关闭视频
    closeDialog() {
      this.videoUrl = ""; //清空数据 关闭视频播放
    },

    //预览网页
    playWebPage(url) {
      this.dialogWebPage = true;
      this.htmlUrl = url;
    },
    playAudio(val) {
      this.dialogAudioPlay = true
      this.audioUrl = val
    },
    closeAudioDialog() {
      this.dialogAudioPlay = false
    },
    closeIframe() {
      this.htmlUrl = "";
    },

    //预览直播流
    playStream(url) {
      this.dialogWebPage = true;
      this.htmlUrl = 'http://cloud.liveqing.com:10080/LivePlayer.html?videoUrl=' + url;
    },

    cancel(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false;
      this._hideDialog("dialogVisible");
    },

    refresh() {
      this.getElementsList();
    },

    batchAgree() {
      this.$confirm("您确定要通过此审核吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (this.selectElementList.length > 0) {
            for (let i = 0; i < this.selectElementList.length; i++) {
              this.batchAgreeElements(this.selectElementList[i]);
            }
          } else {
            this.$notify({
              title: "提示",
              type: "warning",
              message: "请选择要通过的素材"
            });
          }
        })
        .catch(e => {});
    },

    examineAgree(row) {
      this.$confirm("您确定要通过此审核吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.batchAgreeElements(row);
        })
        .catch(e => {});
    },

    examineOverrule(row) {
      this.dialogVisible = true;
      this._showDialog("dialogVisible");
      this.overruleRow = row;
    },

    batchOverrule() {
      this.dialogVisible = true;
      this._showDialog("dialogVisible");
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.selectElementList.length > 0) {
            for (let i = 0; i < this.selectElementList.length; i++) {
              this.batchOverruleElements({
                rows: this.selectElementList[i],
                auditReason: this.form.audit_reason
              });
            }
            this.dialogVisible = false;
            this._hideDialog("dialogVisible");
            this.$refs["form"].clearValidate();
          } else if (Object.keys(this.overruleRow).length !== 0) {
            this.batchOverruleElements({
              rows: this.overruleRow,
              auditReason: this.form.audit_reason
            });
            this.dialogVisible = false
            this._hideDialog("dialogVisible")
          } else {
            this.$notify({
              title: "提示",
              type: "warning",
              message: "请选择要驳回的素材"
            });
          }
        } else {
          return false;
        }
      });
    },

    onSelectionChange(val) {
      console.log(val);
      let files = val.length !== 0 ? val : [];
      this.selectElementList = files;
    },

  },

  computed: {
    ...mapState({
      elementsList: state => state.examine.elementsList,
      loading: state => state.examine.loading
      //selectElementList: state => state.examine.selectElementList
    })
  },

  mounted() {
    this.getElementsList();

    lightbox.option({
      resizeDuration: 200,
      wrapAround: true,
      maxWidth: 1024,
      maxheight: 768,
      showImageNumberLabel: false
    });
  }
};
</script>
<style scoped>
.btn-context {
  margin: 0 0 30px;
}
.previewHref {
  display: inline-block;
  padding: 7px 10px 7px 0;
}
</style>
