<template>
  <div class="tablecontent">

    <div class="p-15">
      <el-select v-model="searchStatus" placeholder="选择状态"
                  @change="selectStatus" class="statusSelect">
        <el-option v-for="item in statusList"
                    :key="item.label"
                    :label="item.label"
                    :value="item.label">
        </el-option>
      </el-select>
      <el-tooltip effect="dark" content="激活新终端" placement="bottom">
        <el-button class="m-l-10" @click="activetionTerminalvisible = true">
          <i class="fa fa-plus"></i>
        </el-button>
      </el-tooltip>

      <!-- 激活新终端 -->
      <el-dialog title="激活新终端" :visible.sync="activetionTerminalvisible" width='40%' @close='click_cancel'>
        <el-form :model="formData" :rules="rules" ref="formData" inline-message>
          <el-row>
            <el-col :span="16" :offset="4">
              <el-form-item label="确认码" :label-width="formLabelWidth" prop="code">
                <el-input v-model.number="formData.code" placeholder="请输入6位数字确认码"
                          auto-complete="off"
                          :minlength="6" :maxlength="6"></el-input>
              </el-form-item>
              <el-alert title="确认码在终端联网注册后显示在终端屏幕上"
                        type="warning"
                        :closable="false"
                        show-icon
                        class="text-center">
              </el-alert>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="click_cancel">取 消</el-button>
          <el-button type="primary" @click="click_activetion('formData')">激 活</el-button>
        </div>
      </el-dialog>

      <refreshbutton v-on:refresh="refresh"></refreshbutton>
    </div>

    <el-table ref="multipleTable"
              :data="searchedLists"
              tooltip-effect="dark"
              style="width: 100%;"
              height='100%'
              stripe
              empty-text="暂无终端">
      <el-table-column prop="name" label="终端名称">
      </el-table-column>
      <el-table-column prop="number" label="终端编号" show-overflow-tooltip width="160">
      </el-table-column>
      <el-table-column v-if="isungrouped"
                       prop="normalnum" label="所属虚拟屏编号" show-overflow-tooltip width="160">
      </el-table-column>
      <el-table-column prop="mac" label="MAC地址" width="160">
        <template slot-scope="scope">
          {{ scope.row.mac | MACStyle }}
        </template>
      </el-table-column>
      <el-table-column prop="online_status" label="在线" width="80" align='center'>
        <template slot-scope="scope">
          <el-tooltip content="在线" placement="bottom">
            <i v-if='String(scope.row.online_status) === "1"' class="online fa fa-circle"></i>
          </el-tooltip>
          <el-tooltip content="离线" placement="bottom">
            <i v-if='String(scope.row.online_status) === "0"' class="notonline fa fa-circle"></i>
          </el-tooltip>
          <el-tooltip content="待机" placement="bottom">
            <i v-if='String(scope.row.online_status) === "2"' class="fa fa-minus"></i>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="download_status" label="下载状态" width="100" align='center'>
        <template slot-scope="scope">
          <el-tooltip content="无下载" placement="bottom">
            <i v-if='String(scope.row.download_status) === "0"' class="fa fa-minus"></i>
          </el-tooltip>
          <el-tooltip content="下载完成" placement="bottom">
            <i v-if='String(scope.row.download_status) === "2"' class="fa fa-check"></i>
          </el-tooltip>
          <el-tooltip content="正在下载" placement="bottom">
            <i v-if='String(scope.row.download_status) === "1"' class="fa fa-download"></i>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="play_status" label="播放状态" width="100" align='center'>
        <template slot-scope="scope">
          <el-tooltip content="未播放" placement="bottom">
            <i v-if="scope.row.play_status === '0'" class="fa fa-stop"></i>
          </el-tooltip>
          <el-tooltip content="正在播放" placement="bottom">
            <i v-if="scope.row.play_status === '1'" class="fa fa-play"></i>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="direction" label="屏幕方向" width="100"
                       align='center'>
        <template slot-scope="scope">
          <span v-if="String(scope.row.direction) === '0'" class="horizontal">横屏</span>
          <span v-if="String(scope.row.direction) === '2'" class="horizontal">横屏（反）</span>
          <span v-if="String(scope.row.direction) === '1'" class="vertical">竖屏</span>
          <span v-if="String(scope.row.direction) === '3'" class="vertical">竖屏（反）</span>
        </template>
      </el-table-column>
      <el-table-column prop="disk_size" label="磁盘空间" width="100">
        <template slot-scope="scope">
          <el-progress :text-inside="true" :stroke-width="18"
                       :percentage="Number(scope.row.disk_size)"
                       :status="Number(scope.row.disk_size) > 80 ? 'exception' : ''">
          </el-progress>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" align='center'>
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="编辑" placement="bottom">
            <i class="fa fa-pencil" @click="click_redact(scope.$index, terminalList.data)"></i>
          </el-tooltip>
          <!-- <i class="fa fa-refresh" title="刷新播出单" @click="click_refresh(scope.$index, terminalList.data)"></i> -->
          <el-tooltip effect="dark" content="重启终端" placement="bottom">
            <i class="fa fa-power-off" @click="click_restart(scope.$index, terminalList.data)"></i>
          </el-tooltip>
          <el-tooltip effect="dark" content="删除" placement="bottom">
            <i class="fa fa-trash" @click.stop="click_delete(scope.$index, terminalList.data)"></i>
          </el-tooltip>
          <el-tooltip effect="dark" content="查看更多" placement="bottom">
            <i class="fa fa-ellipsis-v" @click="click_more(scope.$index, terminalList.data)"></i>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <transition name="el-zoom-in-top">
      <div class="terminalInfoMask" v-if="showDetails" @click="click_close">
        <terminal-details id='terminalInfo' v-on:showDetails="onShowDetails" @click.native.stop
                          :activeterminal='activeterminal'
                          :clearIntervalFromParent.sync='clearIntervalFromParent'>
        </terminal-details>
      </div>
    </transition>

    <terminal-editor :isterminalEditVisible='isterminalEditVisible'
                     v-on:terminalEditHiden='terminalEditHiden'
                     :redactTerminal='redactTerminal'></terminal-editor>

  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import TerminalGroup from '../../static/js/TerminalGroup.js'
