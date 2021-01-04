<template>
  <div class="updatafre"
       v-loading='isLoading'>
    <el-form>
      <el-form-item>
        <header>
          <span>
            <i class="fa fa-check-circle-o" v-if="!isLoading"></i>
            <i class="fa fa-circle-o-notch"
               style=" animation: loading 2s infinite;
                       -webkit-animation: loading 2s infinite;" v-if="isLoading"></i>
            更新完成 {{ currentRequestTime }}
          </span>
          <div>
            刷新频率
                <el-select v-model="value">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
          </div>
        </header>
        <div class="playlist m-t-20">
          <el-collapse v-model="downLoadType" accordion>
            <el-collapse-item :title="item.name" :name="index" :key='index'
                              v-for="(item, index) in downLoadData.type">

              <el-table :data="item.data" style="width: 100%">
                <el-table-column prop="name" label="素材名称" show-overflow-tooltip></el-table-column>
                <el-table-column prop="size" label="素材大小" show-overflow-tooltip :width="80">
                  <template slot-scope='scope'>
                    {{ scope.row.size | filesize }}
                  </template>
                </el-table-column>
                <el-table-column prop="process" label="下载进度" show-overflow-tooltip :width="90">
                  <template slot-scope="scope">
                    <span v-if="isNaN(scope.row.percentage)">{{ scope.row.percentage }}</span>
                    <el-progress v-else :text-inside="true" :percentage="scope.row.percentage"></el-progress>
                  </template>
                </el-table-column>
              </el-table>
            </el-collapse-item>
          </el-collapse>

        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import http from '../../../../../../static/js/utils/http.js'
import moment from 'moment'

export default {
  props: ['activeName', 'activeterminal', 'isclearInterval'],
  data () {
    return {
      options: [{
        value: '15',
        label: '15s'
      }, {
        value: '20',
        label: '20s'
      }, {
        value: '30',
        label: '30s'
      }],
      value: '15',
      tableData: [{
        size: '100M',
        name: '旋转跳跃旋转跳跃旋转跳跃旋转跳跃',
        progress: '100'
      }],
      downLoadType: 0,
      downLoadData: {},
      intervalDownLoad: '',
      currentRequestTime: '',
      isLoading: false
    }
  },
  watch: {
    activeName (v, ov) {
      if (v === 'download') {
        this._intervalDownLoad()
      } else {
        this._clearTimeout()
      }
    },
    isclearInterval (v, ov) {
      if (v) {
        this._clearTimeout()
      }
    }
  },
  mounted () {
    if (this.activeName === 'download') {
      this._intervalDownLoad()
    }
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    },
    _getDownload () {
      let me = this
      me.isLoading = true
      http.get(`terminals/download/${this.activeterminal.number}`)
        .then(res => {
          me.isLoading = false
          me.downLoadData = res.data.message
          me.currentRequestTime = moment().format('HH:mm:ss')
          // 成功之后相隔一定时间再次请求
          me.intervalDownLoad = setTimeout(() => {
            me._intervalDownLoad()
          }, 1000 * Number(me.value))
        })
        .catch(err => {
          console.log(err)
          me.isLoading = false
          me._clearTimeout()
        })
    },
    _intervalDownLoad () {
      let me = this
      if (String(this.activeterminal.online_status) === '0') {
        this._offLineNotice()
        return
      }
      me._getDownload()
    },
    _clearTimeout () {
      clearTimeout(this.intervalDownLoad)
    },
    _offLineNotice () {
      this.$notify({
        title: '提示',
        message: '此终端处于离线状态,无下载监控！',
        type: 'warning'
      })
    }
  }
}
</script>

<style lang="sass">
  .updatafre
    .el-table
      thead
        tr
          th
            background-color: #f5f7fa;
            color: #303133;
    .el-table,
    .el-tabs .el-tab-pane
      font-size: 12px!important;

    .el-progress-bar__outer
      height: 12px!important;

</style>
