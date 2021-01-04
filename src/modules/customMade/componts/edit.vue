<template>
  <div class="customWrap">
    <div id="htmlContent" class="editWrap" :class="[$route.query.d==0?'landscapeBox':'portraitBox']" @click="clickfun">
      <html-panel :url.asyc="templateurl"  v-loading="loadingStatus"></html-panel>
      <div class="uploadMake" v-show="toggleMake" @click = "clickmake">
        <uploadCmp acceptType ="image/jpeg,image/jpg,image/png,image/bmp,image/gif"
                   v-if="activeType === 0"
                   :template_id = "template_id"
                   :autoUpload = "autoUpload"
                   :uploadAction = "uploadAction"
                   @success="fileUploadSuccess"
        ></uploadCmp>
        <edit-font v-if="activeType === 1" @updateValue="updateValue" :unit="unitNum" @cancelEdit="closeEdit" :textarea="editTextarea"></edit-font>
      </div>
    </div>
    <div class="editForm" v-if="tipMake">
      <p>请确保上传的文件格式是png,jpg文件大小不超过30M！<p>
      <p>图片分辨率{{text}}</p>为保证显示效果，强烈建议上传高清大图！
    </div>
    <div style="position: absolute;top:0px;right: 0px;padding: 20px 5px;" v-show="!toggleMake">
      <el-card class="box-card" style="margin-bottom: 10px">
        <div slot="header" class="clearfix">
          <span style="font-size: 14px">名称和时长</span>
        </div>
        <el-form class="formName">
          <el-form-item>
            <el-input prefix-icon="el-icon-paperclip" v-model="editName"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input prefix-icon="el-icon-time" v-model.number="second" oninput="if(this.value=='00'){this.value='0';}else{this.value=this.value.replace(/[^0-9]/g,'')}"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium" @click="savaThumbnail">保存</el-button>
            <el-button type="primary" size="medium" @click="goBack">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span  style="font-size: 14px">缩放</span>
        </div>
        <div class="progressBtn">
          <span v-if="this.percentage!==100">{{percentage}}%</span>
          <el-button size="mini" icon="el-icon-minus" @click="decrease"></el-button>
          <el-button size="mini" icon="el-icon-plus" @click="increase"></el-button>
        </div>
      </el-card>
    </div>
    <!--图片剪切-->
    <el-dialog :visible.sync="cropperDialog" title="图片剪切上传">
       <cropper-img :optionData="optionData" ref="cropper" @cropperData="cropperData"></cropper-img>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cropperDialog = false">取 消</el-button>
        <el-button type="primary" @click="uploadCropper" >上传</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import uploadCmp from './upload/index.vue'
  import editFont from './editFont/index.vue'
  import HtmlPanel from '../componts/HtmlPanel.vue'
  import CropperImg from '../componts/cropper.vue'
  import http from '@static/js/utils/http'
  import {mapActions, mapState} from "vuex"
  export default {
    beforeRouteLeave(to, form, next) {
      this.loadingStatus = true
      document.head.removeChild(document.head.lastChild) // 动态移除css1111
      if (JSON.stringify(to.query) == '{}' && form.query.hasOwnProperty("type")) {
         http.delete(`contents/${this.editId}`)
      }
      setTimeout(()=>{
        next()
      },420)

    },
    data() {
      return {
        templateurl: '',
        backArr:{
        },
        fontArr: {
        },
        fileData: {},
        tplData:{
          dynamic:{
            words:{},
            images:{}
          }
        },
        loadingStatus: true,
        percentage: 100,
        unitNum: '14',
        fontArrStyle:{},
        editTextarea: '',
        tipMake: false,
        editId: '',
        editName: '',
        second: 20,
        libPath: '',
        template_id: '6',
        activeClassName: '1',
        activeFontClass: '1',
        text: '',
        imgHeight: 0,
        imgWidth: 0,
        uploadAction: process.env.API_BASE + '/h5/playlists/uploading',
        autoUpload: false,
        cropperDialog: false,
        optionData: '',
        toggleMake: false,
        activeType: 0
      }
    },
    watch: {
      percentage(n){
        document.getElementById('htmlContent').style.zoom =  this.percentage + '%'
      }
    },
    components: {
      uploadCmp, editFont, HtmlPanel, CropperImg
    },
    computed: {
      ...mapState({
        jumpUrl: state => state.customMade.jumpUrl,
        thumbPath: state => state.customMade.thumbPath,
        customData: state => state.drugs.selectItemData
      })
    },
    created() {
    },
    mounted() {
      //  this.templateurl = this.jumpUrl  //
      this.templateurl = JSON.parse(sessionStorage.getItem('url'))
      let regiones = JSON.parse(sessionStorage.getItem('regiones'))
      console.log(this.templateurl)
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
      if (Number(this.$route.query.type)===0){  // 当路上有type属性的时候为创建播出单 否则是编辑播出单
        this.creatH5PlayList({id:this.$route.query.id,thumb:this.thumbPath}).then(  // 创建播出单
          res =>{
            this.loadingStatus = false
            this.editId = res.data.message.id  // 保存成功创建后的播出单id
            this.editName = res.data.message.name  // 保存成功创建后的播出单name
          }
        )
      }else {

        this.editId = this.$route.query.id
        this.editName = regiones.name
        this.second = regiones.seconds
        this.loadingStatus = false
        if (regiones.tpl.dynamic !==undefined){
          let tpl = JSON.parse(JSON.stringify(regiones.tpl.dynamic))
          this.tplData.dynamic.words = (tpl.words.length !==0) ? tpl.words : {}
          this.tplData.dynamic.images = (tpl.images.length !==0) ? tpl.images : {}
        }
      }
    },
    methods:{
      ...mapActions([
        'creatH5PlayList', 'putH5PlayList'
      ]),
      /**
       * 监听页面上的点击事件
       * **/
      clickfun(e){
       console.log(e)
        // console.log(e.toElement.className)
        this.activeClassName = e.toElement.className // 获取当前点击图片class
        this.activeFontClass = (e.toElement.parentElement.className===null)? "" : e.toElement.parentElement.className// 获取当前点击的文字class
        if (this.activeClassName.indexOf("Background") != -1){
          this.activeType = 0
          this.tipMake = true
          this.imgWidth = document.getElementsByClassName(this.activeClassName)[0].offsetWidth
          this.imgHeight = document.getElementsByClassName(this.activeClassName)[0].offsetHeight
          this.text = this.imgWidth+'x'+ this.imgHeight
          this.toggleMake = !this.toggleMake
          //this.backArr[`${this.activeClassName}`].border = '5px solid red'
         // $(`.${this.activeClassName}`).css('border','5px solid red')
          document.getElementsByClassName(this.activeClassName)[0].style.border = '10px solid red'
        } else if(this.activeFontClass.indexOf("WordLine") != -1){
          this.activeType = 1
          this.toggleMake = !this.toggleMake
          let div = document.getElementsByClassName(this.activeFontClass)[0].firstChild
          this.editTextarea = div.innerHTML
          this.unitNum = window.getComputedStyle(div).fontSize
          // this.editTextarea =  $(`.${this.activeFontClass}`).find('span').text()
        }
      },
      clickmake(){
        this.toggleMake = !this.toggleMake
        this.tipMake = false
        if (this.activeType===0){
          document.getElementsByClassName(this.activeClassName)[0].style.borderWidth = '0px'
        }
      },
      /**
       * 文字更新请求
       * */
      updateValue(obj){
        this.toggleMake = !this.toggleMake
        let str = JSON.stringify(obj) // 将更新的文字信息转成字符串
        if (str !== {}){
          document.getElementsByClassName(this.activeFontClass)[0].firstChild.innerHTML = obj.content
          document.getElementsByClassName(this.activeFontClass)[0].style.color = obj.color
          document.getElementsByClassName(this.activeFontClass)[0].style.fontSize = obj.fontSize
          this.tplData.dynamic.words[this.activeFontClass] = str
          this.putH5PlayList({seconds:this.second, id:this.editId, key:this.editName, val:this.tplData})
        }
      },
      closeEdit(){
        this.toggleMake = !this.toggleMake
      },
      /**
       * 图片上传成功后
       * */
      fileUploadSuccess(fileItem) {
        this.optionData = { // 图片剪切初始化数据
            url: fileItem.url,
            width: this.imgWidth,
            height: this.imgHeight,
            fixedNumber: [1,(this.imgHeight/this.imgWidth).toFixed(5)],
            name: fileItem.name,
            outputType: 'base64'
        }
        this.cropperDialog = true
      },
      uploadCropper(){
        this.$refs.cropper.finish()
      },
      /**
       * 背景剪切修改上传后提交数据
       * */
      cropperData(data) {
        const isLt3M = data.size / 1024 / 1024 < 30
        if (!isLt3M) {
          this.$message.error('上传头像图片大小不能超过 30MB!')
        } else {
          let formData = new FormData()
          formData.append('content_id', this.$route.query.id)
          formData.append('image', data)
          http.post('/h5/contents/uploading', formData).then(res=>{
            document.getElementsByClassName(this.activeClassName)[0].style.backgroundImage = 'url('+ res.data.message.image_url+')'
            this.clickmake() // 关闭图片替换界面
            this.cropperDialog = false
            this.tplData.dynamic.images[this.activeClassName] = res.data.message.image_url
            this.putH5PlayList({seconds:this.second, id:this.editId, key:this.editName, val:this.tplData}) // 图片上传成功后 提交数据
          })
        }
      },
      goBack(){
          if (Number(this.$route.query.type)===0) {
            http.delete(`contents/${this.editId}`).then(()=>{
              this.$router.push({path: '/customMade/list', query: {type: 0}})
            })
          } else {
            this.$router.push({path: '/customMade/list', query: {type: 0}})
          }
        },
      increase() {
        this.percentage += 10
        if (this.percentage > 100) {
          this.percentage = 100
        }
      },
      decrease() {
        this.percentage -= 10
        if (this.percentage < 10) {
          this.percentage = 10
        }
      },
      savaThumbnail(){
        this.putH5PlayList({seconds:this.second, id:this.editId, key:this.editName, val:this.tplData}).then(
          res => {
            if (res.data.success){
              this.$router.push({path: '/content/list', query: {d: 0}})
            }
          }
        )
      }
    }
  }
</script>

<style lang="scss" scoped>
  .customWrap{
    display: flex;
    position: relative;
    .editWrap{
      display: inline-block;
      position: relative;
      box-shadow: 0px 0px 1px rgba(0,0,0,0.8);
    }
    .editForm{
      width: 100%;
      background: black;
      font-size: 24px;
      color: #fff;
      padding: 15px;
    }
  }

  .editor-transform {
    box-sizing: border-box;
    position: absolute;
    z-index: 1;
    cursor: move;
    transform: matrix(1, 0, 0, 1, 0, 0);
  }
  .editor-transform:before {
    content: "";
    box-sizing: initial;
    border: 2px solid #6ccfff;
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    margin: -2px 0 0 -2px;
  }
  .uploadMake{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    position: absolute;
    top: 0px;
    left: 0px;
  }
  .formName{
    width: 160px;
    line-height: 30px;
    font-size: 14px;
  }
</style>
