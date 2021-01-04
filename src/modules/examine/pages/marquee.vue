<template>
  <div class="parentConent">
    <!-- header -->
    <headerbar>
      <span slot="submenuName">跑马灯</span>
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
        :data="marqueesList"
        v-loading="loading"
        height="calc(100% - 80px)"
        stripe
        style="width: 100%"
        @selection-change="onSelectionChange"
      >
        <el-table-column type="selection" width="45"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="content" label="播出内容" width="200"></el-table-column>
        <el-table-column align="center" label="跑马灯速度">
          <template slot-scope="scope">
            <p>{{ scope.row.speed | speed2Str }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="interval" label="间隔时间(分钟)" width="120"></el-table-column>
        <el-table-column align="center" label="播出日期" width="180">
          <template slot-scope="scope">
            <p>{{ scope.row.startdate }} - {{ scope.row.enddate }}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="播出时段" width="120">
          <template slot-scope="scope">
            <p>{{ scope.row.starttime }} - {{ scope.row.endtime }}</p>
          </template>
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
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="预览" placement="bottom">
              <el-button type="text" size="mini" @click="previewMarquee(scope.row)">
                <i class="fa fa-file-text-o"></i>
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
    <el-dialog title="预览" :visible.sync="dialogPreview" width="500px">
      <p class="previewText">{{ currentContent }}</p>
    </el-dialog>
  </div>
</template>

<script>
import RefreshButton from "@/components/RefreshButton";
import headerbar from "@/components/HeaderBar";
import { mapState, mapMutations, mapActions } from "vuex";
import http from "../../../../static/js/utils/http";

export default {
  components: {
    RefreshButton,
    headerbar
  },
  data() {
    return {
      dialogVisible: false,
      dialogPreview: false,
      currentContent: "",
      overruleRow: {},
      selectMarqueesList: [], //选中的素材列表
      form: {
        audit_reason: ""
      },
      rules: {
        audit_reason: [
          { required: true, message: "请输入驳回原因", trigger: "blur" }
        ]
      },
      run: false,
      pWidth: ""
    };
  },

  filters: {
    speed2Str(val) {
      if (!val) {
        return "";
      }
      switch (val) {
        case 2:
          return "慢";
          break;
        case 3:
          return "适中";
        case 4:
          return "快";
        default:
          break;
      }
    }
  },

  computed: {
    ...mapState({
      marqueesList: state => state.examine.marqueesList,
      loading: state => state.examine.loading
    })
  },

  mounted() {
    this.getMarqueeList();
  },

  methods: {
    ...mapActions(["getMarqueeList","batchOverruleMarquees","batchAgreeMarquees"]),

    refresh() {
      this.getMarqueeList();
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
          if (this.selectMarqueesList.length > 0) {
            for (let i = 0; i < this.selectMarqueesList.length; i++) {
              this.batchAgreeMarquees(this.selectMarqueesList[i]);
            }
          } else {
            this.$notify({
              title: "提示",
              type: "warning",
              message: "请选择要通过的跑马灯"
            });
          }
        })
        .catch(e => {});
    },

    batchOverrule() {
      this.dialogVisible = true;
      this._showDialog("dialogVisible");
    },

    examineOverrule(row) {
      this.dialogVisible = true;
      this._showDialog("dialogVisible");
      this.overruleRow = row;
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.selectMarqueesList.length > 0) {
            for (let i = 0; i < this.selectMarqueesList.length; i++) {
              this.batchOverruleMarquees({
                rows: this.selectMarqueesList[i],
                auditReason: this.form.audit_reason
              });
            }
            this.dialogVisible = false;
            this._hideDialog("dialogVisible");
            this.$refs["form"].clearValidate();
          } else if (Object.keys(this.overruleRow).length !== 0) {
            this.batchOverruleMarquees({
              rows: this.overruleRow,
              auditReason: this.form.audit_reason
            });
            this.dialogVisible = false
            this._hideDialog("dialogVisible")
          } else {
            this.$notify({
              title: "提示",
              type: "warning",
              message: "请选择要驳回的跑马灯"
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
      this.selectMarqueesList = files;
    },

    examineAgree(row) {
      this.$confirm("您确定要通过此审核吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.batchAgreeMarquees(row);
        })
        .catch(e => {});
    },

    previewMarquee(row) {
      this.currentContent = row.content;
      this.dialogPreview = true;
    }
  }
};
</script>
<style lang="scss" scoped>
.btn-context {
  margin: 0 0 30px;
}
.column-treesname {
  display: inline-block;
  margin-right: 15px;
}
.previewText {
  word-wrap: break-word;
}
</style>
