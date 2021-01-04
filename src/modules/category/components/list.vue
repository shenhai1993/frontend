<template>
  <div class="drug-warpper">
    <div class="new-btn">
      <el-button @click="createItem" type="primary" size="small" icon="el-icon-plus">新增分类</el-button>
      <el-dropdown @command="handleCommand">
        <el-button size="small">
          更多操作<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="open">开启</el-dropdown-item>
          <el-dropdown-item command="close">关闭</el-dropdown-item>
          <el-dropdown-item command="delete">删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <!--
      <el-row>
        <el-col :span="12">
          <el-button @click="createItem" size="small" plain icon="el-icon-plus">新增分类</el-button>
        </el-col>
        <el-col :span="12" style="text-align: right">
          <el-input  v-model="searchData" size="small" auto-complete="off" style="max-width: 300px"></el-input>
          <el-button @click="searchCategory" size="small" plain icon="el-icon-plus">查询</el-button>
        </el-col>
      </el-row>
      -->

      <edit
        v-if="showEditWindow"
        @refreshList="getCategoriesList"
        ref="editWindow"
        :index="index"
        :item="currentItem"
        :customizePages="customizePages"
        :currentPage="currentPage">
      </edit>
    </div>
    <div class="drug-warpper-main">
      <el-table
        v-loading="loading"
        :data="pagesList.data"
        style="width: 100%"
        height="100%"
        @selection-change="handleSelectionChange">

        <!--<el-table-column prop="id" label="ID"></el-table-column>-->

        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="分类图标" width="100">
          <template slot-scope="scope">
            <div>
              <el-tooltip effect="dark" content="点击文件名可预览" placement="bottom">
                <a :href="scope.row.picurlPath" data-lightbox="preview"><img :src="scope.row.picurlPath"  width="50" heigth="50"/></a>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="菜品分类"></el-table-column>
        <el-table-column prop="sort" label="权重" sortable></el-table-column>
        <el-table-column prop="issale" label="状态">
          <template slot-scope="scope">
            <div v-if="scope.row.islock == 0" class="dot-open"><span></span>开启</div>
            <div v-else="" class="dot-close"><span></span>关闭</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130">
          <template slot-scope="scope">
            <el-button @click="editCategory(scope, scope.$index)" type="text" size="small">编辑</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button @click="deleteCategory(scope.row.id)" type="text" size="small">删除</el-button>
          </template>

          <!--
          <template slot-scope="scope">
            <el-tooltip  class="item" effect="dark" content="编辑" placement="bottom">
              <el-button type="text" size="mini" @click="editCategory(scope, scope.$index)">
                <i class="fa fa-pencil"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
              <el-button type="text" size="mini" @click="deleteCategory(scope.row.id)">
                <i class="fa fa-trash"></i>
              </el-button>
            </el-tooltip>
          </template>
          -->

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
import {Category} from '../static/js/category.js'

export default {
  components: {
     Edit
  },
  data () {
    return {
      show: false,
      saleParam: {
        id: 0,
        issale: 0,
        isrecommend: 0
      },
      currentItem: {},
      fileList:[],
      searchData: '',
      index: -1,
      currentPage: 1,
      customizePages: 5,
      multipleSelection: []
    }
  },
  computed: {
    ...mapState({
      showEditWindow: state => state.category.showEditWindow,
      loading: state => state.category.loading,
      pagesList: state => state.category.categoriesPageList
    })
  },
  mounted () {
    lightbox.option({
      'resizeDuration': 200,
      'wrapAround': true,
      'maxWidth': 1024,
      'maxheight': 768,
      'showImageNumberLabel': false
    })
  },
  methods: {
    ...mapMutations([
      'GET_CATEGORY_PAGE_LIST', 'SHOW_EDIT_WINDOW', 'UPDATE_LOADING_STATUS'
    ]),

    ...mapActions([
      'getCategoriesPageList'
    ]),

    preview (index, files) {
      // preview image/video/audio
    },

    /**
     * *添加
     * **/
    createItem() {
      this.currentItem = { id: 0}
      this.SHOW_EDIT_WINDOW(true)
    },

    /**
     * *编辑更新
     * **/
    editCategory(scope){
      this.currentItem = JSON.parse(JSON.stringify(scope.row))
      this.SHOW_EDIT_WINDOW(true)
    },

    /**
     * *删除
     * **/
    deleteCategory(val){
      if (val == '') {
        if(this.multipleSelection.length == 0){
          this.$message('请选择要删除的分类！')
          return
        }
        val = this.getListId()
      }
      this.$confirm("删除所选分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        Category.remove (val)
          .then(res => {
            if (!res.data.success) {
              this.$message({
                type: "error",
                message: res.data.message
              })
              return
            }

            this.$message({
              type: "success",
              message: res.data.message
            });
            this.currentPage = 1
            this.getCategoriesPageList({
              page: this.currentPage,
              perpage: this.customizePages
            })
          })
          .catch((error) => {
            this.$message({
              type: "error",
              message: error.response.data.msg
            })
          })
      })
    },

    /*
    * 获取列表id
    * */
    getListId () {
      let arr = JSON.parse(JSON.stringify(this.multipleSelection))
      let _id = ''
      for(let i=0; i<arr.length; i++){
        if(_id == '') _id += arr[i].id
        else _id += ',' + arr[i].id
      }
      return _id
    },

    _notify (title, message, type) {
      this.$notify({
        title,
        message,
        type
      })
    },

    getCategoriesList(){
    },

    handleCurrentChange (val) {
      this.UPDATE_LOADING_STATUS(true)
      this.currentPage = val
      this.getSearchPageList(val)
    },

    getSearchPageList (val) {
      this.UPDATE_LOADING_STATUS(true)
      this.getCategoriesPageList({
        page: val,
        perpage: this.customizePages
      })
    },

    searchCategory(){
      this.getCategoriesPageList({
        key: this.searchData
      })
    },

    handleSelectionChange (val) {
      this.multipleSelection = val
    },

    handleCommand (com) {
      if (com == 'delete') {
        this.deleteCategory('')
      } else {
        this.setCategory(com)
      }
    },

    setCategory (type) {
      if(this.multipleSelection.length == 0){
        this.$message('请选择要操作的分类！')
        return
      }
      let id = ''
      const val = this.getListId()
      let data = {}
      if (type == 'open'){
        data = {
          id: val,
          islock: 0
        }
      } else if (type == 'close') {
        data = {
          id: val,
          islock: 1
        }
      }

      Category.categorypack (data)
        .then(res => {
          if (!res.data.success) {
            this.$message({
              type: "error",
              message: res.data.message
            })
            return
          }

          this.$message({
            type: "success",
            message: res.data.message
          });
          this.getCategoriesPageList({
            page: this.currentPage,
            perpage: this.customizePages
          })
        })
        .catch((error) => {
          this.$message({
            type: "error",
            message: error.response.data.msg
          })
        })
    }
  },

  mounted () {
    this.getCategoriesPageList({
      page: this.currentPage,
      perpage: this.customizePages
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
