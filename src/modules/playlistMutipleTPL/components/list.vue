<template>
  <div class=" playlist-list-content">
    <div class="flexBox">
        <div class="flexBox-left">
          <side-bar :ischangeLayout='true'>
            <span slot='title' class="title">分组</span>
            <group-panel :edit="false" slot="component" gtype="trees" :autoclick="false" @onclick="changeTree" :filter="true"></group-panel>
          </side-bar>
        </div>
        <div class="flexBox-right">
          <div >
              <el-menu slot="component" class="el-menu-vertical-demo" mode="horizontal" :default-active="activedPath" router>
                <el-menu-item index="/playlistmutipletpl/lists"   :class="{active : activedPath == 'lists'}">
                  <!--<i class="el-icon-circle-check-outline"></i>-->
                  <span>可用播出单</span>
                  <el-tag size="mini" type="info">{{ avaiable }}</el-tag>
                </el-menu-item>
                <el-menu-item index="/playlistmutipletpl/published" :class="{active : activedPath == 'published'}">
                  <!--<i class="el-icon-circle-check"></i>-->
                  <span>已发布播出单</span>
                  <el-tag size="mini" type="info">{{ published }}</el-tag>
                </el-menu-item>
                <el-menu-item index="/playlistmutipletpl/audit" :class="{active : activedPath == 'audit'}">
                  <!--<i class="fa fa-bell fa-to-el"></i>-->
                  <span>待审核播出单</span>
                  <el-tag size="mini" type="info">{{ inaudit }}</el-tag>
                </el-menu-item>
                <el-menu-item index="/playlistmutipletpl/unpassed" :class="{active : activedPath == 'unpassed'}">
                  <!--<i class="fa fa-ban fa-to-el"></i>-->
                  <span>未过审播出单</span>
                  <el-tag size="mini" type="info">{{ ban }}</el-tag>
                </el-menu-item>
                <el-menu-item index="/playlistmutipletpl/expired" :class="{active : activedPath == 'expired'}">
                  <!--<i class="el-icon-remove-outline"></i>-->
                  <span>过期播出单</span>
                  <el-tag size="mini" type="info">{{ expired }}</el-tag>
                </el-menu-item>
              </el-menu>
          </div>
          <border-box>
            <div slot="borderboxContent">
              <refresh-button v-on:refresh="refresh"></refresh-button>
              <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
                <el-button @click="deletePlaylists" plain :disabled="disabledTrashPlaylistBtn">
                  <i class="fa fa-trash"></i>
                </el-button>
              </el-tooltip>
              <router-link to="edit" slot="subbutton" v-if='!isexpiredPlayLists'>
                <el-tooltip class="item" effect="dark" content="新建播出单" placement="bottom">
                  <el-button class="subbutton">
                    <i class="fa fa-plus"></i>
                  </el-button>
                </el-tooltip>
              </router-link>
              <el-button class="subbutton" @click="voiceDialog" :disabled="voiceStatus" type="primary" v-if="activedPath==='published'">
                <i class="el-icon-magic-stick">弹窗</i>
              </el-button>
              <el-input v-model="searchText" placeholder="请输入播出单名称" style="width: 240px;vertical-align: middle"></el-input>
              <el-button type="primary" size="small" plain :disabled="disabledExportBtn" @click="exportPlaylist">
                <i class="el-icon-s-unfold">导出播出单</i>
              </el-button>
              <el-button type="primary" size="small" plain @click="loadExportList">
                <i class="el-icon-s-unfold">已导出列表</i>
              </el-button>
            </div>

          </border-box>
          <div class="tableBox">
            <div class="tableContent">
              <div class="btnList">
                <el-button-group>
                  <el-button @click="onAllData" :class="{active:index===7}">全部</el-button>
                  <el-button @click="onToggleBtn(0)" :class="{active:index===0}">主播</el-button>
                  <el-button @click="onToggleBtn(1)" :class="{active:index===1}">插播</el-button>
                  <el-button @click="onToggleBtn(2)" :class="{active:index===2}">垫片</el-button>
                  <el-button @click="onToggleBtn(3)" :class="{active:index===3}">弹窗</el-button>
                  <el-button @click="onToggleBtn(4)" :class="{active:index===4}">点播</el-button>
                  <el-button @click="onToggleBtn(5)" :class="{active:index===5}">互动</el-button>
                  <el-button @click="onToggleBtn(6)" :class="{active:index===6}">同步</el-button>
                </el-button-group>
              </div>
              <tab-list :tabData="showList"
                        ref="chaildlist"
                        @itemData="itemData"
                        @handleSelectionChange="handleSelectionChange"
                        @click_isrelease="click_isrelease"
                        @_preview="_preview"
                        @_delete="_delete"
                        @click_more="click_more"
              ></tab-list>
            </div>
          </div>
          <transition name="el-zoom-in-top">
            <div class="terminalInfoMask" v-if="showDetails" @click="click_close">
              <data-details id='terminalInfo' :activePlaylist="activePlaylist" v-on:showDetails="onShowDetails" @click.native.stop
                                :clearIntervalFromParent.sync='clearIntervalFromParent'>
              </data-details>
            </div>
          </transition>
          <el-dialog width="500px" title="弹窗播出单" :visible="showGalleryWindow" @close="click_cancel">
            <el-form :model="formData" :rules="rules" ref="formData" label-width="100px" class="demo-ruleForm">
              <el-form-item label="语音内容：" prop="content">
                <el-input v-model="formData.content"></el-input>
              </el-form-item>
              <el-form-item label="是否弹窗：" prop="pop">
                <el-checkbox v-model="formData.pop"></el-checkbox>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <dialog-button @clickCancel="click_cancel" @clickConfirm="submitForm('formData')"></dialog-button>
            </div>

          </el-dialog>
          <el-dialog @close="previewClose" title="预览" width="800px" :visible.sync="previewShow"  :close-on-click-modal="false">
            <preview ref="preview" :playlist="currentPlaylist" v-if="previewShow"></preview>
          </el-dialog>

          <el-dialog width="800px" title="已导出列表" :visible="showExportWindow" @close="click_cancel_export">
            <refresh-button v-on:refresh="loadExportList"></refresh-button>
            <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
              <el-button @click="deleteExport" plain :disabled="disabledTrashExportBtn">
                <i class="fa fa-trash"></i>
              </el-button>
            </el-tooltip>
            <el-table class="terminals" v-loading="loading" ref="multipleTableExport"
                      :row-key="exportLists.id"
                      :data="exportLists"
                      tooltip-effect="dark"
                      stripe
                      @selection-change="handleSelectionChangeExport"
                      empty-text="暂无导出列表">
              <el-table-column type="selection" width="55" align="center"></el-table-column>
              <el-table-column label="导出播出单" width="300" align='center'>
                <template slot-scope="scope">
                  {{ scope.row.names.join(',') }}
                </template>
              </el-table-column>
              <el-table-column align="center" prop="size" label="文件大小"></el-table-column>
              <el-table-column align="center" prop="created_at" label="导出时间" width="200"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <a :href="scope.row.path"
                    target="_blank"
                    class="buttonText">下载</a>
                </template>
              </el-table-column>
            </el-table>
          </el-dialog>
          </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import BorderBox from '@/components/BorderBox'