import HeaderBar from '../../components/HeaderBar.vue'
import TerminalEditor from './editor'
import TerminalDetails from './details'
import http from '../../../../../static/js/utils/http'
import refreshbutton from '@/components/RefreshButton.vue'

export default {
  components: {
    HeaderBar, TerminalEditor, TerminalDetails, refreshbutton
  },

  filters: {
    MACStyle: function (value) {
      if (!value) return ''

      let reg = /\w{2}/g
      let rs = value.toUpperCase().match(reg)

      // 408bf63dc5d0 => 40:8B:F6:3D:C5:D0
      return rs.join(':')
    }
  },

  data () {
    var activation = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入确认码'))
      } else if (String(value).length < 6) {
        callback(new Error('确认码必须为六位'))
      } else if (isNaN(value)) {
        callback(new Error('确认码必须为数字'))
      } else {
        callback()
      }
    }

    return {
      showDetails: false,
      terminalList: null,
      isterminalEditVisible: false,
      redactTerminal: null,
      activeterminal: null,
      clearIntervalFromParent: false,
      searchStatus: '全部',
      statusList: [
        { label: '全部' },
        { label: '离线' },
        { label: '在线' }
      ],
      activetionTerminalvisible: false,
      formData: {code: ''},
      formLabelWidth: '',
      rules: {
        code: [
          { validator: activation, trigger: 'blur' }
        ]
      },
      terminalvisible: false,
      isungrouped: false
    }
  },
  mounted () {
    this.isungrouped = this.$route.path === '/mpdp/ungrouped'
    console.log(this.isungrouped)
    // 改接口之后
    this._newgetTerminals()
    if (this.$route.query) {
      let value = this.$route.query
      switch (value.query) {
        case 'online':
          this.searchStatus = '在线'
          break
        case 'notonline':
          this.searchStatus = '离线'
          break
        case 'all':
          this.searchStatus = '全部'
          break
      }
    }
  },
  computed: {
    searchedLists () {
      if (this.terminalList && this.terminalList.status === 200) {
        switch (this.searchStatus) {
          case '在线':
            return this._terminalStatus('1')
          case '离线':
            return this._terminalStatus('0')
          case '全部':
            return this._terminalStatus('')
        }
      }
    }
  },
  methods: {
    ...mapMutations({
      is_refresh: 'IS_REFRESH'
    }),
    _newgetTerminals () {
      let ax
      let me = this
      if (me.isungrouped) {
        ax = TerminalGroup.getUngroupedTerminals()
      } else {
        ax = TerminalGroup.getTerminals()
      }
      ax.then(res => {
        me.terminalList = res
      })
        .catch(err => {
          console.log(err)
        })
    },
    refresh () {
      this._newgetTerminals()
    },
    click_cancel () {
      this.activetionTerminalvisible = false
      this.$refs.formData.clearValidate()
    },
    click_activetion (formName) {
      let me = this
      let url
      url = me.isungrouped ? '/mpdp/terminals/activate' : '/terminals/activate'

      me.$refs[formName].validate((valid) => {
        if (valid) {
          http.post(url, me.formData)
            .then(res => {
              console.log(res)
              me._newgetTerminals()
              me.click_cancel()
              me.$notify.success({
                title: '操作成功！'
              })
            })
        } else {
          console.log('error')
          return false
        }
      })
    },
    click_more (index, data) {
      this.activeterminal = data[index]
      this.showDetails = true
      this.clearIntervalFromParent = false
    },
    click_close () {
      this.clearIntervalFromParent = true
    },
    onShowDetails (showDetails) {
      this.showDetails = showDetails
    },
    click_refresh (index, item) {
      this.is_refresh(true)
    },
    click_redact (index, item) {
      this.isterminalEditVisible = true
      this.redactTerminal = item[index]
    },
    terminalEditHiden (data) {
      this.isterminalEditVisible = data
    },
    click_delete (index, item) {
      let me = this

      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        http.delete(`/terminals/${item[index].id}`)
          .then(res => {
            me.searchedLists.splice(index, 1)
            me.$notify.success({
              title: '操作成功！'
            })
          })
      })
        .catch(err => {
          console.log(err)
        })
    },
    selectStatus (status) {
    },
    _terminalStatus (stringNum) {
      let data = this.terminalList.data
      if (stringNum) {
        data = data.filter(ele => {
          return String(ele.online_status) === stringNum
        })
      }
      return data
    },
    click_restart (index, item) {
      let me = this
      me.is_refresh(true)
      TerminalGroup.restart(item[index].number)
        .then(res => {
          me.is_refresh(false)
          console.log(res)
          me.$notify.success({
            title: '操作成功！'
          })
        })
        .catch(err => {
          me.is_refresh(false)
          console.log(err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  .headerbar {
    position: absolute;
    top: -71px;
    width: 100%;
    z-index: 20;
  }
  .fa-pencil,
  .fa-refresh,
  .fa-power-off,
  .fa-trash,
  .fa-ellipsis-v {
    color: #7d7d7d;
    margin-left: 5px;
    margin-right: 5px;
    cursor: pointer;
  }
  .fa-ellipsis-v {
    display: inline-block;
    padding-left: 5px;
    padding-right: 5px;
    text-align: center;
    &:hover {
      color: #67C23A;
    }
  }
  .fa-pencil:hover,
  .fa-play,
  .online {
    color: #67C23A;
  }
  .fa-refresh:hover,
  .vertical,
  .fa-check,
  .fa-download {
    color: #409EFF;
  }
  .fa-power-off:hover {
    color: #EB9E05;
  }
  .fa-trash:hover,
  .horizontal,
  .notonline {
    color: #FA5555;
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
  .tablecontent {
    background-color: #fff;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1), 0px 0px 5px rgba(0, 0, 0, 0.1);
    height: calc(100% - 60px);
    overflow-y: auto;
    margin: 15px 15px 0px 15px;
  }
  .el-table {
    height: calc(100% - 71px)!important;
  }
  .el-pagination {
    position: relative;
    z-index: 10;
  }
</style>
