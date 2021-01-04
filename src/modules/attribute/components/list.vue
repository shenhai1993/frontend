<template>
  <div class="drug-warpper">
    <div class="new-btn">
      <el-button @click="createItem" type="primary" size="small" icon="el-icon-plus">新增属性</el-button>
      <el-button @click="deleteAttribute('')" size="small">删除选中项</el-button>

      <!--
      <el-row>
        <el-col :span="12">
          <el-button @click="createItem" size="small" plain icon="el-icon-plus">新增属性</el-button>
        </el-col>
        <el-col :span="12" style="text-align: right">
          <el-input  v-model="searchData" size="small" auto-complete="off" style="max-width: 300px"></el-input>
          <el-button @click="searchAttribute" size="small" plain icon="el-icon-plus">查询</el-button>
        </el-col>
      </el-row>
      -->

      <edit
        v-if="showEditWindow"
        @refreshList="getAttributesList"
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
        <el-table-column prop="name" label="菜品属性" width="150"></el-table-column>
        <el-table-column prop="con" label="属性分类"></el-table-column>
        <el-table-column prop="sort" label="权重" sortable></el-table-column>
        <el-table-column label="操作" width="130">
          <template slot-scope="scope">
            <el-button @click="editAttribute(scope, scope.$index)" type="text" size="small">编辑</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button @click="deleteAttribute(scope.row.id)" type="text" size="small">删除</el-button>
          </template>

          <!--
          <template slot-scope="scope">
            <el-tooltip  class="item" effect="dark" content="编辑" placement="bottom">
              <el-button type="text" size="mini" @click="editAttribute(scope, scope.$index)">
                <i class="fa fa-pencil"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
              <el-button type="text" size="mini" @click="deleteAttribute(scope.row.id)">
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
import {Attribute} from '../static/js/attribute.js'

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
      showEditWindow: state => state.attribute.showEditWindow,
      loading: state => state.attribute.loading,
      pagesList: state => state.attribute.attributesPageList
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
      'GET_ATTRIBUTE_PAGE_LIST', 'SHOW_EDIT_WINDOW', 'UPDATE_LOADING_STATUS'
    ]),

    ...mapActions([
      'getAttributesPageList',
      'getProductsTypeList'
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
    editAttribute(scope){
      this.currentItem = JSON.parse(JSON.stringify(scope.row))
      this.SHOW_EDIT_WINDOW(true)
    },

    /**
     * *删除
     * **/
    deleteAttribute(val){
      if (val == '') {
        if(this.multipleSelection.length == 0){
          this.$message('请选择要删除的分类！');
          return
        }
        let arr = JSON.parse(JSON.stringify(this.multipleSelection))
        let _id = ''
        for(let i=0; i<arr.length; i++){
          if(_id == '') _id += arr[i].id
          else _id += ',' + arr[i].id
        }
        val = _id
      }
      this.$confirm("删除所选分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        Attribute.remove (val)
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
            this.getAttributesPageList({
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

    _notify (title, message, type) {
      this.$notify({
        title,
        message,
        type
      })
    },

    getAttributesList(){
    },

    handleCurrentChange (val) {
      this.UPDATE_LOADING_STATUS(true)
      this.currentPage = val
      this.getSearchPageList(val)
    },

    getSearchPageList (val) {
      this.UPDATE_LOADING_STATUS(true)
      this.getAttributesPageList({
        page: val,
        perpage: this.customizePages
      })
    },

    searchAttribute(){
      this.getAttributesPageList({
        key: this.searchData
      })
    },

    handleSelectionChange (val) {
      this.multipleSelection = val
    }
  },

  mounted () {
    this.getAttributesPageList({
      page: this.currentPage,
      perpage: this.customizePages
    })
    this.getProductsTypeList()
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
