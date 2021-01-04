<template>
  <div class="drug-warpper">
    <div  style="position: absolute;left: 10px; top: 0px;z-index: 9">
      <router-link to="edit" slot="subbutton" v-if='!isexpiredPlayLists'>
        <el-tooltip class="item" v-if="addBtnStatus" effect="dark" content="新建内容单" placement="bottom">
          <el-button class="subbutton" size="small">
            <i class="fa fa-plus"> 新建普通内容</i>
          </el-button>
        </el-tooltip>
      </router-link>
      <router-link :to="{path: '/customMade/list', query: {type: 0 }}"  slot="subbutton" >
        <el-tooltip class="item" effect="dark" v-if="addH5BtnStatus" content="新建H5内容单" placement="bottom">
          <el-button class="subbutton" size="small">
            <i class="fa fa-plus"> 新建H5内容</i>
          </el-button>
        </el-tooltip>
      </router-link>
    </div>
    <el-row style="margin-bottom: 15px">
      <el-col :span="24" style="text-align: right" class="verticalMiddle">
        <el-select v-model="direction" @change="changeDirection" size="small" placeholder="请选择屏幕方向">
          <el-option label="全部" value="3"></el-option>
          <el-option label="横屏" value="0"></el-option>
          <el-option label="竖屏" value="1"></el-option>
        </el-select>
        <el-input  v-model="searchData" size="small" auto-complete="off" style="max-width: 300px"></el-input>
        <el-button @click="searchDrug" size="small" plain icon="el-icon-search">查询</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="pagesList.data" highlight-current-row height="calc(100% - 100px)">
        <el-table-column label="状态" width="50px" align="center">
          <template slot-scope="scope">
            <el-tooltip v-if="scope.row.is_use=== 0" effect="dark" content="可用" placement="bottom">
              <i class="fa fa-caret-right" style="color: #67C23A"></i>
            </el-tooltip>
            <el-tooltip v-else effect="dark" content="使用中" placement="bottom">
              <i class="fa fa-check-circle"></i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="ID" width="60px"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="template_id" label="模板ID"></el-table-column>
        <el-table-column prop="duration" label="时长" width="160"></el-table-column>
        <el-table-column label="屏幕方位">
          <template slot-scope="scope">
            <div v-if="scope.row.direction=== 0">横屏</div>
            <div v-else>竖屏</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间" prop="created_at" width="160"></el-table-column>
        <el-table-column align="center" label="更新时间" prop="updated_at" width="160"></el-table-column>
        <el-table-column width="120px" label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑"  placement="bottom" v-if="scope.row.ctype !==1">
              <el-button type="text" size="mini" @click="editorData(scope.row.id)">
                <i class="fa fa-pencil"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑"  placement="bottom" v-if="scope.row.ctype ===1">
              <el-button type="text" size="mini" @click="itemData(scope.row)">
                <i class="fa fa-pencil"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="预览" placement="bottom"  v-if="scope.row.ctype!==1">
              <el-button type="text" size="mini" @click="_preview(scope.row.id)">
                <i class="fa fa-play-circle"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="预览" placement="bottom"  v-if="scope.row.ctype ===1">
              <el-button type="text" size="mini" @click="previewTemplate(scope.row)">
                <i class="fa fa-play-circle"></i>
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
      <el-dialog @close="previewClose" append-to-body  width="1000px" :visible.sync="previewShow">
        <preview ref="preview" :playlist="currentPlaylist"></preview>
      </el-dialog>
    </div>
    <el-dialog :width="screenWidth" style="zoom: 0.5;text-align: center"
               class="size28"
               :class="{'screenBox':screenBox}"
               :close-on-click-modal="false"
               @close="htmlPaneClose"
               :visible.sync="htmlPanelShow">
              <html-panel :url.asyc="templateurl"></html-panel>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import preview from '../lib/preview'
import HtmlPanel from '../../customMade/componts/HtmlPanel'
import {Drug} from '../static/js/drug.js'
import VueCookie from "vue-cookies"
import http from '@static/js/utils/http'
import {SET_SELECT_REGIONES} from "../store/mutation-types";

