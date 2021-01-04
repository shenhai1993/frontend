<template>
  <div class="role-warpper">
    <div class="new-btn">
      <el-form :inline="true" ref="formData" :model="formData" label-width="0px"  class="demo-form-inline">
        <el-form-item>
          <el-select v-model="formData.modules" placeholder="请选择" size="medium">
            <el-option
              v-for="item in permissionList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item>
          <el-date-picker
            v-model="formData.startTime"
            type="date"
            default-time="00:00:00"
            :picker-options="pickerStartTime"
            placeholder="选择开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="formData.endTime"
            type="date"
            default-time="23:59:00"
            :picker-options="pickerEndTime"
            placeholder="选择结束日期">
          </el-date-picker>
        </el-form-item>-->
        <el-form-item>
          <el-date-picker
            v-model="dateValue"
            type="datetimerange"
            :picker-options="pickerOptions"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="formData.userName"
            filterable
            remote
            reserve-keyword
            placeholder="请输入用户名搜索"
            :remote-method="remoteMethod"
            :loading="loadings">
            <el-option
              v-for="(item, index) in options4"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="getSearchPageList(1)" icon="el-icon-search">搜索</el-button>
        <el-button type="primary" @click="resetForm" icon="el-icon-search">重置</el-button>
      </el-form>
    </div>
    <div style="height: calc(100% - 70px);overflow: auto">
      <el-table v-loading="loading" :data="pagesList.data" highlight-current-row>
          <el-table-column align="action" label="动作" prop="action" width="200px">
            <template slot-scope="scope">
              {{ scope.row.action | replaceActions }}
            </template>
          </el-table-column>
          <el-table-column align="content" label="动作详情" prop="content"></el-table-column>
          <el-table-column align="user_name" label="操作者" prop="user_name" width="200px"></el-table-column>
          <el-table-column align="to_uname" label="创建者" prop="to_uname" width="200px"></el-table-column>
          <el-table-column align="ip" label="IP地址" prop="ip" width="200px"></el-table-column>
          <el-table-column align="created_at" prop="created_at" label="操作时间" width="200">
            <template slot-scope="scope">
              <el-tooltip effect="dark" :content="scope.row.created_at" placement="bottom">
                <span>{{ scope.row.created_at | fromnow }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
      </el-table>
    </div>
    <div class="block pages-block" v-if="pagesList.total > 0">
      <div class="customize-box">
        每页显示
        <div class="customize-pages">
           <el-input-number v-model="customizePages" :value="customizePages" size="mini" controls-position="right" @change="getSearchPageList(1)" :min="1"></el-input-number>
        </div>
        条目</div>
      <el-pagination background
        @current-change="handleCurrentChange"
        :current-page.sync="pagesList.current_page"
        :page-size="pagesList.per_page"
        layout="total, prev, pager, next"
        :total="pagesList.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import http from '@static/js/utils/http'
import { copy } from '@static/js/utils/utils'
import { mapState, mapMutations, mapActions } from 'vuex'
import { Actions } from '../static/actions.js'

export default {
  data () {
    return {
      formData: {
        modules: '用户',
        startTime: '',
        endTime: '',
      },
      dateValue: [],
      pagesList: {},
      currentPage: 1,
      customizePages: 15, // 用户自定义页数 默认15
      pickerOptions: {
        disabledDate: (time) => {
          return this.dealDisabledDate(time)
        },
        shortcuts: [{
          text: '最近一天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 3)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      /*pickerStartTime: {
        disabledDate: (time) => {
          if(this.formData.endTime === ''){
            return time.getTime() > Date.now() - 8.64e6
          } else {
            let beginDateVal = this.formData.endTime
            if (beginDateVal) {
              return time.getTime() > beginDateVal || time.getTime() > Date.now() - 8.64e6
            }
          }
        }
      },
      pickerEndTime: {
        disabledDate: (time) => {
          if(this.formData.startTime === ''){
            return time.getTime() > Date.now() - 8.64e6
          } else {
            let beginDateVal = this.formData.startTime
            if (beginDateVal) {
              return time.getTime() < beginDateVal || time.getTime() > Date.now() - 8.64e6
            }
          }
        }
      },*/
      options4: [],
      loadings: false // 远程搜索select的loading
    }
  },

  computed: {
    ...mapState({
      permissionList: state => state.log.permissionList,
      logsPageList: state => state.log.logsPageList,
      loading: state => state.log.loading,
      allUsers: state => state.log.allUsers
    })
  },

  filters: {
    replaceActions (value) {
      for (let inx in Actions) {
        if (value === Actions[inx].name) {
          value = Actions[inx].label
          return value
        }
      }
    }
  },

  methods: {
    ...mapActions([
      'getPermissionList', 'getLogsPageList', 'getAllUsers'
    ]),

    ...mapMutations([
      'UPDATE_LOADING_STATUS'
    ]),

    refresh () {
      this.getLogsPageList({
        modules: this.formData.modules,
        toPage: this.currentPage
      })
    },
    resetForm(){
      this.$refs.formData.resetFields()
    },
    handleCurrentChange (val) {
      this.UPDATE_LOADING_STATUS(true)
      this.currentPage = val
      this.getSearchPageList(val)
    },
    dealDisabledDate(time) {
      var times = Date.now()
      return time.getTime() > times;
    },
    getSearchPageList (val) {
      this.UPDATE_LOADING_STATUS(true)
      let start = this.dateValue[0]
      let end = this.dateValue[1]
      this.getLogsPageList({
        modules: this.formData.modules === '用户' ? 'user' : this.formData.modules,
        toPage: val,
        startTime: start,
        endTime: end,
        perpage: this.customizePages,
        username: this.formData.userName
      })
    },

    remoteMethod(query) {
      if (query !== '') {
        this.loadings = true
        setTimeout(() => {
          this.loadings = false
          this.options4 = this.allUsers.filter(item => {
            return item.indexOf(query) > -1
          })
        }, 200)
      } else {
        this.options4 = []
      }
    }
  },

  mounted () {
    this.getPermissionList()
    this.getAllUsers()
    this.formData.startTime = this.$moment().subtract( 6, 'days').format('YYYY-MM-DD 00:00:00')
    this.formData.endTime = this.$moment().format('YYYY-MM-DD 23:59:00')
    this.getLogsPageList({
      startTime: this.formData.startTime,
      endTime: this.formData.endTime,
      modules: this.formData.modules === '用户' ? 'user' : this.formData.modules,
      toPage: 1
    })
  },

  watch: {
    logsPageList: {
      handler( n, o ) {
        this.pagesList = copy({}, n)
      },deep:true
    }
  }
}
</script>

<style lang="scss" scoped>
.role-warpper{
  height: 100%;
  position: relative;
  padding-bottom: 50px;
  .new-btn{
    margin-bottom: 20px
  }
  .list{
    display: flex;
    flex-wrap: wrap;
    padding-left: 50px;
    .item{
    flex-basis: 180px
    }
  }
}
.pages-block {
  margin-top: 20px;
  text-align: right;
  .customize-box {
    text-align: right;
    font-size: 13px;
    font-weight: 400;
    color: #606266;
    .customize-pages {
      width: 130px;
      display: inline-block;
      margin: 5px 10px;
    }
  }
}
</style>
