<template>
  <div class="parentConent">
    <!-- header -->
    <headerbar>
      <span slot='submenuName'>升级文件</span>
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
        <!-- <el-tooltip effect="dark" content="下发记录" placement="bottom">
          <el-button class="paperPlane-rightBtn" plain @click="gotoUpgradeList">下发记录</el-button>
        </el-tooltip> -->
      </div>

      <!-- 数据表格 -->
      <el-table :data="upgradeList" stripe height="calc(100% - 80px)" v-loading="loading" style="width: 100%">
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <el-table-column prop="name" label="文件名"></el-table-column>
        <el-table-column prop="size" label="文件大小" width="200">
          <template slot-scope="scope">
            {{ scope.row.size | filesize }}
          </template>
        </el-table-column>
        <el-table-column prop="user_name" label="上传人" width="200"></el-table-column>
        <el-table-column prop="created_at" label="上传时间" width="200">
          <template slot-scope="scope">
            <el-tooltip effect="dark" :content="scope.row.created_at" placement="bottom">
              <span>{{ scope.row.created_at | fromnow }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" width="80" align="center">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="下发" placement="bottom">
              <el-button type="text" size="mini" @click="publishFilesDialog(scope.row)">
                <i class="fa fa-paper-plane-o"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="bottom">
              <el-button type="text" size="mini" @click="remove(scope.row)">
                <i class="fa fa-trash"></i>
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 上传文件dialog -->
    <el-dialog title="上传升级文件" width="500px" @close="dialogUploadFile" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="showUploadDialog">
      <el-form  label-width="100px"  class="demo-dynamic">
        <el-form-item label="选择升级文件">
          <el-upload
            ref="upload"
            class="upload-demo"
            :action="uploadAction"
            :limit="1"
            :with-credentials="true"
            :before-upload="fileCheck"
            :on-success="fileUploadSuccess"
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
        <!-- <el-button type="primary" @click="showUploadDialog = false">上传</el-button> -->
        <el-button @click="showUploadDialog = false">取消</el-button>
      </div>
    </el-dialog>

    <!-- 下发记录dialog -->
    <el-dialog title="选择分组" width="500px" @close="cancelGroupDialog" :visible.sync="showGroupDialog" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="dialog-group-panel">
        <group-panel ref="tree" v-on:oncheck="checkedGroupNode" :strictly="strictlyStu" gtype='trees' :showCheckbox="true" filter></group-panel>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="requestPublish">下发</el-button>
        <el-button @click="cancelGroupDialog">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import RefreshButton from '@/components/RefreshButton'
import headerbar from '@/components/HeaderBar'
import GroupPanel from '@/modules/group/components/group'
import http from '../../../../static/js/utils/http'
import LiteMD5 from '../../../../static/js/utils/litemd5'

export default {
  components: {
    RefreshButton, headerbar, GroupPanel
  },

  data() {
    return {
      showUploadDialog: false,
      strictlyStu: true,
      showGroupDialog: false,
      percentage: 0,
      fileName: '',
      currentPublishFileId: '',
      groupNodes: {},
      uploadAction: process.env.API_BASE + 'upgrades'
    }
  },

  computed: {
    ...mapState({
      upgradeList: state => state.setting.upgradeList,
      loading: state => state.setting.loading
    })
  },

  methods: {
    ...mapMutations([
      ''
    ]),

    ...mapActions([
      'getUpgradeList'
    ]),

    refresh () {
      this.getUpgradeList()
    },

    save () {
      this.$confirm('您确定要下发选中的升级文件吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
         http.put('/upgrades/publish/' + this.currentPublishFileId, {
           "group_ids": [1]
         })
          .then(res => {
            if (res.status === 200) {
              this.$notify({
                title: '成功',
                type: 'success',
                message: '文件已下发!'
              })
              return 'ok'
            }
          })
          .catch(err => {
            console.log(err)
          })
      }).catch((e) => {})
    },

    remove ( row ) {
      this.$confirm(`您确定要删除${row.name}文件吗？删除后无法恢复!`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.removeFiles(row)
      }).catch((e) => {})
    },

    removeFiles ( rows ) {
      http.delete('/upgrades/' + rows.id)
        .then(res => {
          if (res.status === 200) {
            this.$notify({
              title: '成功',
              type: 'success',
              message: `${rows.name}文件已删除!`
            })
            setTimeout(this.getUpgradeList, 300)
            return 'ok'
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    // gotoUpgradeList () {
    //   this.$router.push({ path: 'setting/upgrade/list' })
    // },

    errorUpload (err) {
      console.log(err)

    },

    // 自定义上传
    async uploadFiles (item) {
      let formData = new FormData()
      formData.append('file', item.file)
      formData.append('type', 'SKU')
      http.post('upgrades', formData)
        .then(res => {
          console.log(res)
          if (res.status === 200) {
            this.fileUploadSuccess(res.data)
          } else {
            this.showUploadDialog = false
            this.$refs.upload.clearFiles()
            this.$notify({
              title: '错误',
              type: 'warning',
              message: '文件上传失败，请重新上传！'
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    async fileCheck (file) {
      let liteMD5 = new LiteMD5()
      let _md5 = await liteMD5.md5(file)
      http.get('/upgrades', {
        'name': file.name,
        'md5': _md5
      })
        .then(res => {
          if ( res.data.message.length > 0 ) {
            this.$notify({
              title: '错误',
              type: 'warning',
              message: file.name + '文件已存在，请勿重复上传！'
            })
            this.showUploadDialog = false
            this.$refs.upload.abort()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    fileProgress (event, file, fileList) {
      this.percentage = Math.floor(event.percent)
      this.fileName = file.name
    },

    fileUploadSuccess (response, file, fileList) {
      if(response.success){
        this.showUploadDialog = false
        this.$refs.upload.clearFiles()
        this.$notify({
          title: '成功',
          type: 'success',
          message: '文件上传成功！'
        })
        this.getUpgradeList()
      }
    },

    dialogUploadFile () {
      this.fileName = ''
      this.percentage = 0
      this.$refs.upload.clearFiles()
    },

    publishFilesDialog (rows) {
      this.showGroupDialog = true
      this.currentPublishFileId = rows.id
    },

    checkedGroupNode (node) {
      this.groupNodes = node
    },

    requestPublish () {
      http.put('/upgrades/publish/' + this.currentPublishFileId, {
         "tree_ids": this.groupNodes.checked.checkedKeys
        })
        .then(res => {
          if ( res.status === 200 ) {
            this.$notify({
              title: '成功',
              type: 'success',
              message: '文件下发成功！'
            })
          }
          this.cancelGroupDialog()
        })
        .catch(err => {
          console.log(err)
        })
    },

    cancelGroupDialog () {
      this.showGroupDialog = false
      this.$refs.tree.$refs.tree.setCheckedKeys([])
    }
  },

  mounted () {
    this.getUpgradeList()
  }
}
</script>

<style scoped>
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
  .dialog-group-panel {
    height: 400px;
    overflow: auto;
  }
  .paperPlane-rightBtn {
    float: right;
  }
</style>
