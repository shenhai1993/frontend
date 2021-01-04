<template>
  <div class="parentConent custom-made-content">
    <div class="clearfix" style="margin-bottom: 15px">
      <el-select v-model.number="direction" placeholder="请选择活动区域" @change="onChangeVal" style="vertical-align: middle;">
        <el-option label="横屏" :value="0"></el-option>
        <el-option label="竖屏" :value="1"></el-option>
      </el-select>
    </div>
    <search-nav @changeIndustry="changeIndustry"></search-nav>
    <div class="customList">
      <!--恒屏模板列表-->
      <el-row :gutter="20"
              element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
              v-loading="loading">
        <el-col :span="(direction===0)?6:4" v-for="(item,index) in h5TemplateLists.data" :key="item.id" >
          <div class="templateBox">
            <img :src="item.thumb_path"/>
            <div class="ShadeBox">
              <div class="buttons">
                <!--<i class="el-icon-video-play" @click="playList(item.html_path)"></i>-->
                <i class="el-icon-plus" v-if="$route.query.type==0" @click="addList(item)"></i>
                <i class="el-icon-edit" @click="editorList(item)"></i>
                <i class="el-icon-caret-right" @click="preview(item)"></i>
                <i class="el-icon-delete" @click="removeList(item.id,index)"></i>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <div class="block pages-block">
        <el-pagination background
                       @current-change="handleCurrentChange"
                       @size-change="handleSizeChange"
                       :current-page.sync="currentPage"
                       :page-size="customizePages"
                       :page-sizes="[30, 50, 100]"
                       layout="total, prev, pager, next,sizes"
                       prev-text="上一页"
                       next-text="下一页"
                       :total="h5TemplateLists.total">
        </el-pagination>
      </div>
      <!--<router-link :to="{path: 'edit', query:{id:activePath}}" slot="subbutton" v-if="activePath !=='5328'">
        <el-button type="primary" icon="el-icon-check"  v-show="chooseAfterValue.length>0" style="position:fixed;bottom: 30px;right: 30px">确  认</el-button>
      </router-link>-->
    </div>
    <preview :direction="isDirection" :templateurl="isTemplateurl" @htmlPaneClose="onCloseHtmlPane"></preview>
    <el-dialog :visible.sync="dialogVisible" width="480px" :before-close="handleClose">
      <el-form :model="templatesForm" ref="templatesForm" label-width="60px" class="demo-ruleForm">
        <el-form-item label="名称" prop="name">
          <el-input v-model="templatesForm.name" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="行业" prop="industry">
          <el-radio-group v-model.number="templatesForm.industry" class="radioNav">
            <el-radio :label="1">餐饮</el-radio>
            <el-radio :label="2">酒店</el-radio>
            <el-radio :label="3">商场</el-radio>
            <el-radio :label="4">美容美发</el-radio>
            <el-radio :label="5">服饰服装</el-radio>
            <el-radio :label="6">医疗机构</el-radio>
            <el-radio :label="7">教育培训</el-radio>
            <el-radio :label="8">房产机构</el-radio>
            <el-radio :label="9">超市</el-radio>
            <el-radio :label="10">金融</el-radio>
            <el-radio :label="11">公司</el-radio>
            <el-radio :label="12">旅游</el-radio>
            <el-radio :label="13">通信</el-radio>
            <el-radio :label="14">节日主题</el-radio>
            <el-radio :label="15">案例展示</el-radio>
            <el-radio :label="16">其他</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('numberValidateForm')">确定</el-button>
          <el-button @click="handleClose">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import http from '@static/js/utils/http'
  import searchNav from '../componts/searchNav.vue'
  import preview from '../componts/preview/index'
  import {mapActions, mapMutations, mapState} from "vuex";
  import {SET_THUMB_PATH} from "../store/mutation-types";
  export default {
    data() {
      return{
        customList: [],
        loading: true,
        chooseAfterValue:[],
        activePath: '',
        industry: 1,
        customizePages: 30,
        currentPage: 1,
        centerDialogVisible: false,
        templatesForm: {
          name: '',
          industry: 1,
        },
        direction: 0,
        isDirection: 0, // 当前选中的模板屏幕方向
        isTemplateurl: '', // 当前选中的模板链接
        dialogVisible: false,
        directory_id: 1,
      }
    },
    components:{
      searchNav, preview
    },
   computed: {
      ...mapState({
        h5TemplateLists: state => state.customMade.h5TemplateLists,
      })
    },

    mounted() {
      this.getH5TemplatesLists({d:0,index:1,page: 1, pages: 30}).then(
        ()=>{
          this.loading = false
        }
      )
    },
    methods:{
      ...mapMutations([
        'SET_CUSTOM_JUMP_URL', 'SET_THUMB_PATH'
      ]),
      ...mapActions([
        'deleteH5TemplateList', 'getH5TemplatesLists'
      ]),
      handleCurrentChange (val) {
        this.getH5TemplatesLists({d:this.direction,index:this.industry,page: val,pages: this.customizePages})
      },
      handleSizeChange(val) {
        this.customizePages = val
        this.getH5TemplatesLists({d:this.direction,index:this.industry,page: this.currentPage, pages: val})
      },
      submitForm(){
        let url = `/h5/templates/${this.templatesForm.id}` + '?name=' + this.templatesForm.name + '&industry=' + this.templatesForm.industry
        http.put(url).then(
          res=>{
            if (res.data.success){
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success'
              })
              this.handleClose()
              this.getH5TemplatesLists({d:this.direction,index:this.industry,page: this.currentPage,pages: this.customizePages})
            } else {
              this.$notify({
                title: '失败',
                message: res.data.message,
                type: 'error'
              })
            }
          }
        )
      },
      onChangeVal(val){
        this.loading = true
        this.getH5TemplatesLists({d:val,index:this.industry,page: this.currentPage,pages: this.customizePages}).then(()=>{
          this.loading = false
        })
      },
      changeIndustry(val){
        this.industry = val
        this.getH5TemplatesLists({d:this.direction,index:val,page: this.currentPage,pages: this.customizePages})
      },
      changeimport(file){
        let formData = new FormData()
        formData.append('template', file.raw)
        formData.append("direction", this.direction)
        formData.append("industry", this.industry)
        http.post('/h5/templates',formData).then(
          res => {
            if (res.data.success){
              this.$notify({
                title: '成功',
                message: '模板上传成功',
                type: 'success'
              })
              this.getH5TemplatesLists({d:this.direction,index:1,page: this.currentPage,pages: this.customizePages})
            } else {
              this.$notify({
                title: '失败',
                message:  res.data.message ,
                type: 'error'
              })
            }
          })
          .catch(e => {
            console.log(e.message)
          })
      },
      addList(item){
        this.SET_CUSTOM_JUMP_URL(item.html_path)
        this.SET_THUMB_PATH(item.thumb_path)
        sessionStorage.setItem('url',JSON.stringify(item.html_path))
        sessionStorage.setItem('regiones',JSON.stringify(null))
        this.$router.push({path: '/customMade/edit',query:{ id: item.id,type:0,d:item.direction}})
      },
      preview(item) {
        this.isTemplateurl = item.html_path
        this.isDirection = Number(item.direction)
      },
      onCloseHtmlPane(){
        this.isTemplateurl = ''
      },
      editorList(item){
        this.dialogVisible = true
        this.templatesForm.name = item.name
        this.templatesForm.id = item.id
        this.templatesForm.industry = item.industry
      },
      handleClose(){
        this.dialogVisible = false
      },
      removeList(id,index){
        this.$confirm('删除后不可恢复, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteH5TemplateList({id:id,index:index})
        })
      }
    },
  }
