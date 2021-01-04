<template>
  <div class="role-warpper">
    <div class="new-btn" style="text-align: right">
      <div class="block">
        <el-date-picker
          v-model="datevalue"
          type="datetimerange"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-button @click="search"  icon="el-icon-search">查询</el-button>
      </div>
    </div>
    <div class="rateContent">
      <el-table :data="tableData" style="width: 100%" highlight-current-row :height="tableHeight" v-loading="terminalsloadingStatus">
        <el-table-column prop="element_name" label="素材名称"></el-table-column>
        <el-table-column prop="terminal_number" label="终端编码"></el-table-column>
        <el-table-column prop="playlist_name" label="播出单"></el-table-column>
        <el-table-column prop="content_name" label="内容"></el-table-column>
        <el-table-column prop="count_times" label="时长"></el-table-column>
        <el-table-column prop="count_seconds" label="播放总时长"></el-table-column>
        <el-table-column prop="played_at" label="播放时间"></el-table-column>
      </el-table>
    </div>
    <div class="block pages-block" v-if="total>30" style=" right: 0px; transform: translateX(0%);">
      <el-pagination background
                     @current-change="handleCurrentChange"
                     @size-change="handleSizeChange"
                     :current-page.sync="currentPage"
                     :page-size="customizePages"
                     :page-sizes="[30, 50, 100]"
                     layout="total, prev, pager, next,sizes"
                     prev-text="上一页"
                     next-text="下一页"
                     :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import {setTime} from "../static/js/time"

export default {
  data () {
    return {
      tableData: [],
      tableHeight: window.innerHeight - 300,
      customizePages: 30,
      currentPage: 1,
      total: 0,
      datevalue: [],
    }
  },

  computed: {
    ...mapState({
      setTerminals: state => state.terminalStatistics.setTerminals,
      terminalsList: state => state.terminalStatistics.terminalsList,
      terminalsloadingStatus: state => state.terminalStatistics.terminalsloadingStatus
    })
  },
  watch: {
    setTerminals(val) {
      this.getStatisticsElement(val,this.datevalue[0],this.datevalue[1])
    },
    terminalsList: {
      handler (n) {
        this.tableData = n
      },
      deep: true
    }
  },
  methods: {
    ...mapMutations(['SET_TERMINALSLOADING_STATUS']),

    ...mapActions(['getTerminalsList']),
    /**
     * 查询统计数据
     * */
    getStatisticsElement(id, start , end){
      this.SET_TERMINALSLOADING_STATUS(true)
      this.getTerminalsList({ type:id, starttime:start, endtime:end, page:this.currentPage, perPage: this.customizePages }).then(res=>{
        this.total = res.data.message.total
      })
    },
    /**
     * 按日期查询统计数据
     * */
    search(){
      this.getStatisticsElement(this.setTerminals,this.datevalue[0],this.datevalue[1])
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.search()
    },
    handleSizeChange(val) {
      this.customizePages = val
      this.search()
    },
    refresh () {
      console.log('hh')
    }
  },

  created () {
    let res = setTime.getTimeFn()
    this.getStatisticsElement(this.setTerminals,res[0],res[1])
    this.datevalue = res

  }
}
</script>

<style lang="scss" scoped>
.role-warpper{
  height: 100%;
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
</style>
