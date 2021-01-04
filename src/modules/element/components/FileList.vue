<!--
  Copyright (c) 2017 tclbusiness.com, Inc. All Rights Reserved

  @file FileList.vue
  @author: chenxi(chxi@tcl.com) TCL peking
-->

<template>
  <div class="content">
    <!-- 功能按钮区 -->
    <div class="p-10 operate_box">
      <refreshbutton v-on:refresh="refresh"></refreshbutton>
      <!-- 选择文件按钮 -->
      <el-button type="text" @click="selectFiles" ><i class="fa fa-cloud-upload"></i> 本地上传</el-button>
      <!-- 添加网页 -->
      <el-button type="text" @click="_showDialog('showWebpageDialog')" ><i class="el-icon-platform-eleme"></i>  添加网页</el-button>
      <!-- 添加直播流 -->
      <el-button type="text" @click="_showDialog('showStreamDialog')" ><i class="fa fa-cloud-upload"></i> 添加直播流</el-button>
      <!-- 删除按钮 -->
      <el-button type="text" @click="remove" :disabled="selectedFiles.length === 0" ><i class="el-icon-delete-solid"></i> 删除选中的文件</el-button>
<!--      <el-tooltip effect="dark" content="删除选中的文件" placement="bottom">-->
<!--        <el-button plain @click="remove" :disabled="selectedFiles.length === 0">-->
<!--          <i class="el-icon-delete"></i></el-button>-->
<!--      </el-tooltip>-->

      <div class="item right" style="width:180px;">
        <!-- <span>容量 {{ disk.disk_used }} / {{ disk.disk_total }}</span>
        //<span class="right"><a href="#">升级</a></span>
        <el-progress text-inside :stroke-width="14" :percentage="disk.disk_rates" :status="progress"></el-progress> -->
      </div>

      <!-- 真实的选择文件按钮 -->
      <input type="file" multiple class="fileUploadBtn" @change="onFilesChange"
            accept=".png,.jpg,.jpeg,.gif,.bmp,.mp4,.mp3,.mov,.mkv,.avi,.wma, .divx,.wmv,.m4v,.webm,.ogv,.mpeg,.mpg,.ts,.rmvb,.rm,.asf,.f4v,.3gp,.flv">

      <!-- 切换文件列表和card -->
      <!-- <el-tooltip class="item right" effect="dark" :content="switchTooltip" placement="bottom">
        <el-button size="medium" plain @click="showCard = !showCard">
          <i :class="{ 'el-icon-menu': !showCard, 'fa fa-table': showCard }"></i>
        </el-button>
      </el-tooltip>-->
    </div>
    <div style="padding-left: 10px;padding-bottom: 10px">
      <!-- 选择素材类型 -->
      <el-button round @click="openFile('all')"  size="mini" :type="fileType=='all'?'primary' : ''">全部</el-button>
      <el-button round @click="openFile('image')"  size="mini" :type="fileType=='image'?'primary' : ''">图片</el-button>
      <el-button round @click="openFile('video')"  size="mini" :type="fileType=='video'?'primary' : ''">视频</el-button>
      <el-button round @click="openFile('audio')"  size="mini" :type="fileType=='audio'?'primary' : ''">音频</el-button>
      <el-button round @click="openFile('webpage')"  size="mini":type="fileType=='webpage'?'primary' : ''">网页</el-button>
      <el-button round @click="openFile('stream')"  size="mini":type="fileType=='stream'?'primary' : ''">直播流</el-button>
      <el-select v-model="fileStatus" placeholder="请选择素材状态" size="mini" style="width:100px;" @change="changeFileStatus">
        <el-option label="全部" value="all"></el-option>
        <el-option label="空闲中" value="0"></el-option>
        <el-option label="审核中" value="1"></el-option>
        <el-option label="驳回" value="2"></el-option>
        <el-option label="使用中" value="3"></el-option>
      </el-select>
      <el-input v-model="searchText" placeholder="快速过滤" class="searchText" style="width: 200px"></el-input>
      <el-tooltip content="高级搜索">
        <el-button @click="showAdvanceWindow = true" size="mini">
          <i class="fa fa-search-plus"></i>
        </el-button>
      </el-tooltip>
    </div>
    <el-dialog width="500px" title="高级搜索" :visible="showAdvanceWindow" @close="click_cancel_search">
      <el-form :model="searchForm" ref="searchForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="关键字：" prop="skey">
          <el-input v-model="searchForm.skey" placeholder="请输入搜索关键词"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <dialog-button @clickCancel="click_cancel_search" @clickConfirm="submitSearchForm()"></dialog-button>
      </div>
    </el-dialog>
    <!-- 素材文件列表，无分页 -->
    <el-table v-if="!showCard"
              ref="multipleTable"
              :data="fiterFiles"
              tooltip-effect="dark"
              highlight-current-row height="calc(100% - 90px)"
              style="width: 100%;"
              stripe
              empty-text="您尚未上传文件"
              v-loading="loading"
              :default-sort = "{prop: 'updated_at', order: 'descending'}"
              @selection-change="onSelectionChange">
      <el-table-column type="selection" width="45">
      </el-table-column>
      <el-table-column type="index" width="50">
      </el-table-column>
      <el-table-column  prop="status"
                        label="状态"
                        width="50"
                        align="center">
        <template slot-scope="scope">
          <!-- 0 可用， 1 审核， 2 驳回， 3 使用 -->
          <el-tooltip v-if="scope.row.status === 0" effect="dark" content="空闲中" placement="bottom">
            <i class="fa fa-coffee"></i>
          </el-tooltip>
          <el-tooltip v-if="scope.row.status === 1" effect="dark" content="审核中" placement="bottom">
            <i class="fa fa-search-plus"></i>
          </el-tooltip>
          <el-tooltip v-if="scope.row.status === 2" effect="dark"  :content="`未通过: ${scope.row.audit_reason}`" placement="bottom">
            <i class="fa fa-ban"></i>
          </el-tooltip>
          <el-tooltip v-if="scope.row.status === 3" effect="dark" content="使用中" placement="bottom">
            <i class="fa fa-check-circle"></i>
          </el-tooltip>
          <el-tooltip v-if="scope.row.status === 4" effect="dark" content="转码中" placement="bottom">
            <i class="fa fa-spinner fa-spin"></i>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column  show-overflow-tooltip
                        prop="name"
                        width="240"
                        label="文件名">
        <template slot-scope="scope">
          <div>
            <el-tooltip v-if="scope.row.type === 'image'" effect="dark" content="点击文件名可预览" placement="bottom">
            <a :href="scope.row.path" data-lightbox="preview">
              {{ scope.row.name }}
            </a>
            </el-tooltip>
            <el-tooltip v-else-if="scope.row.type === 'video'" effect="dark" content="点击文件名可预览" placement="bottom">
                <el-button type="text" @click="playVideo(scope.row.preview_video)" ref="btn" size="mini" style="color: #0000EE">
                  {{ scope.row.name }}
                </el-button>
            </el-tooltip>
            <el-tooltip v-else-if="scope.row.type === 'audio'" effect="dark" content="点击文件名可预览" placement="bottom">
              <el-button type="text" @click="playAudio(scope.row.path)" ref="btn" size="mini" style="color: #0000EE">
                {{ scope.row.name }}
              </el-button>
            </el-tooltip>
            <span v-else>{{ scope.row.name }}</span>
          </div>
          <span class="icon-colorful">
            <span v-if="scope.row.type && scope.row.type === 'stream'" class="fa fa-link">({{ scope.row.path }})</span>
            <span v-if="scope.row.type && scope.row.type === 'webpage'" class="fa fa-link"><a :href="scope.row.path" target="blank">({{ scope.row.path }})</a></span>
          </span>
        </template>
      </el-table-column>
      <el-table-column  prop="duration"
                        label="时长"
                        width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.type === 'image' || scope.row.type === 'stream' || scope.row.type === 'webpage'"></span>
          <span v-else>{{ scope.row.duration }}</span>
        </template>
      </el-table-column>
      <el-table-column  prop="size"
                        label="大小"
                        show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.type === 'stream' || scope.row.type === 'webpage'"></span>
          <span v-else>{{ scope.row.size }}</span>
        </template>
      </el-table-column>
      <el-table-column  prop="resolution"
                        label="分辨率"
                        width="100"
                        show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.type === 'stream' || scope.row.type === 'webpage'"></span>
          <span v-else>{{ scope.row.resolution }}</span>
        </template>
      </el-table-column>
      <el-table-column  prop="user.name"
                        label="创建者"
                        width="120"
                        show-overflow-tooltip>
      </el-table-column>
      <!-- <el-table-column  prop="status"
                        label="已使用"
                        width="120">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="使用中" placement="bottom">
            <el-icon v-if="scope.row.status === '1'" name="time"></el-icon>
          </el-tooltip>
        </template>
      </el-table-column> -->
      <el-table-column  prop="updated_at"
                        label="更新日期"
                        width="120">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row.updated_at" placement="bottom">
            <span>{{ scope.row.updated_at | fromnow }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       width="100">
        <template slot-scope="scope">
          <!-- <el-tooltip effect="dark" content="预览" placement="bottom">
            <el-button
              type="text"
              size="small">
              <div v-if="scope.row.type === 'image'">
                <a :href="scope.row.path" data-lightbox="roadtrip">
                  <i class="fa fa-eye"></i>
                </a>
              </div>
            </el-button>
          </el-tooltip> -->
          <div v-if="scope.row.status !== 3">
            <el-tooltip effect="dark" content="修改" placement="bottom">
              <el-button type="text" size="mini">
                <i class="fa fa-pencil" @click="edit(scope.row, scope.$index, files)"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除文件" placement="bottom">
              <el-button type="text" size="mini">
                <i class="fa fa-trash" @click="_delete(scope.row)"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip v-if="scope.row.type === 'image' || scope.row.type === 'video'" effect="dark" content="下载" placement="bottom">
              <el-button type="text" size="mini">
                <i class="fa fa-download" @click="download(scope.row.path,scope.row.name)"></i>
              </el-button>
            </el-tooltip>
          </div>
          <div v-else>
            <el-tag type="info">使用中</el-tag>
            <el-tooltip v-if="scope.row.type === 'image' || scope.row.type === 'video'" effect="dark" content="下载" placement="bottom">
              <el-button type="text" size="mini">
                <i class="fa fa-download" @click="download(scope.row.path,scope.row.name)"></i>
              </el-button>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="showCard" style="height: calc(100% - 35px); overflow-y: auto">
      <el-row :gutter="10">
        <el-col :sm="6" :md="4" :lg="4" v-for="item in fiterFiles" :key="item.id" class="margin-bot10">
          <div class="grid-content">
             <div class="fileBox" v-if="item.type === 'image'"> <a :href="item.path" data-lightbox="preview"><img :src="item.path" :alt="item.name"></a></div>
             <div class="fileBox" v-else-if="item.type === 'video'"><video :src="item.path" controls="controls"></video></div>
             <div class="fileBox" v-else-if="item.type === 'audio'"><audio :src="item.path" class="audioBox" controls="controls"></audio></div>
             <div class="fileBox fontBox" v-else>
               <p>{{item.name}}</p>
               <p>{{item.path}}</p>
             </div>
            <div class="handleBox">
               <div v-if="item.status !== 3">
                 <el-tooltip effect="dark" content="删除文件" placement="bottom">
                   <el-button type="text" size="mini">
                     <i class="fa fa-trash" @click="_delete(item)" style="color: #ffffff"></i>
                   </el-button>
                 </el-tooltip>
               </div>
               <div v-else>
                 <span>使用中</span>
               </div>
             </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 网页dialog -->
    <el-dialog
      title="网页"
      placeholder="请输入网页地址"
      :visible.sync="showWebpageDialog"
      width="500px"
      modal
      modal-append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      show-close
      lock-scroll>
      <el-form :model="webpage" :rules="webpage_rules" ref="webpage" label-width="60px">
        <el-form-item label="名称" prop="name">
          <el-input v-focus  v-model="webpage.name" placeholder="请输入网页的名称"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="path">
          <el-input placeholder="请输入网页的地址" v-model="webpage.path" class="input-with-select">
           <!-- <el-select v-model="webpage.protocol" slot="prepend" style="float: left">
              <el-option label="http://" value="http://"></el-option>
              <el-option label="https://" value="https://"></el-option>
            </el-select>-->
          </el-input>
        </el-form-item>
      </el-form>
        <div slot="footer" class="dialog-footer">
          <!-- <el-button type="primary" @click="saveStream('stream')">保存</el-button>
          <el-button @click="cancel">取消</el-button> -->
          <dialog-button @clickCancel="cancel" @clickConfirm="saveStream('webpage')" confirmText="保存"></dialog-button>
        </div>
    </el-dialog>

    <!-- 直播流dialog -->
    <el-dialog
      title="直播流"
      placeholder="请输入直播流地址"
      :visible.sync="showStreamDialog"
      width="500px"
      modal
      modal-append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      show-close
      lock-scroll>
      <el-form :model="stream" :rules="stream_rules" ref="stream" label-width="60px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="stream.name" autofocus  placeholder="请输入直播流的名称"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="path">
          <el-input placeholder="请输入直播流的地址" v-model="stream.path" class="input-with-select">
            <!--<el-select v-model="stream.protocol" slot="prepend">
              <el-option label="http://" value="http://"></el-option>
              <el-option label="https://" value="https://"></el-option>
            </el-select>-->
          </el-input>
        </el-form-item>
      </el-form>
        <div slot="footer" class="dialog-footer">
          <!-- <el-button type="primary" @click="saveStream('stream')">保存</el-button>
          <el-button @click="cancel">取消</el-button> -->
          <dialog-button @clickCancel="cancel" @clickConfirm="saveStream('stream')" confirmText="保存"></dialog-button>
        </div>
    </el-dialog>

    <!-- lightbox 2 -->
    <div class="hidden">
      <a v-for="(file, index) in fileList" :key="index" :href="file.path" data-lightbox="roadtrip">{{ file.name }}</a>
    </div>
    <!-- end of lightbox 2 -->

    <!-- 修改素材名dialog -->
    <el-dialog
      title="修改文件名"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="showEditDialog"
      width="500px"
    >
      <el-form>
        <el-form-item label="文件名" label-width="100">
          <el-input v-focus autofocus v-model="editFile.name" auto-complete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <dialog-button @clickCancel="_hideDialog('showEditDialog')" @clickConfirm="save"></dialog-button>
      </div>
    </el-dialog>

    <el-dialog title="视频预览" class="videoDialog" :visible.sync="dialogPlay" width="30%" @close="closeDialog">
      <!--<video :src="videoUrl" controls autoplay class="video"
             width="100%"></video>-->
      <flv-video :flvSrc="videoUrl" :vType="vType" v-if="dialogPlay"></flv-video>
    </el-dialog>
    <el-dialog title="音频预览" class="videoDialog" :visible.sync="dialogAudioPlay" width="30%" @close="closeAudioDialog">
      <audio :src="audioUrl" v-if="dialogAudioPlay" controls style="display:block; margin: 40px auto;"></audio>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import FileSaver from 'file-saver'
import $ from 'jquery'
import lightbox from 'lightbox2'
import '../../../../node_modules/lightbox2/dist/css/lightbox.min.css'

import refreshbutton from '@/components/RefreshTextButton.vue'
import { checkURL, checkWebpageURL, formatFileSize, copy } from '../../../../static/js/utils/utils.js'
import DialogButton from '@/components/DialogButton'
import FlvVideo from './flvVideo'
import http from '@static/js/utils/http'
import { Loading } from 'element-ui';

export default {
  components: {
    refreshbutton,
    FlvVideo,
    DialogButton
  },

  // 加载数据
  mounted () {
    // this.groupId = JSON.parse(this.$cookies.get('authUser')).group_id
    let objAuth = this.$cookies.get('authUser')
    this.groupId = (typeof objAuth === 'string') ? JSON.parse(objAuth).group_id : objAuth.group_id
    let docId = this.$route.path.split("/")[3]
    this.SET_DIRECTORY_ID(docId)
    this.getFiles()

    lightbox.option({
      'resizeDuration': 200,
      'wrapAround': true,
      'maxWidth': 1024,
      'maxheight': 768,
      'showImageNumberLabel': false
    })
  },

  // 监控router的变化，根据path获取type
  watch: {
    '$route': function (n, o) {
      try {
        // this.switchType()
        // 重置右边筛选
        this.SET_FILETYPE('all')
        this.searchText = ''
        this.searchForm.skey = ''
        this.getFiles()
      } catch (e) {}
    },

    /* 'fileList': function (n, o) {
      this.files = this.fileList
      this.switchType()
    }, 好像没用 这段代码 */

    showWebpageDialog (val) {
      this.$refs.webpage.resetFields()
      if (!val) {
        this._resetWebpage()
      }
    },

    showStreamDialog (val) {
      this.$refs.stream.resetFields()
      if (!val) {
        this._resetStream()
      }
    },

    searchText (val) {
      if (this.searchText === '') {
        this.files = this.fileList
        return
      }
      this.files = this.fileList.filter(file => {
        return file.name.indexOf(val) !== -1
      })
      // this.$refs.multipleTable.data = this.files.filter(file => {
      //   return file.name.indexOf(val) !== -1
      // })
    }
  },

  data () {
    return {
      selectType: 'all',
      groupId: 0,
      file: {},
      files: [],
      editFile: {},
      showCard: false,
      checkAll: false,
      loading: false,
      // searchData: '',
      searchText: '', // 搜索文件名
      fileStatus: 'all',
      isIndeterminate: false,
      showEditDialog: false,
      showWebpageDialog: false,
      showStreamDialog: false,
      switchTooltip: '切换显示',
      dialogPlay: false, // 视频弹出窗
      videoUrl: '', // 视频地址
      dialogAudioPlay: false,
      audioUrl: '',
      vType: 'flv',
      showAdvanceWindow: false,
      searchForm: {
        // fileType: 'all',
        skey: '',
      },
      webpage: {
        name: '',
        path: '',
        type: 'webpage'
        // protocol: 'http://'
      },
      stream: {
        name: '',
        path: '',
        type: 'stream'
        //protocol: 'http://'
      },
      webpage_rules: {
        name: [
          { required: true, message: '请输入网页的名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        path: [
          { validator: checkWebpageURL, trigger: 'blur' },
          { required: true, message: '请输入网页地址', trigger: 'blur' }
        ]
      },
      stream_rules: {
        name: [
          { required: true, message: '请输入直播流的名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        path: [
          { validator: checkURL, trigger: 'blur' },
          { required: true, message: '请输入直播流的地址', trigger: 'blur' }
        ]
      }
    }
  },

  computed: {
    ...mapState({
      router: state => state.router,
      disk: state => state.element.disk,
      fileType: state => state.element.fileType,
      fileList: state => state.element.fileList,
      selectedFiles: state => state.element.selectedFiles,
      directory_id: state => state.element.directory_id,

      images: function () {
        return this.fileList
      },

      // 对数据源fileList进行本地过滤
      fiterFiles: function () {
        let files = [];
        if (this.fileType === 'all' && this.fileStatus === 'all') {
          files = this.fileList
        } else if (this.fileStatus === 'all'){
          files = this.fileList.filter(file => file.type === this.fileType)
        } else if (this.fileType === 'all') {
          files = this.fileList.filter(file => file.status === Number(this.fileStatus))
        } else {
          files = this.fileList.filter(file => file.type === this.fileType && file.status === Number(this.fileStatus))
        }
        let val = this.searchText.trim()
        if(val != '') {
          files = files.filter(file => {
            return file.name.indexOf(val) !== -1
          })
        }
        return files
      },
    }),

    progress: function () {
      if (this.disk.disk_rates <= 50) {
        return ''
      } else {
        if (this.disk.disk_rates >= 80) return 'exception'
        else return 'success'
      }
    }
  },

  methods: {
    ...mapMutations([
      'SET_FILETYPE', 'SET_SELECTED_FILES', 'SET_FILE_PROPERT_BY_INDEX', 'SET_DIRECTORY_ID', 'SET_FILELIST'
    ]),

    ...mapActions([
      'getDisk', 'getFileList', 'addUploadFiles', 'setSelectedFiles', 'removeFile', 'setFilename', 'setFileProperty', 'createStream', 'modifyStream'
    ]),

    refresh () {
      this.getFiles()
    },
    download(path,name){
      FileSaver.saveAs(path,name)
    },
    syncDisk () {
      this.getDisk()
    },
    /**
     * 预览视频
     * */
    playVideo(val) {
     // let fileExtension = val.substring(val.lastIndexOf('.') + 1)
      if (val){
        this.dialogPlay = true
        this.videoUrl = val
        this.vType = 'flv'
      } else {
        this.getFileList({type: this.selectType})
        this.$message({
          message: '视频转码中,请稍后预览',
          type: 'warning'
        })
      }
    },
    playAudio(val) {
      this.dialogAudioPlay = true
      this.audioUrl = val
    },
    closeAudioDialog() {
      this.dialogAudioPlay = false
    },
    /**
     * 关闭视频预览
     * */
    closeDialog() {
      this.videoUrl = "" //清空数据 关闭视频播放
    },

    switchType () {
      if (this.fileType === 'all') {
        this.files = this.fileList
      } else if (this.fileType === 'audit') {
        this.files = this.fileList.filter(file => {
          return file.audit_status === 1
        })
      } else {
        this.files = this.fileList.filter(file => {
          return file.type === this.fileType
        })
      }
    },

    getFiles () {
      this.loading = true
      // this.getFileList({groupId: this.groupId})
      this.getFileList({type: this.selectType})
        .then(filelist => {
          if (this.fileType === 'all') {
            this.files = filelist
          } else if (this.fileType === 'audit') {
            this.files = filelist.filter(file => file.audit_status === 1)
          } else {
            this.files = filelist.filter(file => file.type === this.fileType)
          }

          setTimeout(() => {
            this.loading = false
          }, 500)
        })
        .catch(error => {
          console.log(error)
        })
    },

    openFile (value) {
      // this.searchText = '' // 不清空筛选体验更好?
      this.SET_FILETYPE(value)
      // this.getFiles(value) // 没必要重新搜索
      /* if (this.fileType === 'all') {
        return this.files = this.fileList
      }
      this.files = this.fileList.filter(file => file.type === this.fileType) */
    },
    changeFileStatus(val) {
      this.fileStatus = val
    },
    // 点击上传按钮触发的事件，实际是模拟点击隐藏的fileBatchUpload按钮
    selectFiles () {
      $('input.fileUploadBtn').click()
    },

    preview (index, files) {
      // preview image/video/audio
    },

    saveStream (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (this.editFile && this.editFile.id) { // modify
            // console.log(this[formName].protocol)
            // let pathStr =  (this[formName].protocol)? this[formName].protocol + this[formName].path:this[formName].path
            let res = await this.modifyStream({
              'id': this.editFile.id,
              'name': this[formName].name,
              //'path': this[formName].protocol + this[formName].path,
              'path': this[formName].path,
              'groupId': this.groupId
            })

            let file = res.data.message
            this.setFileProperty({ 'id': this.editFile.id, 'property': 'name', 'value': file.name, 'groupId': this.groupId})
            this.setFileProperty({ 'id': this.editFile.id, 'property': 'path', 'value': file.path, 'groupId': this.groupId })

            setTimeout(() => {
              this.editFile = {}
              this._hideDialog('showStreamDialog')
              this._hideDialog('showWebpageDialog')
            }, 300)

            this.$notify({
              title: '成功',
              type: 'success',
              message: '素材修改成功！'
            })

            return true
          } else { // create
            await this.createStream({
              'name': formName === 'stream' ? this.stream.name : this.webpage.name,
              'type': formName,
              //'path': formName === 'stream' ? this.stream.protocol + this.stream.path : this.webpage.protocol + this.webpage.path,
              'path': formName === 'stream' ? this.stream.path :  this.webpage.path,
              'groupId': this.groupId,
              'directoryId': this.directory_id
            })

            setTimeout(() => {
              this.editFile = {}
              this._hideDialog('showStreamDialog')
              this._hideDialog('showWebpageDialog')
            }, 500)

            this.$notify({
              title: '成功',
              type: 'success',
              message: '素材添加成功！'
            })

            return true
          }
        } else {
          return false
        }
      })
    },

    cancel () {
      this._hideDialog('showStreamDialog')
      this._hideDialog('showWebpageDialog')
      this._hideDialog('showEditDialog')
    },

    handleCheckAllChange (val) {
      this.checkedCities = val ? this.fileList : []
      this.isIndeterminate = false
    },

    handleCheckedCitiesChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length
    },

    edit (file, index, files) {
      this.editFile = copy({}, file) // improve me, check index
      this.editFile['index'] = index
      let path = this.editFile.path.split('//')

      switch (file.type) {
        case 'stream':
          this.stream.name = this.editFile.name
          this.stream.path = this.editFile.path
          // this.stream.path = path[1]
          // this.stream.protocol = path[0] + '//'
          this.stream.type = 'stream'

          this._showDialog('showStreamDialog')
          break
        case 'webpage':
          this.webpage.name = this.editFile.name
          this.webpage.path = this.editFile.path
         // this.webpage.protocol = path[0] + '//'
          this.webpage.type = 'webpage'

          this._showDialog('showWebpageDialog')
          break
        default:
          this._showDialog('showEditDialog')
          break
      }
    },

    save () {
      if (this.editFile.status === 3) {
        return this.$notify.info({
          title: '提示',
          message: '素材使用中，不能修改！'
        })
      }

      if (this.editFile && (this.editFile.name !== this.file.name)) {
        this.setFilename({ 'fileID': this.editFile.id, 'fileName': this.editFile.name }) // , 'groupId': this.groupId
          .then(res => {
            let file = res.data.message
            this.setFileProperty({ 'id': this.editFile.id, 'property': 'name', 'value': file.name })

            setTimeout(() => {
              this.editFile = {}
              this.cancel()
            }, 0)

            return this.$notify({
              title: '成功',
              type: 'success',
              message: '素材修改成功！'
            })
          })
          .catch(error => {
            return this.$notify({
              title: '错误',
              type: 'error',
              message: error
            })
          })
      } else {
        return this.$notify({
          title: '提示',
          type: 'warning',
          message: '文件名与修改前一致！'
        })
      }
    },

    remove () {
      if (this.selectedFiles.length === 0) {
        return this.$message({
          dangerouslyUseHTMLString: true,
          message: '<strong>请先选择需要删除的<i>终端</i></strong>'
        })
      }

      let find = false
      for (let i = 0; i < this.selectedFiles.length; i++) {
        if (this.selectedFiles[i].status === 3) {
          find = true
          break
        }
      }

      if (find) {
        return this.$notify.warning({
          title: '提示',
          message: '您选择的素材中有正在使用中的素材，请重新选择！'
        })
      }
      this._removeFiles(this.selectedFiles)
    },

    _delete (file) {
      if (file.status === 3) {
        return this.$notify.warning({
          title: '提示',
          message: '该素材处于使用状态，不能删除！'
        })
      }
      this._removeFiles([file])
    },

    _removeFiles (files) {
      this.selectedFilesCount = files.length

      this.$confirm(`您确定要删除选中的 ${this.selectedFilesCount} 个文件吗？删除后无法恢复!`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let loading = Loading.service({text: '删除中, 请稍后...'})
        let data = await this.removeFile({groupId: this.groupId, files})
        if (typeof data === 'undefined') return

        this.syncDisk()
        loading.close()
        if (data && data.length > 0) {
          this.$notify({
            title: '警告',
            type: 'warning',
            message: `“${data[0].name}” 等 ${data.length} 个文件正在使用中或者被内容所引用，无法删除`
          })
        } else {
          this.$notify({
            title: '成功',
            type: 'success',
            message: `${this.selectedFilesCount} 个文件删除成功`
          })

          this.selectedFilesCount = 0
        }
      }).catch((e) => {})
    },

    onSelectionChange (val) {
      let files = (val.length !== 0) ? val : []
      this.SET_SELECTED_FILES(files)
    },

    onFilesChange (e) {
      let fileList = e.target.files
      let uploadFiles = []
      let filesState = []

      for (let i = 0; i < fileList.length; i++) {
        let file = fileList[i] // origin input file object
        let _file = {} // dialog display file list
        _file.name = file.name
        _file.progress = '待上传'
        _file.speed = '待上传'
        _file.size = formatFileSize(file.size)
        _file.isStop = false
        _file.isCancel = false
        _file.directoryId = this.directory_id
        uploadFiles.push(file)
        filesState.push(_file)
      }
      console.log('uploadFiles:==>', uploadFiles)
      this.addUploadFiles({ 'uploadFiles': uploadFiles, 'filesState': filesState })
      $('.fileUploadBtn').val('')
    },

    _resetStream () {
      this.stream = {
        name: '',
        path: '',
        type: 'stream',
       // protocol: 'http://'
      }
    },

    _resetWebpage () {
      this.webpage = {
        name: '',
        path: '',
        type: 'webpage',
       // protocol: 'http://'
      }
    },

    // querySearch (value) {
    //   this.getFiles(value)
    // }

    handleShowAdvanceSearch () {
      ////this._showDialog('showAdvanceSearch')
      ////this.resetQuery()
      log('in handleShowAdvanceSearch!!')
    },

    submitSearchForm() {
      this.SET_FILETYPE('all')
      this.searchText = ''
      let me = this
      let postData = {
        skey: this.searchForm.skey.trim(),
        directory_id: this.directory_id
      }
      http.post('elements/search', postData)
        .then(res => {
          if (res.data.success === true){
            this.SET_FILELIST({ 'filelist': res.data.message, 'append': false })
          }
          setTimeout(() => {
            me.click_cancel_search()
          }, 200);
        })
        .catch(err => {
          console.log(err)
        })
    },

    click_cancel_search () {
      this.showAdvanceWindow = false
    }

  }
}
</script>

