<template>
  <div class="parentConent">
    <!-- header -->
    <headerbar>
      <span slot="submenuName">播出单</span>
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
        :data="playList"
        v-loading="loading"
        height="calc(100% - 80px)"
        stripe
        style="width: 100%"
        @selection-change="onSelectionChange"
      >
        <el-table-column type="selection" width="45"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="direction" label="屏幕方向" align="center" width="80">
          <template slot-scope="scope">{{ scope.row.direction === '1' ? '竖屏' : '横屏' }}</template>
        </el-table-column>
        <el-table-column label="播放日期" width="120" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <template
              v-if="scope.row.schedule.date.start === scope.row.schedule.date.end"
            >{{ scope.row.schedule.date.start }}</template>
            <template v-else>
              <p>{{ scope.row.schedule.date.start }}</p>
              <p>|</p>
              <p>{{ scope.row.schedule.date.end }}</p>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="播出时段" width="120" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <p>{{ scope.row.schedule.time.start }}</p>
            <p>|</p>
            <p>{{ scope.row.schedule.time.end }}</p>
          </template>
        </el-table-column>
        <el-table-column label="素材大小" width="100">
          <template slot-scope="scope">{{ scope.row.total_size | filesize }}</template>
        </el-table-column>
        <el-table-column prop="trees" label="发布至组" width="120">
          <template slot-scope="scope" v-if="scope.row.trees.length">
            <span
              class="column-treesname"
              v-for="item in scope.row.trees"
              v-bind:key="item.id"
            >{{ item.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="user.name" label="制作人" width="120"></el-table-column>
        <el-table-column label="制作时间" width="100">
          <template slot-scope="scope">
            <el-tooltip effect="dark" :content="scope.row.created_at" placement="bottom">
              <span>{{ scope.row.created_at | fromnow }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop label="操作" width="120">
          <template slot-scope="scope">
            <!-- <el-tooltip effect="dark" content="预览" placement="bottom">
              <el-button type="text" size="mini">
                <i class="fa fa-file-text-o"></i>
              </el-button>
            </el-tooltip>-->
            <el-tooltip class="item" effect="dark" content="预览" placement="bottom">
              <el-button type="text" size="mini" @click="_preview(scope.row)">
                <i class="fa fa-play-circle"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="驳回" placement="bottom">
              <el-button type="text" @click="examineOverrule(scope.row)" size="mini">
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

    <!-- 预览弹出层 -->
    <el-dialog title="预览" width="800px" :visible.sync="previewShow">
      <preview :playlist="currentPlaylist"></preview>
    </el-dialog>
  </div>
</template>

<script>
import RefreshButton from "@/components/RefreshButton";
import headerbar from "@/components/HeaderBar";
import { mapState, mapMutations, mapActions } from "vuex";
import http from "../../../../static/js/utils/http";
import $ from "jquery";
import lightbox from "lightbox2";
import "../../../../node_modules/lightbox2/dist/css/lightbox.min.css";
import preview from "../../playlistMutipleTPL/lib/preview";

export default {
  components: {
    RefreshButton,
    headerbar,
    preview
  },
  data() {
    return {
      dialogVisible: false,
      overruleRow: {},
      selectPlaylist: [], //选中的播出单列表
      form: {
        audit_reason: ""
      },
      rules: {
        audit_reason: [
          { required: true, message: "请输入驳回原因", trigger: "blur" }
        ]
      },
      previewShow: false,
      currentPlaylist: null
    };
  },
  methods: {
    ...mapActions([
      "getPlayList",
      "getPreviewContentsById",
      "batchAgreePlaylist",
      "batchOverrulePlaylist"
    ]),

    refresh() {
      this.getPlayList();
    },

    cancel(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false;
      this._hideDialog("dialogVisible");
    },

    batchAgree() {
      this.$confirm("您确定要通过此审核吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (this.selectPlaylist.length > 0) {
            for (let i = 0; i < this.selectPlaylist.length; i++) {
              this.batchAgreePlaylist(this.selectPlaylist[i]);
            }
          } else {
            this.$notify({
              title: "提示",
              type: "warning",
              message: "请选择要通过的播出单"
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
          this.batchAgreePlaylist(row);
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
          if (this.selectPlaylist.length > 0) {
            for (let i = 0; i < this.selectPlaylist.length; i++) {
              this.batchOverrulePlaylist({
                rows: this.selectPlaylist[i],
                auditReason: this.form.audit_reason
              });
            }
            this.dialogVisible = false;
            this._hideDialog("dialogVisible");
            this.$refs["form"].clearValidate();
          } else if (Object.keys(this.overruleRow).length !== 0) {
            this.batchOverrulePlaylist({
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
      this.selectPlaylist = files;
    },

    _preview(playlist) {
      this.getPreviewContentsById(playlist.contents).then(res => {
        this.currentPlaylist = res.data.message.data;
      });
      // this.currentPlaylist = playlist
      this.previewShow = true;
    }
  },

  computed: {
    ...mapState({
      playList: state => state.examine.playList,
      loading: state => state.examine.loading
    })
  },

  mounted() {
    this.getPlayList();

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
.column-treesname {
  display: inline-block;
  margin-right: 15px;
}
</style>
