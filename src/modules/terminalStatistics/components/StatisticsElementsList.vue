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
      <el-table :data="tableData" style="width: 100%" highlight-current-row :height="tableHeight" v-loading="elementloadingStatus">
        <el-table-column prop="element_id" label="素材ID"></el-table-column>
        <el-table-column prop="element_name" label="素材名称"></el-table-column>
        <el-table-column prop="count_seconds" label="总时长"></el-table-column>
        <el-table-column prop="created_at" label="创建时间"></el-table-column>
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
        datevalue: [],
        customizePages: 30,
        currentPage: 1,
        total: 0,
      }
    },

    computed: {
      ...mapState({
        setElementsId: state => state.terminalStatistics.setElementsId,
        elementsList: state => state.terminalStatistics.elementsList,
        elementloadingStatus: state => state.terminalStatistics.elementloadingStatus
      })
    },
    watch: {
      setElementsId(val) {
        this.getStatisticsElement(val,this.datevalue[0],this.datevalue[1])
      },
      elementsList: {
        handler (n) {
          this.tableData = n
        },
        deep: true
      }
    },
    methods: {
      ...mapMutations(['SET_ELEMENTLOADING_STATUS']),

      ...mapActions(['getElementsLists']),
      /**
       * 查询统计数据
       * */
      getStatisticsElement(id, start , end){
        this.SET_ELEMENTLOADING_STATUS(true)
        this.getElementsLists({ id:id, starttime:start, endtime:end , page:this.currentPage, perPage: this.customizePages }).then(res=>{
          this.total = res.data.message.total
        })
      },
      /**
       * 按日期查询统计数据
       * */
      search(){
        this.getStatisticsElement(this.setElementsId,this.datevalue[0],this.datevalue[1])
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
      this.getStatisticsElement(this.setElementsId,res[0],res[1])
      this.datevalue = res
     // this.getStatisticsElement(this.setElementsId,this.datevalue[0],this.datevalue[1])
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