<style lang="scss" scoped>
  .content {
    height: calc(100% - 25px);
  }
  .margin-bot10{
    margin-bottom: 10px}
  .grid-content{
    position: relative;
    overflow: hidden;
    background-color: rgba(0,0,0,0.8);
    &:hover{
      .handleBox{height: 30px}
    }
    .fileBox{
      height: 180px;
      width: 100%;
      border: 5px solid #000000;
      img,video{
        width: 160px;
        max-height: 170px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .fontBox{
      text-align: center;
      p{
        color: #ffffff;
        line-height: 24px;
      }
    }
    .handleBox{
      position: absolute;
      left: 0px;
      bottom: 0px;
      width: 100%;
      height: 0px;
      text-align: center;
      color: #ffffff;
      line-height: 30px;
      transition: height 0.33s;
      -webkit-transition: height 0.33s; /* Safari */
      background-color: rgba(0,0,0,0.5);
    }
  }
  .input-search {
    width: 200px;
  }

  .fileUploadBtn {
    visibility: hidden;
    height: 0px;
    overflow: hidden;
  }

  .fa.fa-camera {
    color: #5ec7fb;
  }

  .el-table .fa.fa-music {
    color: #8183f1;
  }

  .el-table .fa.fa-video-camera {
    color: #8183f1;
  }

 .el-table .fa-link {
    color: #65a3fb;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }

  .clearfix:after {
      clear: both
  }

  .right {
    float: right;
  }

 .el-input .el-select {
    width: 90px;
  }

  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }

  .statusSelect {
    width: 100px;
  }
  .audioBox{
    width: 94%;
    position: absolute;
    top: 30%;
    left: 3%;
  }
</style>
<style lang="scss">
  .videoDialog{
    .el-dialog__body{
      padding: 10px 20px 30px;
    }
  }
  .cell{
    a.el-tooltip{
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
    }
    span.icon-colorful{
      width: 100%;
      span.fa-link{
        width: 100%;
        a{
          display: inline-block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
        }
      }
    }
  }
  .searchText{
    width: 300px;
    margin-left: 25px;
    .el-input__inner{
      border-radius: 15px;
      height: 30px;
      line-height: 30px;
    }
  }
</style>