export default {
  components: {
    preview, HtmlPanel
  },
  data () {
    return {
      show: false,
      // loading: false,
      currentItem: {},
      fileList:[],
      searchData: '',
      direction: '',
      isexpiredPlayLists: false,
      currentPlaylist: null,
      previewShow: false,
      templateurl: '',
      screenBox: false,
      screenWidth: '2000px',
      htmlPanelShow: false,
      addH5BtnStatus: true,
      addBtnStatus: true,
      // pagesList: {},
      index: -1,
      currentPage: 1,
      customizePages: 15 // 用户自定义页数 默认15
    }
  },
  computed: {
    ...mapState({
      loading: state => state.drugs.loading,
      pagesList: state => state.drugs.drugsPageList
    })
  },
  methods: {
    ...mapMutations([
      'GET_DRUGS_PAGE_LIST',  'UPDATE_LOADING_STATUS', 'SET_CUSTOM_JUMP_URL', 'SET_SELECT_REGIONES'
    ]),

    ...mapActions([
      'getContentsPageList', 'getTemplatesData', 'getPreviewTemplatesData'
    ]),
    preview (index, files) {
      // preview image/video/audio
    },
    _preview (id) {
      http.get('content/' + id)
        .then(res => {
          let playlist = res.data.message
          let arr = []
          arr.push(playlist.tpl)
          this.currentPlaylist = arr
          this.previewShow = true
        })
        .catch(err => {
          console.log(err)
        })
    },
    previewTemplate(item) {
      this.screenWidth = item.direction===0?'2000px':'1130px'
      this.screenBox = item.direction===0?false:true
      this.htmlPanelShow = true
      this.getTemplatesData(item.id).then(
        res => {
          this.SET_SELECT_REGIONES(res.data.message.data[0])
          this.templateurl =res.data.message.data[0].h5template.html_path
          sessionStorage.setItem('regiones',JSON.stringify(res.data.message.data[0]))
          sessionStorage.setItem('url',JSON.stringify(res.data.message.data[0].h5template.html_path))
          let str = this.templateurl.lastIndexOf("/")
          let lingVal = this.templateurl.substring(0,str) // 通过传过来的html连接
          const link = document.createElement('link')
          link.type = 'text/css'
          link.rel = 'stylesheet'
          link.href = lingVal+'/css/style.css'
          link.setAttribute('id', 'newCss') // 动态拼接css 并为其赋上id
          let oldCssId = document.getElementById('newCss') // 排查页面上是否已有拼接的class
          if(oldCssId) {
            document.getElementById('newCss').href = link.href // 替换拼接的css
          } else {
            document.head.appendChild(link) // 动态添加css
          }
        })

    },
    htmlPaneClose(){
      this.templateurl = ''
      this.htmlPanelShow = false
    },
    previewClose () {
      this.previewShow = false
      // this.currentPlaylist = []
    },
    /**
     * * 监听编辑列表
     * **/
    itemData(item) {
      this.getTemplatesData(item.id).then(
        res => {
          this.$router.push({path: '/customMade/edit',query:{ id: item.id,d:item.direction}})
          this.SET_CUSTOM_JUMP_URL(res.data.message.data[0].h5template.html_path)
          sessionStorage.setItem('regiones',JSON.stringify(res.data.message.data[0]))
          sessionStorage.setItem('url',JSON.stringify(res.data.message.data[0].h5template.html_path))
          this.SET_SELECT_REGIONES(res.data.message.data[0])
        }
      )
      //this.$store.state.selectItemData = val
    },
    editorData(id){
      this.$router.push({path: `/content/edit/${id}`})
    },
    /**
     * *删除内容单
     * **/
    deleteDrug(val){
      this.$confirm("删除内容, 是否继续?", "提示", {
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
            let reloadPage = this.pagesList.data.length == 1 && this.currentPage > 1 ? this.currentPage - 1 : this.currentPage
            this.getContentsPageList({
              page: reloadPage,
              d: this.direction,
              perpage: this.customizePages,
              key: this.searchData
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
    changeDirection(val){
      this.currentPage = 1
      this.getContentsPageList({
        page: 1,
        d: val,
        perpage: this.customizePages,
        key: this.searchData
      })
    },
    handleCurrentChange (val) {
      this.UPDATE_LOADING_STATUS(true)
      this.currentPage = val
      this.getSearchPageList(val)
    },

    getSearchPageList (val) {
      this.UPDATE_LOADING_STATUS(true)
      this.getContentsPageList({
        page: val,
        key: this.searchData,
        d: this.direction,
        perpage: this.customizePages
      })
    },
    searchDrug(){
      this.currentPage = 1
      this.getContentsPageList({
        page: 1,
        key: this.searchData,
        d: this.direction,
        perpage: this.customizePages
      })
    }
  },

  mounted () {
    this.getContentsPageList({
      page: 1,
      perpage:this.customizePages
    })
    let objAuth = VueCookie.get('authUser')

    let authUser = (typeof objAuth === 'string') ? JSON.parse(objAuth) : objAuth
    this.addBtnStatus = authUser.permission_names.includes('内容管理')
    this.addH5BtnStatus = authUser.permission_names.includes('H5模板')

  }
}
</script>

<style lang="scss" scoped>
.drug-warpper{
  position: relative;
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
</style>
<style lang="scss">
  .size28{
    .el-dialog__close{
      font-size: 28px;
    }
  }
</style>
