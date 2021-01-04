<template>
  <div class="drug-warpper">
    <div class="new-btn">
      <el-button @click="createItem" type="primary" size="small" icon="el-icon-plus">新建套餐</el-button>
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
          <el-button @click="createItem" size="small" plain icon="el-icon-plus">新建套餐</el-button>
        </el-col>
        <el-col :span="12" style="text-align: right">
          <el-input  v-model="searchData" size="small" auto-complete="off" style="max-width: 300px"></el-input>
          <el-button @click="searchPacket" size="small" plain icon="el-icon-plus">查询</el-button>
        </el-col>
      </el-row>
      -->

      <edit
        v-if="showEditWindow"
        @refreshList="getPacketsList"
        ref="editWindow"
        :index="index"
        :item="currentItem"
        :productOptions="productAll"
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
        <!--<el-table-column prop="id" label="套餐ID"></el-table-column>-->
        <el-table-column label="套餐图片" width="100">
          <template slot-scope="scope">
            <div>
              <el-tooltip  effect="dark" content="点击文件名可预览" placement="bottom">
                <a :href="scope.row.img_url" data-lightbox="preview"><img :src="scope.row.img_url"  width="50" heigth="50"/></a>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="套餐名称">
          <template slot-scope="scope">
            <div>{{scope.row.name}}</div>
            <div class="list-pack-product">{{showPackProduct(scope.row.pack_product)}}</div>
          </template>
        </el-table-column>
        <!--<el-table-column prop="cname" label="分类"></el-table-column>-->
        <el-table-column prop="pack_price" label="套餐价" sortable width="90"></el-table-column>
        <el-table-column prop="stock" label="每日上架数量"></el-table-column>
        <el-table-column prop="expiry_time" label="生效时段">
          <template slot-scope="scope">
            <div>{{showExpiryTime(scope.row.expiry_time)}}</div>
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
import { mapState, mapMutations, mapActions } from 'vuex'
import lightbox from 'lightbox2'
import '../../../../node_modules/lightbox2/dist/css/lightbox.min.css'
import {Packet} from '../static/js/packet.js'

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
      productAll: [],
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
      showEditWindow: state => state.packet.showEditWindow,
      showStockWindow: state => state.packet.showStockWindow,
      showGalleryWindow: state => state.packet.showGalleryWindow,
      loading: state => state.packet.loading,
      pagesList: state => state.packet.packetsPageList
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
      'GET_PACKETS_PAGE_LIST','SHOW_STOCK_WINDOW', 'SHOW_EDIT_WINDOW', 'UPDATE_LOADING_STATUS', 'SHOW_GALLERY_WINDOW'
    ]),

    ...mapActions([
      'getPacketsPageList',
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
     * *删除商品
     * **/
    deleteProduct(val){
      if (val == '') {
        if(this.multipleSelection.length == 0){
          this.$message('请选择要删除的套餐！')
          return
        }
        val = this.getListId()
      }
      this.$confirm("删除商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        Packet.remove (val)
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
            this.getPacketsPageList({
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
     * 上下架
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
      this.$confirm("上下架套餐, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        Packet.sale (data)
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
            this.getPacketsPageList({
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

    getPacketsList () {},

    handleCurrentChange (val) {
      this.UPDATE_LOADING_STATUS(true)
      this.currentPage = val
      this.getSearchPageList(val)
    },

    getSearchPageList (val) {
      this.UPDATE_LOADING_STATUS(true)
      this.getPacketsPageList({
        page: val,
        perpage: this.customizePages
      })
    },

    searchPacket(){
      this.getPacketsPageList({
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
        this.$message('请选择要操作的套餐！')
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
      dateArr = dateArr.substring(5, 10) + '至' + dateArr.substring(16)
      return dateArr
    },

    /*
    * 获取菜品-选择套餐商品
    */
    getProductOptions () {
      Packet.allProducts ()
        .then(res => {
          let obj = res.data.message
          for (let o in obj) {
            this.productAll.push(obj[o])
          }
        })
        .catch(function(error) {
          alert(error.response.data.msg);
        });
    },

    /*
    * 套餐名称-第二行显示包含菜品
    */
    showPackProduct (val) {
      let pack = JSON.parse(JSON.stringify(val))
      let packString = ''
      for (let i=0; i<pack.length; i++) {
        if (i == 0) {
          packString += pack[i].name
        } else {
          packString += '+' + pack[i].name
        }
      }
      packString = '(' + packString + ')'
      return packString
    },

    /*
    * 根据当天星期几显示对应生效时段设置
    */
    showExpiryTime (val) {
      let expiryTime = val
      if (expiryTime.indexOf(',') > -1) {
        const day = new Date().getDay()
        const timeArr = expiryTime.split(',')
        expiryTime = timeArr[day]
      }
      return expiryTime
    }
  },

  mounted () {
    this.getPacketsPageList({
      page: this.currentPage,
      perpage: this.customizePages
    })
    this.getProductsTypeList()
    if (this.productAll.length == 0){
      this.getProductOptions()
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
.list-pack-product {
  font-size: 10px;
  color: #999999;
}
</style>