</script>

<style scoped lang="scss">
  .radioNav{line-height: 30px}
  .custom-made-content{
    padding: 15px;
    height: 100%;
  }
  .customList{margin-top: 20px;height: calc(100% - 190px);overflow-y: auto;overflow-x: hidden}
  .templateBox{
    display: grid;
    position: relative;
    overflow: hidden;
    border: 1px solid #d0e0f2;
    margin-bottom: 20px;
    img{
      width: 100%;
    }
    .ShadeBox{
      width: 100%;
      height: 100%;
      position: absolute;
      top: -100%;
      left: 0px;
      background-color: rgba(0,0,0,0.5);
      background-repeat: no-repeat;
      background-position: bottom right;
      opacity: 0;
      -webkit-transition: all 0.3s;
      -moz-transition: all 0.3s;
      -o-transition: all 0.3s;
      transition: all 0.3s;
      .buttons{
        position: absolute;
        top: 50%;
        left: 50%;
        width: 180px;
        -webkit-transform: translate(-50%, -50%);
        -moz-transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        -o-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        text-align: center;
        i{
          margin: 0 2px;
          border: 1px solid #FFFFFF;
          border-radius: 50%;
          padding: 6px;
          font-size: 18px;
          color: #FFFFFF;
        }
        i:hover{
          background: #409EFF;
        }
      }
    }
  }
  .templateBox:hover{
    .ShadeBox{
      opacity: 1;
      top: 0px;
    }
  }
  .toggleShadeBox{

  }
</style>
