<template>
  <div class="drug-warpper">
    <div class="new-btn">
      <el-row>
        <el-col :span="12">
          <el-button @click="createItem" size="small" plain icon="el-icon-plus">新增药品</el-button>
        </el-col>
        <el-col :span="12" style="text-align: right">
          <el-input  v-model="searchData" size="small" auto-complete="off" style="max-width: 300px"></el-input>
          <el-button @click="searchDrug" size="small" plain icon="el-icon-plus">查询</el-button>
        </el-col>
      </el-row>
      <edit v-if="showEditWindow" @refreshList="getDrugsList"
      ref="editWindow"
      :index="index" :item="currentItem"
      ></edit>
    </div>
    <el-table v-loading="loading" :data="pagesList.data" highlight-current-row height="calc(100% - 60px)">
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="name" label="药品名称"></el-table-column>
        <el-table-column prop="sku" label="sku货号"></el-table-column>
        <el-table-column show-overflow-tooltip  label="商品图片">
          <template slot-scope="scope">
            <div>
              <el-tooltip  effect="dark" content="点击文件名可预览" placement="bottom">
<!--                <a :href="scope.row.img_url" data-lightbox="preview" style="color: #0000ff;">-->
<!--                  {{ scope.row.img_path }}-->
<!--                </a>-->
                <a :href="scope.row.img_url" data-lightbox="preview"><img :src="scope.row.img_url"  width="50" heigth="50"/></a>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="spec" label="商品规格"></el-table-column>
        <el-table-column align="center" prop="buy_price_avg" width="150px">
          <template slot="header" slot-scope="scope">
            <span>商品平均进货价</span>
            <el-tooltip class="item" effect="dark" content="如果商品多次进价货不同，系统会结合每批进货数量自动计算商品平均进货价" placement="right">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="sell_price" label="销售价"></el-table-column>
        <el-table-column align="center" label="库存数量（个）" prop="stock" width="130px">
          <template slot-scope="scope">
            <div>{{scope.row.stock_consume}}/{{scope.row.stock}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="库存金额（金额）" prop="stock_price" width="150px"></el-table-column>
        <el-table-column align="center" label="厂家" prop="manufacturer"></el-table-column>
        <el-table-column width="120px" label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip  class="item" effect="dark" content="编辑" placement="bottom">
              <el-button type="text" size="mini" @click="editDrug(scope, scope.$index)">
                <i class="fa fa-pencil"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip  class="item" effect="dark" content="新增库存" placement="bottom">
              <el-button type="text" size="mini" @click="addStock(scope, scope.$index)">
                <i class="fa fa-plus"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip  class="item" effect="dark" content="设置图库" placement="bottom">
              <el-button type="text" size="mini" @click="setGallery(scope)">
                <i class="fa fa-image"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
              <el-button type="text" size="mini" @click="deleteDrug(scope.row.id)">
                <i class="fa fa-trash"></i>
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
    </el-table>
    <Stock v-if="showStockWindow"
           ref="editStockWindow"
           :index="index" :item="currentItem"></Stock>
    <Gallery v-if="showGalleryWindow"
           ref="editGalleryWindow"
           :item="currentItem"></Gallery>
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
import Stock from './stock'
import Gallery from './gallery'
import { mapState, mapMutations, mapActions } from 'vuex'
import lightbox from 'lightbox2'
import '../../../../node_modules/lightbox2/dist/css/lightbox.min.css'
import {Drug} from '../static/js/drug.js'

export default {
  components: {
     Edit, Stock, Gallery
  },

  data () {
    return {
      show: false,
      // loading: false,
      currentItem: {},
      fileList:[],
      searchData: '',
      // pagesList: {},
      index: -1,
      currentPage: 1,
      customizePages: 5 // 用户自定义页数 默认15
    }
  },
  computed: {
    ...mapState({
      showEditWindow: state => state.drug.showEditWindow,
      showStockWindow: state => state.drug.showStockWindow,
      showGalleryWindow: state => state.drug.showGalleryWindow,
      loading: state => state.drug.loading,
      pagesList: state => state.drug.drugsPageList
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
      'GET_DRUGS_PAGE_LIST','SHOW_STOCK_WINDOW', 'SHOW_EDIT_WINDOW', 'UPDATE_LOADING_STATUS', 'SHOW_GALLERY_WINDOW'
    ]),

    ...mapActions([
      'getDrugsPageList',
      'getDrugsTypeList'
    ]),
    preview (index, files) {
      // preview image/video/audio
    },
    /**
     * *添加药品
     * **/
    createItem() {
      this.currentItem = { id: 0}
      this.SHOW_EDIT_WINDOW(true)
    },
    /**
     * *编辑更新药品
     * **/
    editDrug(scope){
      this.currentItem = scope.row
      this.SHOW_EDIT_WINDOW(true)
    },
    /**
     * * 新增库存
     * **/
    addStock(scope) {
      this.currentItem = scope.row
      this.SHOW_STOCK_WINDOW(true)
    },

    /**
     * * 设置图库
     * **/
    setGallery(scope) {
      this.currentItem = scope.row
      this.SHOW_GALLERY_WINDOW(true)
    },

    /**
     * *删除药品
     * **/
    deleteDrug(val){
      this.$confirm("删除药品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        Drug.remove (val)
          .then(res => {
            this.$message({
              type: "success",
              message: res.data.message
            });
            this.getDrugsPageList({
              page: 1,
              perpage:5
            })
          })
          .catch(function(error) {
            alert(error.response.data.msg);
          });
      })
    },
    _notify (title, message, type) {
      this.$notify({
        title,
        message,
        type
      })
    },

    /* getDrugsList () {
      this.loading = true
      this.getDrugs().then(res => {
        setTimeout(() => {
          this.loading = false
        }, 500)
      })
    }, */
    getDrugsList(){
    },
    handleCurrentChange (val) {
      this.UPDATE_LOADING_STATUS(true)
      this.currentPage = val
      this.getSearchPageList(val)
    },

    getSearchPageList (val) {
      this.UPDATE_LOADING_STATUS(true)
      this.getDrugsPageList({
        page: val,
        perpage: this.customizePages
      })
    },
    searchDrug(){
      this.getDrugsPageList({
        key: this.searchData
      })
    }
  },

  mounted () {
    this.getDrugsPageList({
      page: 1,
      perpage:5
    })
    this.getDrugsTypeList()
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
