<template>
  <div class="marquee-context">

    <!-- 按钮区 -->
    <div class="btn-context">
      <refresh-button v-on:refresh="refresh"></refresh-button>
      <el-button  @click="createMarquee" plain>
        <i class="fa fa-plus"></i>
      </el-button>
      <el-input placeholder="请输入播出内容进行搜索" v-model="searchText" clearable class="input-search">
      </el-input>
    </div>

    <!-- 弹出框 -->
    <marquee-create :marquee="marquee" :type="type" :index="index" :title="title"></marquee-create>

    <!-- 列表区 -->
    <el-table v-loading="loading" height="100%" :data="search" class="marquee-table">
      <el-table-column align='center' header-align="center" prop="status" label="状态" width="80">
        <template slot-scope="scope">
          <!-- 0 可用 1 未审核 2 驳回 3 已发布 4 已过期-->
          <el-tooltip
            class="item"
            effect="dark"
            v-if="scope.row.status === Status.AVAILABLE" content="可用" placement="bottom">
            <i class="fa fa-bullseye"></i>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            v-if="scope.row.status === Status.PUBLISHED" content="已发布" placement="bottom">
            <i class="fa fa-check"></i>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            v-if="scope.row.status === Status.AUDIT" content="审核中" placement="bottom">
            <i class="fa fa-bell"></i>
          </el-tooltip>
          <!-- 审核未通过 -->
          <el-tooltip
            class="item"
            effect="dark"
            v-if="scope.row.status === Status.UNPASSED" :content="`未通过: ${scope.row.audit_reason}`" placement="bottom">
            <i class="fa fa-ban"></i>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            v-if="scope.row.status === Status.EXPIRED" content="已过期" placement="bottom">
            <i class="el-icon-remove-outline"></i>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="direction" label="类型" width="100"
                       align='center'>
        <template slot-scope="scope">
          <span v-if="String(scope.row.play_type) === '1'" class="blue">按时插播</span>
          <span v-else-if="String(scope.row.play_type) === '2'" class="green">按次插播</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="content" label="播出内容"></el-table-column>
      <el-table-column align='center' label="跑马灯速度" width="100">
        <template slot-scope="scope">
          <p>{{ scope.row.speed | speed2Str }}</p>
        </template>
      </el-table-column>
      <el-table-column align='center' label="制作人" prop="user.name" width="120">
      </el-table-column>
      <el-table-column align='center' label="播出日期" width="100" >
        <template slot-scope="scope">
          <p>{{ scope.row.startdate }}</p>
          <p>|</p>
          <p>{{ scope.row.enddate }}</p>
        </template>
      </el-table-column>
      <el-table-column align='center' label="播出时段" width="150">
        <template slot-scope="scope">
          <p>{{ scope.row.starttime }}</p>
          <p>|</p>
          <p>{{ scope.row.endtime }}</p>
        </template>
      </el-table-column>

      <!-- 功能操作区 -->
      <el-table-column label="操作" width="140" align="center">
        <template slot-scope="scope">
          <el-tooltip v-if="[Status.AVAILABLE, Status.EXPIRED, Status.UNPASSED].includes(scope.row.status)" effect="dark" content="编辑" placement="bottom">
            <el-button type="text" size="mini" @click="editMarquee(scope)">
              <i class="fa fa-pencil"></i>
            </el-button>
          </el-tooltip>
          <el-tooltip v-if="scope.row.status === Status.AVAILABLE" effect="dark" content="发布" placement="bottom">
            <el-button type="text" size="mini"  @click="publish(scope)">
              <i class="fa fa-arrow-circle-o-right"></i>
            </el-button>
          </el-tooltip>
          <el-tooltip v-if="scope.row.status === Status.PUBLISHED" effect="dark" content="停止" placement="bottom">
            <el-button type="text" size="mini" @click="stop(scope)">
              <i class="fa fa-stop-circle-o"></i>
            </el-button>
          </el-tooltip>
          <el-tooltip v-if="[Status.AVAILABLE, Status.AUDIT, Status.UNPASSED, Status.EXPIRED].includes(scope.row.status)" effect="dark" content="删除" placement="bottom">
            <el-button type="text" size="mini" @click="remove(scope)">
              <i class="fa fa-trash"></i>
            </el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="查看更多" placement="bottom">
            <el-button type="text" size="mini" @click="click_more(scope.$index, scope.row)">
              <i class="fa fa-ellipsis-v"></i>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <transition name="el-zoom-in-top">
      <div class="terminalInfoMask" v-if="showDetails" @click="click_close">
        <data-details id='terminalInfo' :activeMarquee="activeMarquee"  v-on:showDetails="onShowDetails" @click.native.stop
        :clearIntervalFromParent.sync='clearIntervalFromParent'>
        </data-details>
      </div>
    </transition>
  </div>
