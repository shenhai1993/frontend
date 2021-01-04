<template>
  <div class="drug-warpper">
    <div class="new-btn">
      <el-row>
        <el-col :span="24" style="text-align: right">
          <el-input  v-model="searchData" size="small" auto-complete="off" style="max-width: 300px"></el-input>
          <el-button @click="searchCategory" size="small" plain icon="el-icon-search">查询</el-button>
        </el-col>
      </el-row>
      <edit
        v-if="showEditWindow"
        ref="editWindow"
        :item="currentItem"
        :show="showEditWindow"
        @hideEditWindow="hideEditWindow">
      </edit>
    </div>
    <div class="drug-warpper-main">
      <el-table
        v-loading="loading"
        :data="pagesList.data"
        style="width: 100%"
        height="100%">
        <el-table-column prop="order_sn" label="订单编号"></el-table-column>
        <el-table-column prop="goods_amount" label="订单金额" sortable></el-table-column>
        <el-table-column prop="order_amount" label="支付金额" sortable></el-table-column>
        <el-table-column prop="issale" label="订单状态">
          <template slot-scope="scope">
            <div v-if="scope.row.order_state == 0" class="dot-close"><span></span>已取消</div>
            <div v-if="scope.row.order_state == 10" class="dot-open"><span></span>未支付</div>
            <div v-else="" class="dot-close"><span></span>已付款</div>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="订单时间" sortable></el-table-column>
        <el-table-column label="操作" width="130">
          <template slot-scope="scope">
            <el-button @click="editCategory(scope.row)" type="text" size="small">订单详情</el-button>
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
        :current-page.sync="currentPage"
        :page-size="pagesList.per_page"
        layout="total, prev, pager, next"
        :total="pagesList.total">
      </el-pagination>
    </div>
    <!-- lightbox 2 -->
    <div class="hidden">
      <a v-for="(file, index) in fileList" :key="index" :href="file.path" data-lightbox="roadtrip">{{ file.name }}</a>
    </div>
  </div>
</template>

<script>
import Edit from './edit'
import { mapState, mapMutations, mapActions } from 'vuex'
import lightbox from 'lightbox2'
import '../../../../node_modules/lightbox2/dist/css/lightbox.min.css'

export default {
  components: {
    Edit
  },
  data () {
    return {
      showEditWindow: false,
      currentItem: {},
      fileList:[],
      searchData: '',
      currentPage: 1,
      customizePages: 5,
      multipleSelection: []
    }
  },
  computed: {
    ...mapState({
      loading: state => state.ordering.loading,
      pagesList: state => state.ordering.orderingPageList
    })
  },

  mounted () {
    this.getOrderingPageList({
      page: this.currentPage,
      perpage: this.customizePages
    })
  },

  methods: {
    ...mapMutations([
      'GET_ORDERING_PAGE_LIST', 'UPDATE_LOADING_STATUS'
    ]),

    ...mapActions([
      'getOrderingPageList'
    ]),

    editCategory(row){
      this.currentItem = row
      this.showEditWindow = true
    },

    hideEditWindow () {
      this.showEditWindow = false
    },

    handleCurrentChange (val) {
      this.UPDATE_LOADING_STATUS(true)
      this.currentPage = val
      this.getSearchPageList(val)
    },

    getSearchPageList (val) {
      this.UPDATE_LOADING_STATUS(true)
      this.getOrderingPageList({
        page: val,
        perpage: this.customizePages
      })
    },

    searchCategory(){
      this.getOrderingPageList({
        key: this.searchData
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.drug-warpper{
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
.el-icon-question{
  font-size: 18px;
  vertical-align: text-bottom
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
