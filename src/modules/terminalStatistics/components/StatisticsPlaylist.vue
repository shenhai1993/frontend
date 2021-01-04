<template>
  <div  class="role-warpper">
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
    <div  class="rateContent" v-if="activedPath === 'playlists'">
      <el-table :data="tableData" highlight-current-row :height="tableHeight" style="width: 100%" v-loading="loadingStatus">
        <el-table-column prop="stat_at" label="统计时间"></el-table-column>
        <el-table-column prop="online_amount" label="播出单在线数"></el-table-column>
        <el-table-column prop="total_amount" label="播出单总数"></el-table-column>
        <el-table-column prop="new_amount" label="播出单新增数"></el-table-column>
      </el-table>
    </div>
    <div class="rateContent" v-if="activedPath === 'contents'">
      <el-table :data="tableData" highlight-current-row :height="tableHeight" style="width: 100%" v-loading="loadingStatus">
        <el-table-column prop="stat_at" label="统计时间"></el-table-column>
        <el-table-column prop="online_amount" label="在线内容数"></el-table-column>
        <el-table-column prop="total_amount" label="总时长"></el-table-column>
        <el-table-column prop="new_amount" label="新增内容数量"></el-table-column>
        <el-table-column prop="ratings" label="收视率"></el-table-column>
      </el-table>
    </div>
    <div class="rateContent" v-if="activedPath === 'terminals_stat'">
      <el-table :data="tableData" highlight-current-row :height="tableHeight" style="width: 100%" v-loading="loadingStatus">
        <el-table-column prop="stat_at" label="统计日期"></el-table-column>
        <el-table-column prop="online_amount" label="在线数"></el-table-column>
        <el-table-column prop="total_amount" label="终端总数"></el-table-column>
        <el-table-column prop="online_rate" label="在线率"></el-table-column>
        <el-table-column prop="online_duration" label="在线时长"></el-table-column>
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
  import refreshbutton from '@/components/RefreshButton.vue'
  import {setTime} from "../static/js/time";

  export default {
    data () {
      return {
        loading: true,
        tableData: [],
        customizePages: 30,
        currentPage: 1,
        total: 0,
        datevalue: ["2019-11-11","2020-06-10"],
        tableHeight: window.innerHeight - 300,
      }
    },

    computed: {
      ...mapState({
        setGroupId: state => state.terminalStatistics.setGroupId,
        setDataList: state => state.terminalStatistics.setDataList,
        loadingStatus: state => state.terminalStatistics.loadingStatus
      }),
      activedPath () {
        let path = this.$route.path
        return path.split('/').pop()
      },
    },
    watch: {
      setGroupId(val) {
        this.getStatisticsElement(val,this. activedPath, this.datevalue[0],this.datevalue[1])
      },
      setDataList: {
        handler (n) {
          this.tableData = n
        },
        deep: true
      },
      activedPath: {
        handler (n) {
          this.getStatisticsElement(this.setGroupId, n, this.datevalue[0],this.datevalue[1])
        },
        deep: true
      }
    },
    created() {
      let res = setTime.getTimeFn()
      this.getStatisticsElement(this.setGroupId,this.activedPath,res[0],res[1])
      this.datevalue = res
    },
    methods: {
      ...mapMutations(['SET_LOADING_STATUS']),

      ...mapActions(['getPlaysList']),
      /**
       * 查询统计数据
       * */
      getStatisticsElement(id, activedPath, start , end){
        this.SET_LOADING_STATUS(true)
        this.getPlaysList({ id:id, path:this.activedPath, starttime:start, endtime:end, page:this.currentPage, perPage: this.customizePages }).then(res=>{
          this.total = res.data.message.total
        })
      },
      /**
       * 按日期查询统计数据
       * */
      search(){
        this.getStatisticsElement(this.setGroupId,this.activedPath, this.datevalue[0],this.datevalue[1])
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
<style lang="scss">
  .libox{
    display: inline-block;
  }
</style>