</template>

<script>
import RefreshButton from '@/components/RefreshButton'
import MarqueeCreate from './MarqueeCreate'
import { mapState, mapMutations, mapActions } from 'vuex'
import api from '@static/js/api/index'
import Status from '@static/js/utils/status'
import dataDetails from './details'

const TYPE_CREATE = 1
const TYPE_EDIT = 2

export default {
  components: {
    RefreshButton, MarqueeCreate, dataDetails
  },

  data () {
    return {
      dialogVisible: false,
      loading: false,
      audit: 0,
      searchText: '',
      type: 0,
      marquee: null,
      index: -1,
      title: '',
      treeId: null,
      filterValue: [],
      clearIntervalFromParent: false,
      showDetails: false,
      activeMarquee: {},
      Status
    }
  },

  computed: {
    ...mapState({
      marqueeList: state => state.marquee.marqueeList
    }),

    search () {
      let ret = []
      let type = this.statusType
      if (this.searchText === '') {
        ret = this.marqueeList
      }
      ret = this.marqueeList.filter(item => {
        return item.content.indexOf(this.searchText) !== -1
      })

      ret = ret.filter(item => {
        return item.status === this.statusType
      })

      return ret
    },

    statusType () {
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

  filters: {
    speed2Str (val) {
      if (!val) {
        return ''
      }
      switch (val) {
        case 2:
          return '慢'
        case 3:
          return '适中'
        case 4:
          return '快'
        default:
          break;
      }
    }
  },

  methods: {
    ...mapMutations([
      'SHOW_MARQUEE_EDIT', 'SET_STATUS_COUNT'
    ]),

    ...mapActions([
      'getMarquee', 'removeMarquee', 'publishMarquee', 'stopMarquee'
    ]),

    refresh () {
      this.getMarqueeWithLoading()
    },

    getMarqueeWithLoading () {
      this.loading = true
      this.getMarquee().then(res => {
        setTimeout(() => {
          this.loading = false
        }, 500)
      })
    },

    createMarquee () {
      this.type = TYPE_CREATE
      this.marquee = null
      this.title = '新建跑马灯'
      this._showEdit()
    },

    editMarquee (scope) {
      this.type = TYPE_EDIT
      this.marquee = scope.row
      this.title = '编辑跑马灯'
      this.index = this._getIndex(scope.row.id)
      this._showEdit()
    },

    remove (scope) {
      this.$confirm('确认删除该跑马灯？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let index = this._getIndex(scope.row.id)
        this.removeMarquee({id: scope.row.id, index: index})
      })
    },

    publish (scope) {
      this.$confirm('确认发布该跑马灯？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let index = this._getIndex(scope.row.id)
        this.publishMarquee({index: index, id: scope.row.id})
      })
    },

    stop (scope) {
      this.$confirm('确认停止该跑马灯？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let index = this._getIndex(scope.row.id)
        this.stopMarquee({index: index, id: scope.row.id})
      })
    },

    _getIndex (id) {
      let index = 0
      this.marqueeList.some((item, i) => {
        if (item.id === id) {
          index = i
          return true
        }
      })
      return index
    },

    _showEdit () {
      this.SHOW_MARQUEE_EDIT(true)
    },

    click_more (index, data) {
      this.activeMarquee = data
      this.showDetails = true
      this.clearIntervalFromParent = false
    },

    click_close () {
      this.clearIntervalFromParent = true
    },

    onShowDetails (showDetails) {
      this.showDetails = showDetails
    }
  },

  created () {
    api.getAudit('marquees').then(res => {
      this.audit = res.data.marquee.status
      this.getMarqueeWithLoading()

    })
  }
}
</script>

<style lang="scss">
.el-tooltip__popper{max-width: 300px}
.marquee-context {
  height: calc(100% - 36px);
  .btn-context {
    .el-input{
      width: 200px;
      margin-left: 10px;
    }
  }
  .marquee-table{
    .fa-check,.fa-arrow-circle-o-right{
      color: #67C23A;
    }
    p{
      text-align: center;
    }
  }
  .el-radio-group {
    vertical-align: top;
    font-size: 14px;
    display: inline-block;
    .el-radio {
      margin-left: 10px;
    }
    .el-radio__input {
      display: none;
    }
  }
  .el-radio.is-bordered.is-checked {
    background-color: #409EFF;
    color: #fff;
  }
  .el-radio__input.is-checked+.el-radio__label {
    // color: #fff; // 不理解这里为什么搞白色? 最上面新加的播出类型没法正常显示了
  }
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
