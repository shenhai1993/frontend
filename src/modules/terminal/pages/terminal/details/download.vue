<template>
  <div class="updatafre">
    <el-form>
      <el-form-item>
        <header>
          <span v-if="!isLoading && !loaded">
            <i class="fa fa-info-circle warning"></i>
            更新失败
          </span>
          <span v-if="!isLoading && loaded">
            <i class="fa fa-check-circle-o"></i>
            更新完成
          </span>
          <span v-if="isLoading">
            <i class="fa fa-circle-o-notch" style=" animation: loading 2s infinite;
                      -webkit-animation: loading 2s infinite;"></i>
            正在更新
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
        <div class="playlist">
          <el-collapse v-model="activeType" accordion>
            <el-collapse-item :title="item.titleStr" :name="index" :key='item.id' v-for="(item, index) in downLoadType">
              <el-table :data="item.items" style="width: 100%" v-loading='isLoading'>
                <el-table-column prop="name" label="文件名" show-overflow-tooltip></el-table-column>
                <el-table-column prop="size" label="大小" show-overflow-tooltip :width="80">
                  <template slot-scope='scope'>
                    {{ scope.row.size | filesize }}
                  </template>
                </el-table-column>
                <el-table-column prop="percent" label="下载进度" show-overflow-tooltip :width="90">
                  <template slot-scope="scope">
                    <span v-if="isNaN(scope.row.percent)">{{ scope.row.percent }}</span>
                    <el-progress v-else :text-inside="true" :percentage="scope.row.percent"></el-progress>
                  </template>
                </el-table-column>
              </el-table>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-form-item>
      <!-- <div class="updatafre-footer m-t-20" v-if="downLoadData">
        <span>下载速度：[{{ downLoadData.speed }} / s]</span>
      </div> -->
    </el-form>
  </div>
</template>

<script>
import Terminal from '@/modules/terminal/static/js/TerminalGroup'
// import moment from 'moment'

export default {
  props: ['activeName', 'activeterminal'],
  data () {
    return {
      options: [{
        value: '5',
        label: '5s'
      },{
        value: '15',
        label: '15s'
      }, {
        value: '20',
        label: '20s'
      }, {
        value: '30',
        label: '30s'
      }],
      value: '5',
      activeType: 0,
      downLoadType: [
        {
          name: 'playlist',
          title: '主播文件'
        },
        {
          name: 'priority',
          title: '插播文件'
        },
        {
          name: 'default',
          title: '垫片文件'
        },
        {
          name: 'vod',
          title: '点播文件'
        },
        {
          name: 'interact',
          title: '互动文件'
        },
        {
          name: 'sync',
          title: '同步/拼接文件'
        },
        {
          name: 'upgrade',
          title: '升级文件'
        }
      ],
      downLoadData: {},
      intervalDownLoad: '',
      currentRequestTime: '',
      isLoading: false,
      loaded: false
    }
  },

  watch: {
    activeName (v, ov) {
      if (v === 'download') {
        this._intervalDownLoad()
      } else {
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
      this.isLoading = true
      this.loaded = false
      Terminal.download(this.activeterminal.number)
        .then(res => {
          this.isLoading = false
          this.loaded = true
          this.downLoadData = res.data.message
          let key = 0
          for (let items of this.downLoadType) {
            console.log(!this.downLoadData[items.name])
            if (this.downLoadData[items.name] !== []) {
              console.log(items.name)
            }
            this.downLoadType[key].items = this.downLoadData[items.name] // 直接赋给items, 上面方便遍历
            let length = this.downLoadData[items.name] ? this.downLoadData[items.name].length : 0
            items.titleStr = items.title +  '（共' + length + '个）'
            key++
          }
          // this.currentRequestTime = moment().format('HH:mm:ss')
          // 成功之后相隔一定时间再次请求
          if (this.activeName !== 'download') {
            return
          }
          this.intervalDownLoad = setTimeout(() => {
            this._intervalDownLoad()
          }, 1000 * Number(this.value))
        })
        .catch(err => {
          console.log(err)
          this.isLoading = false
          this._clearTimeout()
        })
    },

    _intervalDownLoad () {
      if (String(this.activeterminal.online_status) === '0') {
        this._offLineNotice()
        return
      }
      this._getDownload()
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
    .el-table,
    .el-tabs .el-tab-pane
      font-size: 12px!important

    .el-progress-bar__outer
      height: 12px!important
    .updatafre-footer
      font-size: 14px
      span
        color: #13CE66
</style>
