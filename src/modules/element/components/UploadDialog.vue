<template>
  <div class="upload-dialog">
    <div style="padding-left:10px">
      <el-button type="danger" icon="el-icon-delete" circle @click="clear()"></el-button>
    </div>
    <el-table
      ref="dialogTable"
      :data="files"
      tooltip-effect="dark"
      style="width: 640px;"
      height="375"
      empty-text="无上传文件"
      @selection-change="onSelectionChange"
    >
      <el-table-column type="selection" width="45"></el-table-column>
      <el-table-column type="index" width="40"></el-table-column>
      <el-table-column prop="name" width="200" label="文件名"></el-table-column>
      <el-table-column prop="size" label="大小" width="90" show-overflow-tooltip></el-table-column>
      <el-table-column prop="progress" label="上传进度" width="200">
        <template slot-scope="scope">
          <span>
            <!-- <span>{{ scope.row.progress }}</span> -->
            <!-- 字符串转数字 -->
            <el-progress :percentage="scope.row.progress >> 0" style="width: 160px;"></el-progress>
            <span v-if="scope.row.speed">
              <span v-if="typeof scope.row.speed !== 'number'">({{ scope.row.speed }})</span>
              <span v-else-if="scope.row.progress !== 100">({{ scope.row.speed | filesize }})</span>
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <div style="display: inline-block" v-if="scope.row.progress !== 100">
            <el-tooltip v-if="!scope.row.isStop" effect="dark" content="暂停" placement="top">
              <el-button type="text" size="mini">
                <i class="fa fa-pause" @click="pause(scope)"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip v-else effect="dark" content="开始" placement="top">
              <el-button type="text" size="mini">
                <i class="fa fa-play" @click="pause(scope)"></i>
              </el-button>
            </el-tooltip>
          </div>
          <el-tooltip effect="dark" content="取消" placement="top">
            <el-button type="text" size="mini">
              <i class="fa fa-close" @click="cancelUpload(scope)"></i>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  data() {
    return {
      index: 0,
      files: [],
      selectedUploadedFiles: [] //选中素材列表
    };
  },

  computed: {
    ...mapState({
      filesState: state => state.element.filesState,
      currentIndex: state => state.element.currentIndex,
      uploading: state => state.element.uploading
    })
  },

  methods: {
    ...mapMutations(["SET_FILE_STATE", "SET_UPLOADING", "SPLICE_UPLOADEDFILES_LIST"]),

    ...mapActions(["addUploadFiles"]),

    clear() {
      this.selectedUploadedFiles.forEach((itemI, indexI)=>{
        //debugger
        this.SPLICE_UPLOADEDFILES_LIST(itemI);
      })
    },

    onSelectionChange(val) {
      console.log(val);
      let files = val.length !== 0 ? val : [];
      this.selectedUploadedFiles = files;
    },

    pause(scope) {
      let index = scope.row.index;
      let isStop = !scope.row.isStop;
      this.SET_FILE_STATE({ index: index, prop: "isStop", value: isStop });
      this.SET_FILE_STATE({ index: index, prop: "speed", value: "已暂停" });
      if (
        !isStop &&
        ((this.currentIndex === index && this.uploading === true) ||
          this.uploading === false)
      ) {
        this.SET_UPLOADING(false);
        this.addUploadFiles({ isResume: true });
      }
    },

    cancelUpload(scope) {
      let index = scope.row.index;
      this.SET_FILE_STATE({
        index: index,
        prop: "isStop",
        value: !scope.row.isStop
      });
      this.SET_FILE_STATE({
        index,
        prop: "isCancel",
        value: !scope.row.isCancel
      });
      console.log("this.filesState:==>", this.filesState);
      if (this.currentIndex === index || this.uploading === false) {
        this.SET_UPLOADING(false);
        this.addUploadFiles({ isResume: true });
      }
    }
  },

  watch: {
    filesState: {
      handler(n) {
        this.files = n.filter(file => {
          return file.isCancel === false;
        });
      },
      deep: true
    }
  }
};
</script>

<style lang="scss">
.upload-dialog {
  .el-table {
    .el-table__body-wrapper {
      overflow-x: hidden;
      overflow-y: auto;
    }
  }
}
</style>