import preview from '../lib/preview'
import TabList from './tableList'
import RefreshButton from '@/components/RefreshButton.vue'
import Status from '@static/js/utils/status'
import api from '@static/js/api/index'
import dataDetails from './details'
import DialogButton from '@/components/DialogButton'
import GroupPanel from '@/modules/group/components/group'
import SideBar from '@/components/SideBar.vue'
import http from '@static/js/utils/http'

export default {
  data () {
    return {
      groupId: 0,
      audit: 0,
      loading: false,
      previewShow: false,
      currentPlaylist: null,
      clearIntervalFromParent: false,
      voiceStatus: true,
      formData: {
        ids: [],
        content: '',
        pop: false
      },
      activeTabPaneName: 0,
      rules: {
        content: [ { required: true, message: '请输入语音内容', trigger: 'blur' },
          { min: 3, max: 100, message: '长度在 3 到 100 个字符', trigger: 'blur' }]
      },
      showGalleryWindow: false,
      showDetails: false,
      index: 7,
      searchText: '',
      activePlaylist: {},
      playlist:[],
      arrStu: true,
      Status,
      disabledExportBtn: true,
      showExportWindow: false,
      exportLists: [], // 已导出列表
      disabledTrashExportBtn: true,
      selectedExportIds: [],
      disabledTrashPlaylistBtn: true,
    }
  },

  components: {
    RefreshButton, TabList, BorderBox, preview, dataDetails, DialogButton,GroupPanel,SideBar
  },

  created () {
    api.getAudit('playlists').then(res => {
      this.audit = res.data.playlist.status
    })
  },

  mounted () {
    let objAuth = this.$cookies.get('authUser')
    this.groupId = (typeof objAuth === 'string') ? JSON.parse(objAuth).group_id : objAuth.group_id

    let ismpdpPage = this.$route.path.indexOf('/mpdp/playlist') > -1
    this.IS_MPDP_PAGE(ismpdpPage)
    this.getPlaylists(this.groupId)
    this.getContentsLists()

  },

  computed: {
    ...mapState({
      playlists: state => state.playlistMutipleTPL.playlists,
      expiredPlaylists: state => state.playlistMutipleTPL.expiredPlaylists
    }),

    avaiable () {
      return this.playlists.filter(playlist => {
        return playlist.status === Status.AVAILABLE
      }).filter(file => {
        if (this.arrStu){
          return file
        } else {
          return file.type == Number(this.activeTabPaneName)
        }
      }).length || 0
    },

    published () {
      return this.playlists.filter(playlist => {
        return playlist.status === Status.PUBLISHED
      }).filter(file => {
        if (this.arrStu){
          return file
        } else {
          return file.type == Number(this.activeTabPaneName)
        }
      }).length || 0
    },

    inaudit () { // 审核中 1
      return this.playlists.filter(playlist => {
        return playlist.status === Status.AUDIT
      }).filter(file => {
        if (this.arrStu){
          return file
        } else {
          return file.type == Number(this.activeTabPaneName)
        }
      }).length || 0
    },

    ban () { // 驳回 2
      return this.playlists.filter(playlist => {
        return playlist.status === Status.UNPASSED
      }).filter(file => {
        if (this.arrStu){
          return file
        } else {
          return file.type == Number(this.activeTabPaneName)
        }
      }).length || 0
    },

    expired () { // 过期 4
      return this.playlists.filter(playlist => {
        return playlist.status === Status.EXPIRED
      }).filter(file => {
        if (this.arrStu){
          return file
        } else {
          return file.type == Number(this.activeTabPaneName)
        }
      }).length || 0
    },
    isexpiredPlayLists () {
      return this.$route.path.indexOf('playlistmutipletpl/expired') > -1
    },
    activedPath () {
      let path = this.$route.path

      return path.split('/').pop()
    },
    showList () {
      if (this.searchText ===''){
        return this.playlists.filter(list => {
          return list.status === this.type
        }).filter(file => {
          if (this.arrStu){
            return file
          } else {
            return file.type == Number(this.activeTabPaneName)
          }
        })
      } else {
        let test = this.playlists.filter(list => {
          return list.status === this.type
        }).filter(file => {
          return file.name.indexOf(this.searchText) !== -1
        })
        return test
      }
    },
    type () {
      let route = this.$route.path.split('/')
      let path = route.pop()

      switch (path) {
        case 'audit':
          return Status.AUDIT
        case 'unpassed':
          return Status.UNPASSED
        case 'expired':
          return Status.EXPIRED
        case 'published':
          return Status.PUBLISHED
      }

      return Status.AVAILABLE
    }
  },

  methods: {
    ...mapMutations([
      'DEL_PLAYLIST', 'IS_MPDP_PAGE', 'SET_PLAYITENDATA', 'EDIT_PLAYLIST_DATA'
    ]),
    ...mapActions([
      'getFileList', 'getPlaylists', 'getContentsLists', 'getContentsById', 'addVoice', 'deletePlaylist', 'pubStopPlaylist', 'getExpiredPlaylists','getPlaylistByTreeId'
    ]),
    onToggleBtn(val){
      this.index = val
      this.arrStu = false
      this.activeTabPaneName = val
    },
    changeTree(node){
      this.getPlaylistByTreeId(node.id)
    },
    onAllData(){
      this.arrStu = true
      this.index = 7
     // this.getPlaylists(this.groupId)
    },
    refresh () {
      this.getPlaylistWithLoading()
    },

    getPlaylistWithLoading () {
     this.getPlaylists(this.groupId)
    },
    /**
     * * 监听编辑列表
     * **/
    itemData(val) {
      this.SET_PLAYITENDATA(val)
    },
    voiceDialog(){
      this.showGalleryWindow = true
    },
    resetForm(val) {
      this.$refs[val].resetFields()
    },
    handleSelectionChange(val){
      this.formData.ids = []
      for (let i = 0; i < val.length; i++) {
        if (this.formData.ids.indexOf(val[i].id) === -1) {
          this.formData.ids.push(val[i].id)
        }
      }
      this.disabledTrashPlaylistBtn = this.voiceStatus = this.disabledExportBtn = val.length == 0
    },
    click_cancel() {
      this.$refs.chaildlist.clearSelection()
      this.resetForm('formData')
      this.showGalleryWindow = false
    },
    submitForm() {
     let res = this.addVoice(this.formData)
     res.then(res => {
       if (res.data.success === true){
         this.click_cancel()
         this.$notify.success({
           title: '操作成功！'
         }).catch(err => {
           this.$notify.error({
             title: `操作失败: ${err.message}!`
           })
         })
       }
     })
    },
    _delete (item, index) {
      this.$confirm('此操作将永久删除该播出单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {group_id: this.groupId}
        let res = this.deletePlaylist({item, data})
        res.then(res => {
          this.$notify.success({
            title: '操作成功！'
          })
        }).catch(err => {
          this.$notify.error({
            title: `操作失败: ${err.message}!`
          })
        })
      }).catch(e => {})
    },

    click_isrelease (item) {
      let msg = '是否要发布此播出单'
      if (item.status === 3) {
        msg = '是否要停止此播出单'
      }
      this.$confirm( msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=> {
        let res = this.pubStopPlaylist({item, groupId: this.groupId})
        res
          .then(res => {
            this.$notify.success({
              title: '操作成功！'
            })
          })
          .catch(err => {
            this.$notify.error({
              title: `操作失败: ${err.message}!`
            })
          })
      }).catch(e => {})
    },

    _preview (row) {
      let _that = this
      this.currentPlaylist = []
      this.getContentsById(row.contents).then(
      res => {
        row.contents.forEach((item)=>{
          res.data.message.data.forEach((items)=>{
            if (item === items.id) {
              _that.currentPlaylist.push(items)
            }
          })
        })
        // this.currentPlaylist = res.data.message.data
      })
      // this.currentPlaylist = playlist
      this.previewShow = true
    },

    previewClose () {
     // this.currentPlaylist = []
    },

    click_more (index, data) {
      this.activePlaylist = data
      this.showDetails = true
      this.clearIntervalFromParent = false
    },

    click_close () {
      this.clearIntervalFromParent = true
    },

    onShowDetails (showDetails) {
      this.showDetails = showDetails
    },

    // 导出播出单
    exportPlaylist() {
      let data = {
        ids: this.formData.ids
      }
      let loading = this.$loading({
          lock: true,
          text: '正在导出中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      http.post('playlists/export', data)
        .then(res => {
          if (res.data.success === true){
            this.$notify({
              title: '成功',
              type: 'success',
              message: '导出成功!'
            })
            setTimeout(() => {
              this.$refs.chaildlist.clearSelection()
              this.loadExportList()
            }, 1000);
          }
          loading.close();
        })
        .catch(err => {
          loading.close();
          console.log(err)
        })
    },

    click_cancel_export() {
      this.showExportWindow = false
    },

    loadExportList() {
      this.showExportWindow = true
      this.loading = true
      http.get('playlists/export-list')
        .then(res => {
          this.loading = false
          if (res.data.success === true){
            this.exportLists = res.data.message
          }
        })
        .catch(err => {
          this.loading = false
          console.log(err)
        })
    },

    handleSelectionChangeExport(val){
      this.selectedExportIds = []
      for (let i = 0; i < val.length; i++) {
        if (this.selectedExportIds.indexOf(val[i].id) === -1) {
          this.selectedExportIds.push(val[i].id)
        }
      }
      this.disabledTrashExportBtn = val.length == 0
    },

    async deleteExport() {
      let loading = this.$loading({
        lock: true,
        text: '删除中, 请稍后...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      let res = await http.delete('playlists/export', {ids: this.selectedExportIds}).catch(err => {loading.close();})
      loading.close();
      if (res.data.success === true) {
        this.loadExportList()
      }
    },

    deletePlaylists() {
      this.$confirm('此操作将永久删除选中的播出单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let loading = this.$loading({
          lock: true,
          text: '删除中, 请稍后...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        let res = http.delete('playlists/batch', {ids: this.formData.ids})
          .then(res => {
            loading.close();
            this.$notify({
              title: '成功',
              type: 'success',
              message: '删除成功!'
            })
            if (res.data.success === true) {
              this.refresh()
            }
          })
          .catch(err => {loading.close();})
      }).catch(e => {})
    }

  }
}
</script>
<style lang="scss" scoped>
  .tableBox{
    overflow-x:hidden;
    overflow-y: auto;
    height: calc(100% - 99px);
    padding: 15px;
  }
  .btnList{
    background-color: #f5f7fa;
    border-bottom: 1px solid #e4e7ed;
    margin: 0;
  }
  .tableContent{
    background: #fff;
    padding-bottom: 15px;
    border: 1px solid #dcdfe6;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
  }
  .flexBox{
    overflow: hidden;
    height: 100%;
    .flexBox-right{
      width: calc(100% - 200px);
      float: right
    }
    .flexBox-left{
      float: left;
      height: 100%;
      border-right:1px solid #d0e0f2;
      width: 200px;
    }
  }
</style>
<style lang="scss">
.btnList{
  .el-button{
    border-width: 0px;
    background-color: transparent;
    border-radius: 0px;
  }
  .el-button.active{
    background: white;
    border-right-width: 1px;
    border-left-width: 1px;
    border-right-color: #dcdfe6;
  }
  .el-button--medium{
    padding: 12px 20px;
  }
}
.el-menu-item.active {
  background: #ffffff !important;
}
.playlist-list-content{
  height: 100%;
  .el-table {
    height: calc(100% - 120px);
    &.isexpired {
      height: 100%;
    }
  }
  .border-box {
    .el-button {
    margin-right: 5px;
    &:nth-last-child(1) {
      margin: 0
    }
    }
  }
  .fa-plus {
    margin-right: 0;
  }
  .fa-check, .fa-caret-right,
  .fa-arrow-circle-o-right {
    color: #67C23A;
  }
  i.fs {
    font-size: 18px;
  }
  .fa-pencil {
    color: #606266;
  }
  .fa-pencil, .fa-remove {
    margin-right: 5px;
  }
}
h4.playlisttype {
    font-size: 14px;
    font-weight: 600;
    border-bottom: 1px solid #ccc;
    padding-left: 20px;
    line-height: 30px;
    background: #eaeff4;
  }

.terminalInfoMask {
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 100;
  background-color: transparent;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  #terminalInfo {
    overflow: auto;
    width: 450px;
    height: 100%;
    float: right;
    background-color: #fff;
    padding: 15px 30px;
    box-shadow: 0 2px 5px rgba(0,0,0,.16), 0 2px 10px rgba(0, 0, 0, .12);
  }

}
</style>
