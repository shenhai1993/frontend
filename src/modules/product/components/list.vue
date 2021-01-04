<template>
  <div class="drug-warpper">
    <div class="new-btn">
      <el-button @click="createItem" type="primary" size="small" icon="el-icon-plus">新增菜品</el-button>
      <el-dropdown @command="handleCommand">
        <el-button size="small">
          更多操作<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="open">上架</el-dropdown-item>
          <el-dropdown-item command="close">下架</el-dropdown-item>
          <el-dropdown-item command="delete">删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <!--
      <el-row>
        <el-col :span="12">
          <el-button @click="createItem" size="small" plain icon="el-icon-plus">新增菜品</el-button>
        </el-col>
        <el-col :span="12" style="text-align: right">
          <el-input  v-model="searchData" size="small" auto-complete="off" style="max-width: 300px"></el-input>
          <el-button @click="searchProduct" size="small" plain icon="el-icon-plus">查询</el-button>
        </el-col>
      </el-row>
      -->

      <edit
        v-if="showEditWindow"
        @refreshList="getProductsList"
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
        <el-table-column type="selection" width="55"></el-table-column>
        <!--<el-table-column prop="id" label="菜品ID" width="70"></el-table-column>-->
        <el-table-column label="菜品图片" width="100">
          <template slot-scope="scope">
            <div>
              <el-tooltip  effect="dark" content="点击文件名可预览" placement="bottom">
                <a :href="scope.row.img_url" data-lightbox="preview"><img :src="scope.row.img_url"  width="50" heigth="50"/></a>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="菜品名称"></el-table-column>
        <el-table-column prop="cname" label="分类"></el-table-column>
        <el-table-column prop="buy_price" label="单价" sortable width="76"></el-table-column>
        <el-table-column prop="sell_price" label="折扣价" sortable width="90"></el-table-column>
        <el-table-column prop="stock" label="库存">
          <template slot-scope="scope">
            <div>{{scope.row.stock}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="issale" label="库存状态">
          <template slot-scope="scope">
            <div v-if="scope.row.ifalert == 0"><font color=green>库存充足</font></div>
            <div v-else=""><font color=red>库存报警</font></div>
          </template>
        </el-table-column>
        <el-table-column prop="expiry_date" label="生效时段">
          <template slot-scope="scope">
            <div>{{showExpiryDate(scope.row.expiry_date)}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="issale" label="状态">
          <template slot-scope="scope">
            <div v-if="scope.row.issale == 1" class="dot-open"><span></span>已上架</div>
            <div v-else="" class="dot-close"><span></span>未上架</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130">
          <template slot-scope="scope">
            <el-button @click="editProduct(scope, scope.$index)" type="text" size="small">编辑</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button @click="deleteProduct(scope.row.id)" type="text" size="small">删除</el-button>
          </template>

          <!--
          <template slot-scope="scope">
            <el-tooltip  class="item" effect="dark" content="编辑" placement="bottom">
              <el-button type="text" size="mini" @click="editProduct(scope, scope.$index)">
                <i class="fa fa-pencil"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip  class="item" effect="dark" content="上架" placement="bottom" v-if="scope.row.issale === 0">
              <el-button type="text" size="mini" @click="saleProduct(scope)">
                <i class="fa fa-shield fa-rotate-180 greenHover"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip  class="item" effect="dark" content="下架" placement="bottom" v-if="scope.row.issale === 1">
              <el-button type="text" size="mini" @click="saleProduct(scope)">
                <i class="fa fa-shield greenHover"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
              <el-button type="text" size="mini" @click="deleteProduct(scope.row.id)">
                <i class="fa fa-trash"></i>
              </el-button>
            </el-tooltip>
          </template>
          -->

        </el-table-column>
      </el-table>
    </div>

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
import {Product} from '../static/js/product.js'

export default {
  components: {
     Edit, Stock, Gallery
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
      showEditWindow: state => state.product.showEditWindow,
      showStockWindow: state => state.product.showStockWindow,
      showGalleryWindow: state => state.product.showGalleryWindow,
      loading: state => state.product.loading,
      pagesList: state => state.product.productsPageList
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
      'GET_PRODUCTS_PAGE_LIST','SHOW_STOCK_WINDOW', 'SHOW_EDIT_WINDOW', 'UPDATE_LOADING_STATUS', 'SHOW_GALLERY_WINDOW'
    ]),

    ...mapActions([
      'getProductsPageList',
      'getProductsTypeList'
    ]),

    preview (index, files) {
      // preview image/video/audio
    },

    /**
     * *添加商品
     * **/
    createItem() {
      this.currentItem = { id: 0}
      this.SHOW_EDIT_WINDOW(true)
    },

    /**
     * *编辑更新商品
     * **/
    editProduct(scope){
      this.currentItem = JSON.parse(JSON.stringify(scope.row))
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
     * *删除商品
     * **/
    deleteProduct(val){
      if (val == '') {
        if(this.multipleSelection.length == 0){
          this.$message('请选择要删除的菜品！')
          return
        }
        val = this.getListId()
      }
      this.$confirm("请确认套餐是否包含该商品，再删除！", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        Product.remove (val)
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
            })
            this.currentPage = 1
            this.getProductsPageList({
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

    /**
     * 上下架商品
     */
    saleProduct(val, type){
      let id = ''
      let issale = 0
      if (val == '') {
        id = this.getListId()
        issale = type
      } else {
        id = val.row.id
        issale = val.row.issale == 0 ? 1 : 0
      }

      let data
      this.saleParam = {
        id: id,
        issale: issale
      }
      data = this.saleParam
      this.$confirm("上下架商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        Product.sale (data)
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
            this.getProductsPageList({
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

    /**
     * 推荐商品
     */
    recommendProduct(val){
      let data
      this.saleParam = {
        id: val.row.id,
        isrecommend: val.row.isrecommend == 0 ? 1 : 0
      }
      data = this.saleParam
      this.$confirm("推荐商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        Product.recommend (data)
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
            this.getProductsPageList({
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

    packProduct(val){
      let data
      this.saleParam = {
        id: val.row.id,
        ispack: val.row.ispack == 0 ? 1 : 0
      }
      data = this.saleParam
      this.$confirm("套餐商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        Product.pack (data)
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
            this.getProductsPageList({
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

    getProductsList(){
    },

    handleCurrentChange (val) {
      this.UPDATE_LOADING_STATUS(true)
      this.currentPage = val
      this.getSearchPageList(val)
    },

    getSearchPageList (val) {
      this.UPDATE_LOADING_STATUS(true)
      this.getProductsPageList({
        page: val,
        perpage: this.customizePages
      })
    },

    searchProduct(){
      this.getProductsPageList({
        key: this.searchData
      })
    },

    handleSelectionChange (val) {
      this.multipleSelection = val
    },

    handleCommand (com) {
      if (com == 'delete') {
        this.deleteProduct('')
      } else {
        this.setProduct(com)
      }
    },

    setProduct (type) {
      if(this.multipleSelection.length == 0){
        this.$message('请选择要操作的菜品！')
        return
      }

      let _type = type == 'open' ? 1 : 0
      this.saleProduct('', _type)
    },

    /*
    * 生效日期的显示方式
    */
    showExpiryDate (val) {
      let dateArr = JSON.parse(JSON.stringify(val))
      const days = this.onlyOneDay(val)
      if (days <= 1) {
        dateArr = dateArr.substring(5, 10)
      } else {
        dateArr = dateArr.substring(5, 10) + '至' + dateArr.substring(16)
      }
      return dateArr
    },

    /*
    * 生效日期仅1天
    */
    onlyOneDay (val) {
      const date = val.split('/')
      const d1 = new Date(date[0])
      const d2 = new Date(date[1])
      const t = d2.getTime() - d1.getTime()
      const days = parseInt(t / (24 * 60 * 60 * 1000))
      return days
    }
  },

  mounted () {
    this.getProductsPageList({
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
