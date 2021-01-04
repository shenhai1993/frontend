<template>
  <div class="drug-warpper">
    <div class="new-btn">
      <el-row>
        <el-col :span="12">
          <el-input  v-model="searchKey" size="small" auto-complete="off" style="max-width: 300px"></el-input>
          <el-button @click="searchList" size="small" plain icon="el-icon-search">查询</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table v-loading="loading" :data="pagesList.data" highlight-current-row height="calc(100% - 60px)">
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="suggest" label="是否搜索项">
          <template slot-scope="scope">
            <span v-if="String(scope.row.suggest) === '1'" class="green">是</span>
            <span v-else-if="String(scope.row.suggest) === '0'" class="red">否</span>
          </template>
        </el-table-column>
        <el-table-column prop="count_terminal" label="关联终端数"></el-table-column>
        <el-table-column prop="count_playlist" label="关联播出单数"></el-table-column>
        <el-table-column prop="count_marquee" label="关联跑马灯数"></el-table-column>
        <el-table-column prop="count" label="总关联数"></el-table-column>
        <el-table-column width="190px" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="setSuggest(scope.row)">
              {{ scope.row.suggest ? '取消' : '设置' }}搜索项
            </el-button>
            <el-button type="text" size="mini" @click="deleteItem(scope.row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
    </el-table>
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
        prev-text="上一页"
        next-text="下一页"
        :total="pagesList.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import {Api} from '../static/js/api.js'

export default {
  components: {},

  data () {
    return {
      show: false,
      currentItem: {},
      fileList:[],
      searchKey: '',
      index: -1,
      currentPage: 1,
      customizePages: 15 // 用户自定义页数 默认15
    }
  },
  computed: {
    ...mapState({
      loading: state => state.tag.loading,
      pagesList: state => state.tag.pageList
    })
  },
  mounted () {
    //
  },
  methods: {
    ...mapMutations([
      'SET_PAGE_LIST', 'UPDATE_LOADING_STATUS'
    ]),

    ...mapActions([
      'getPageList', 'getTemplatesTags'
    ]),

    /**
     * *删除标签
     * **/
    deleteItem(val){
      this.$confirm("删除项目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.UPDATE_LOADING_STATUS(true)
        Api.remove (val)
          .then(res => {
            this.UPDATE_LOADING_STATUS(false)
            this.$message({
              type: "success",
              message: res.data.message
            });
            let reloadPage = this.pagesList.data.length == 1 && this.currentPage > 1 ? this.currentPage - 1 : this.currentPage
            this.getPageList({
              page: reloadPage,
              perpage: this.customizePages,
              key: this.searchKey
            })
          }, res => {
            this.UPDATE_LOADING_STATUS(false)
            this.reloadPage()
          })
          .catch(function(error) {
            alert(error.response.data.msg)
          });
      })
    },

    // 设置搜索项
    setSuggest(item){
      let setValue = item.suggest ? 0 : 1
      this.UPDATE_LOADING_STATUS(true)
      Api.setSuggest (item.id, setValue)
        .then(res => {
          this.UPDATE_LOADING_STATUS(false)
          this.$message({
            type: "success",
            message: res.data.message
          });
          this.reloadPage()
        }, res => {
          this.UPDATE_LOADING_STATUS(false)
          this.reloadPage()
        })
        .catch(function(error) {
          alert(error.response.data.msg)
        });
    },

    _notify (title, message, type) {
      this.$notify({
        title,
        message,
        type
      })
    },

    // 更新后重新加载当前页
    reloadPage() {
      this.getPageList({
        page: this.currentPage,
        perpage: this.customizePages,
        key: this.searchKey
      })
      this.getTemplatesTags()
    },

    handleCurrentChange (val) {
      this.currentPage = val
      this.getSearchPageList(val)
    },

    getSearchPageList (val) {
      this.getPageList({
        page: val,
        key: this.searchKey,
        perpage: this.customizePages
      })
    },
    searchList(){
      this.currentPage = 1
      this.getPageList({
        page: 1,
        key: this.searchKey,
        perpage: this.customizePages
      })
    }
  },

  mounted () {
    this.getPageList({
      page: 1,
      perpage:this.customizePages
    })
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
