<template>
  <div class="clearfix playlist-editor-stepone">
    <el-row :gutter="10" type="flex">
      <el-col class="w150 no-shrink">
        <el-card style="height: 100%">
          <div class="clearfix" slot="header">
            <el-tooltip content="选择模板" effect="dark" placement="top">
              <el-button size="small" @click="selectTpl" :disabled="selectStu">
                <i class="fa fa-plus"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除选中模板" placement="top">
              <el-button size="small" @click="removeTpl">
                <i class="fa fa-trash"></i>
              </el-button>
            </el-tooltip>
          </div>
          <div class="backElement">
            <el-tooltip class="item" effect="dark"  content="添加背景音乐" placement="bottom">
              <el-button @click="addBgm" size="small" :disabled="createTypeIndex == 1 || createTypeIndex == 2 || !selectStu" icon="el-icon-headset">
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="添加背景图片" placement="bottom">
              <el-button @click="addBgImg" :disabled="!selectStu" size="small" ><i class="el-icon-picture"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="清除背景图片" placement="bottom">
              <el-button @click="removeBgImg" size="small" :disabled="JSON.stringify(selectBgimg)==='{}' || selectBgimg == null"><i class="el-icon-circle-close"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="添加视频区域" placement="bottom">
              <el-button @click="create('video')" size="small" :disabled=" createTypeIndex === 1 || selectAudio.length>0  || !selectStu"><i class="el-icon-caret-right"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="添加图片区域" placement="bottom">
              <el-button @click="create('image')"  :disabled="!selectStu" size="small"><i class="el-icon-picture"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="添加网页区域" placement="bottom">
              <el-button @click="create('webpage')"  :disabled="!selectStu" size="small"><i class="el-icon-tickets"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="添加文本区域" placement="bottom">
              <el-button @click="create('text')" :disabled="!selectStu" size="small"><i class="el-icon-edit"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="添加信源区域" placement="bottom">
              <el-button @click="create('tv')" size="small" :disabled=" createTypeIndex === 2 || selectAudio.length>0  || !selectStu"><i class="el-icon-more"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="添加日期区域" placement="bottom">
              <el-button @click="create('date')"  :disabled="!selectStu" size="small"><i class="el-icon-date"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="添加时钟区域" placement="bottom">
              <el-button @click="create('time')"  :disabled="!selectStu" size="small"><i class="el-icon-time"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="添加城市区域" placement="bottom">
              <el-button @click="create('city')"  :disabled="!selectStu" size="small"><i class="el-icon-location"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="添加温度区域" placement="bottom">
              <el-button @click="create('weathertemplate')"  :disabled="!selectStu" size="small"><i class="el-icon-stopwatch"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="添加天气区域" placement="bottom">
              <el-button @click="create('weatherimg')"  :disabled="!selectStu" size="small"><i class="el-icon-sunny"></i></el-button>
            </el-tooltip>
          </div>
          <!--宽高定位-->
          <div class="positionBox">
            <el-form :model="position" ref="position" label-width="30px" class="demo-ruleForm">
              <el-form-item label="宽" prop="width">
                <el-input v-model.number="position.width" :disabled="!selectStu" autocomplete="off" @change="((val)=>{onChangePosition(val,'width')})" oninput="if(this.value=='00'){this.value='0';}else{this.value=this.value.replace(/[^0-9]/g,'')}"></el-input>
              </el-form-item>
              <el-form-item label="高" prop="height">
                <el-input v-model.number="position.height" :disabled="!selectStu" autocomplete="off"  @change="((val)=>{onChangePosition(val,'height')})" oninput="if(this.value=='00'){this.value='0';}else{this.value=this.value.replace(/[^0-9]/g,'')}"></el-input>
              </el-form-item>
              <el-form-item label="X" prop="x">
                <el-input v-model.number="position.x" :disabled="!selectStu" autocomplete="off"  @change="((val)=>{onChangePosition(val,'x')})" oninput="if(this.value=='00'){this.value='0';}else{this.value=this.value.replace(/[^0-9]/g,'')}"></el-input>
              </el-form-item>
              <el-form-item label="Y" prop="y">
                <el-input v-model.number="position.y" :disabled="!selectStu" autocomplete="off"  @change="((val)=>{onChangePosition(val,'y')})" oninput="if(this.value=='00'){this.value='0';}else{this.value=this.value.replace(/[^0-9]/g,'')}"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
      <el-col  class="tpl-wrapper">
        <el-card v-if="activeTplIndex===-1" class="no-active-tpl">
          <span class="no-active-tpl-span">请选择模板</span>
        </el-card>
        <div v-else class="tplcanvas" style="position: relative;text-align: center; box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);border: 1px solid #EBEEF5;height: 100%">
          <new-tpl-content
            file="true"
            ref="tpl"
            :editable="true"
            :tpldata="tpldata"
            :position="resetPositionData"
            canvas=".tplcanvas"
            @editData="onEditData"
            @deleteData="onDeleteData"
            @regionClick="onRegionClick"
            @regionPlus="onRegionPlus"
            @onMax="onMax"
          >
          </new-tpl-content>
        </div>
        <div class="progressBox" v-if="activeTplIndex !==-1" >
          <div class="progressBtn">
            <span v-if="this.percentage!==100">{{percentage}}%</span>
              <el-button size="mini" icon="el-icon-minus" @click="decrease"></el-button>
              <el-button size="mini" icon="el-icon-plus" @click="increase"></el-button>
          </div>
        </div>
      </el-col>
      <el-col class="w330 selected-files no-shrink">
        <el-card style="margin-bottom: 15px">
          <div>
            <selected-files
              :activeTplIndex="activeTplIndex"
              @removeChange="onRemoveChange"
              :activeRegion="activeRegion"></selected-files>
          </div>
        </el-card>
        <el-card >
          <div class="clearfix" slot="header">
            背景音乐列表
          </div>
          <template>
            <el-table
              :data="selectAudio"
              :show-header="false"
              class="selectAudioList"
              style="width: 100%">
              <el-table-column prop="name" ></el-table-column>
              <el-table-column  fixed="right" width="40px">
                <template slot-scope="scope">
                  <i class="el-icon-delete" @click="handleDelete(scope.$index, scope.row)"></i>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog title="填写文本内容" :close-on-click-modal="false" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-form :model="textValidateForm" ref="textValidateForm" label-width="60px" class="demo-ruleForm">
        <el-form-item label="内容:" prop="value"
                      :rules="[ { required: true, message: '内容不能为空'}]">
          <el-input type="textarea" v-model="textValidateForm.value" maxlength="350" autocomplete="off"></el-input>
        </el-form-item>
        <!--<el-form-item label="时长:" prop="seconds"
          :rules="[ { required: true, message: '时长不能为空'},{ type: 'number', message: '时长必须为数字值'} ]">
          <el-input  v-model.number="textValidateForm.seconds" maxlength="4" autocomplete="off"></el-input>
        </el-form-item>-->
        <el-form-item>
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveText('textValidateForm')">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog @close="cancelSource" :visible="sourceDialogShow">
      <el-radio-group v-model="source">
        <el-radio label="HDMI1"></el-radio>
        <el-radio label="HDMI2"></el-radio>
        <el-radio label="VGA"></el-radio>
        <el-radio label="CVBS"></el-radio>
      </el-radio-group>
      <div class="footer" slot="footer">
        <dialog-button @clickCancel="cancelSource" @clickConfirm="confirmSource"></dialog-button>
      </div>
    </el-dialog>
    <element-selector
      :elementsdialogshow.sync='elementsDialogShow'
      @fileSelected="onFileSelected"
      :selectedReginType = 'dataType'>
    </element-selector>
    <template-selector @selectNewTpl="selectNewTpl" :direction="direction"></template-selector>
  </div>
</template>
<script>
  import { mapState, mapMutations, mapActions } from 'vuex'
  import TemplateContent from '@/modules/template/components/Content.vue'
  import ElementSelector from '@/modules/element/lib/addelementsdialog.vue'
  import SelectedFiles from './selectedFiles'
  import TemplateSelector from './TemplateSelector'
  import NewTplContent from './templateEdit'
  import BorderBox from '@/components/BorderBox'
  import DialogButton from '@/components/DialogButton'
  import {
    CLEAR_SELECT_BGIMG, DELETE_LAST_TPL, DELETE_TEMPLATE_FONTSIZE,
    DELETE_TEMPLATE_POSITION_STYLE,
    SET_SELECT_AUDIO,
    SET_SELECTED_TPL_TEXT
  } from "../../store/mutation-types";
  import {floor} from "../../../tpl/lib/utils";

  export default {
    components: {
      TemplateContent, ElementSelector, SelectedFiles
      , TemplateSelector, NewTplContent, BorderBox, DialogButton},

    props: ['canNext', 'activeSteps'],

    data () {
      return {
        selectId: '',
        materialType: 0,
        dialogVisible: false,
        textValidateForm:{
          value: ''
        },
        createTypeIndex: 0,
        elementsDialogShow: false,
        backgroundImage: {},
        sourceDialogShow: false,
        source: '',
        selectedReginType: '',
        activeTpl: {},
        activeTplIndex: -1,
        activeRegion: {},
        selectStu: false,
        position: {},
        percentage: 100,
        dataType: '',
        textIndex: 0,
        templateWidth: 1920,
        templateHeight: 1080,
        resetPositionData: {
          type: 'x',
          num: 0
        },
        direction: -1
      }
    },
    computed: {
      ...mapState({
        selectedTpl: state => state.drugs.selectedTpl,
        selectAudio: state => state.drugs.selectAudio,
        selectBgimg: state => state.drugs.selectBgimg,
        selectedFiles: state => state.drugs.selectedFiles
      }),

      tpldata () {
        if (JSON.stringify(this.activeTpl) !== '{}') {
          return this.activeTpl
        }
      }
    },
    methods: {
      ...mapMutations([
        'ADD_SELECTED_ELEMENT_WITHTIME_DRUGS',
        'SHOW_TEMPLATE_SELECTOR',
        'REMOVE_SELECTED_TPLS',
        'SET_SELECT_AUDIO',
        'SET_SELECT_BGIMG',
        'DELETE_SELECT_AUDIO',
        'SET_SELECTED_TPL_TEXT',
        'CLEAR_PLAYLIST_MUTIPLETPL',
        'CLEAR_SELECT_BGIMG',
        'DELETE_TEMPLATE_AND_FILES',
        'DELETE_TEMPLATE_POSITION_STYLE',
        'EDITOR_TEMPLATE_POSITION_STYLE',
        'SET_REGINS_SHOW_MODE',
        'CLEAR_REGINS_SHOW_MODE',
        'DELETE_TEMPLATE_FONTSIZE',
        'DELETE_LAST_TPL',
        'CLEAR_SELECT_AUDIO'
      ]),
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
      // 验证是否可以点击下一步
      canNextFn () {
        let ret = true
        if (this.selectedTpl.length !== 0 && this.selectedFiles.length !== 0) {
          this.selectedTpl.forEach((tpl, index) => {
            let files = this.selectedFiles[index]
            let regionsNeedFile = _regionNeedFileCount(tpl.regions)
            if (_getLengthWithoutUndefined(files) !== regionsNeedFile.length) {
              ret = false
            }
            if (tpl.regions.length===0){
              ret = false
            }
            tpl.regions.some(item => {
              if (item.type==='text' && item.text === undefined){
                ret = false
              }
              return
            })
            regionsNeedFile.forEach(region => {
              let index = region.id
              if (!files[index] || files[index].length === 0) {
                ret = false
              }
            })
          })
          return ret
        }

        function _getLengthWithoutUndefined (arr) {
          let length = 0
          arr.forEach(item => {
            if (item !== undefined){
              length++
            }
          })
          return length
        }

        function _regionNeedFileCount (regions) {
          let ret = regions.filter(r => {
            return r.type !== 'date' && r.type !== 'time' && r.type !== 'text' && r.type !== 'city' && r.type !== 'weathertemplate'  && r.type !== 'weatherimg'
          })
          return ret
        }
      },
      addBgm(){
        this.materialType = 1
        this.onAddClicked('audio')
      },
      handleDelete(index){
        this.DELETE_SELECT_AUDIO(index)
      },
      onAddClicked (region) {
        if (region.type === 'tv') {
          this.sourceDialogShow = true
        } else if (region.type === 'text'){
          // 文本类型的时候操作 console.log(region)
        } else {
          this.dataType = (region.type)? region.type: region
          this.elementsDialogShow = true
        }
      },
      // 文件选中，通过vuex更新
      onFileSelected (files, type) {
        let obj = {}
        if (type === 'tv' || type === 'text') {
          obj = [files]
        } else {
          obj.data = files
        }
        setTimeout(()=>{
          switch (this.materialType) {
            case 0:
              this.ADD_SELECTED_ELEMENT_WITHTIME_DRUGS({index: this.activeTplIndex, regionIndex: this.activeRegion.id, selectedElement: obj, type: type})
              break
            case 1:
              this.SET_SELECT_AUDIO(files)
              this.materialType = 0
              break
            case 2:
              this.SET_SELECT_BGIMG(files[0])
              this.materialType = 0
              break
          }
          this.$emit('update:canNext', this.canNextFn())
        },300)
      },
      onMax(){
        setTimeout(()=>{
          this.DELETE_LAST_TPL()
        },500)
      },
      onRegionClick(region) {

        this.activeRegion = region
        this.rate = region.rate
        this.position = {
          x: region.x,
          y: region.y,
          width: region.width,
          height: region.height
        }
        this.DELETE_TEMPLATE_POSITION_STYLE({index:region.id,position:this.position})
        if (region.type==='date' || region.type==='time'){
          let div = document.getElementById("template")
          let size = Math.floor(region.height/2)
          div.getElementsByClassName(region.type)[0].style.fontSize = Math.floor(size*region.rate) + 'px'
          this.DELETE_TEMPLATE_FONTSIZE({index:region.id,size: size})
        }
      },
      onChangePosition(num,type){
        let index = this.activeRegion.id
        let parent = document.getElementById('template')
        let posiData = parent.getElementsByClassName('selected')[0]
        this.onCompute(num,type).then(res=>{
          this.position[type] = res
          let val = parseInt(res*this.rate) +'px'
          this.EDITOR_TEMPLATE_POSITION_STYLE({i:index,t:type,n:res})
          if(type==='x'){
            posiData.style.left =  val
          } else if (type==='y'){
            posiData.style.top =  val
          } else {
            posiData.style[type] =  val
          }
          this.resetPositionData = Object.assign({}, this.resetPositionData, { type: type, num: this.position[type] })
        })

      },
      onCompute(num,type){
        return new Promise((resolve, reject) => {
          let lists
          let wDigit = this.templateWidth - num - this.position.width // 计算当前X轴的定位是否在模板内
          let hDigit = this.templateHeight - num - this.position.height // 计算当前y轴的定位是否在模板内
          let xDigit = this.templateWidth - this.position.width// 当前X轴能设置的最大定位
          let yDigit = this.templateHeight - this.position.height // 当前y轴能设置的最大定位
          let kDigit = this.templateWidth - num - this.position.x // 计算当前宽度是否在模板内
          let gDigit = this.templateHeight - num - this.position.y // 计算当前高度是否在模板内
          let maxWidthDigit = this.templateWidth -  this.position.x // 当前宽度能设置的最大值
          let maxHeightDigit = this.templateHeight - this.position.y // 计算当前高度能设置的最大值
          if(type==='x'){
            lists = (wDigit>=0)? num:xDigit
          } else if(type==='y') {
            lists = (hDigit>=0)? num:yDigit
          } else if (type==='width'){
            lists = (kDigit>=0)? num:maxWidthDigit
          } else {
            lists = (gDigit>=0)? num:maxHeightDigit
          }
          resolve (lists)
        })
      },
      onRegionPlus(region) {
        if (region.type==='text'){
          this.textIndex = region.id
          this.textValidateForm.value = (this.selectedTpl[0].regions[region.id].text !=='')?this.selectedTpl[0].regions[region.id].text: ''
          this.dialogVisible = true
        }
        this.activeRegion = region
        this.onAddClicked(region)
      },
      onRemoveChange(){
        this.$emit('update:canNext', this.canNextFn())
      },
      /**
       * 保存文本
       * */
      saveText(name){
        this.$refs[name].validate((valid) => {
          if (valid) {
            // let data = {}
            // data.text = this.textValidateForm.value
            // data.seconds = this.textValidateForm.seconds
            // data.type = 'text'
          //  this.onFileSelected (data, 'text')
            let textBox = document.getElementById('template').getElementsByClassName("region")[this.textIndex]
            textBox.children[0].innerHTML = this.textValidateForm.value
            this.SET_SELECTED_TPL_TEXT({index: this.activeRegion.id, val: this.textValidateForm})
            this.handleClose()
          } else {
            return false
          }
        })
      },
      // addElement (type) {

      // },
      create(type){
        this.$refs.tpl.create(type)
        if (type==='tv') {
          this.createTypeIndex = 1
        }
        if (type==='video') {
          this.createTypeIndex = 2
        }
        // switch (type) {
        //   case 'tv':
        //     this.createTypeIndex = 1
        //     break
        //   case 'video':
        //     this.createTypeIndex = 2
        //     break
        //   default:
        //     this.createTypeIndex = 0
        // }
        // this.screenType()
        this.materialType = 0
      },
      cancelSource () {
        this.source = ''
        this.sourceDialogShow = false
      },

      confirmSource () {
        if (this.source === '') {
          this.cancelSource()
          return false
        }
        let data = {}
        data.name = this.source
        data.type = 'tv'
        this.onFileSelected (data, 'tv')
        this.cancelSource()
      },
      addBgImg(){
        this.materialType = 2
        this.onAddClicked('image')
      },
      removeBgImg(){
        this.CLEAR_SELECT_BGIMG()
      },
      selectTpl () {
        this.SHOW_TEMPLATE_SELECTOR(true)
      },

      selectNewTpl (tpl) {
        // this.CLEAR_REGINS_SHOW_MODE()
        this.direction = tpl.direction
        this.activeTpl = tpl
        this.activeTplIndex = this.selectedTpl.length - 1
        this.activeRegion = {}
        tpl.regions.forEach((item,index) =>{
          if (item.showMode === undefined && item.type){
            this.SET_REGINS_SHOW_MODE({ regionIndex: index, value: 0})
          }
        })
      },
      handleClose(){
        this.$refs.textValidateForm.resetFields()
        this.$emit('update:canNext', this.canNextFn())
        this.dialogVisible = false
      },
      removeTpl () {
        if (this.activeTplIndex === -1) {
          return
        }
        this.REMOVE_SELECTED_TPLS(this.activeTplIndex)
        // this.direction = -1
        // 删除前只有一个模板时可设置为 - 1, 但是删除前模板数大于1时,取剩余模板的方向设置作为传入组件的属性设置
        if(this.selectedTpl.length > 0) {
          for (ele of selectedTpl) {
            this.direction = ele.direction
            break
          }
        }
        else {
          this.direction = -1
        }
        this.activeTplIndex = -1
        this.activeRegion = {}
        this.CLEAR_SELECT_AUDIO()
        this.CLEAR_SELECT_BGIMG()
      },

      setActiveTpl (tpl, index) {
        this.activeTpl = tpl
        this.activeTplIndex = index
        this.activeRegion = {}
      },
      screenType(){
        if (this.selectedTpl[0].regions.length>0){
          this.selectedTpl[0].regions.forEach((item)=>{
            if (item.type==='video'){
              this.createTypeIndex = 2
              throw  Error() // 故意报错跳出循环
            } else if (item.type==='tv'){
              this.createTypeIndex = 1
              throw  Error() // 故意报错跳出循环
            } else {
              this.createTypeIndex = 0
            }
          })
        } else {
          this.createTypeIndex = 0
        }
      },
      onEditData(dom,rate){
        let index = dom.id.split("region_")[1]
        let position = {
          x: parseInt(dom[0].offsetLeft/rate),
          y: parseInt(dom[0].offsetTop/rate),
          width: parseInt(dom[0].offsetWidth/rate),
          height: parseInt(dom[0].offsetHeight/rate)
        }
        this.DELETE_TEMPLATE_POSITION_STYLE({index:index,position:position})
      },
      onDeleteData(data){
        if (this.activeRegion){
          this.activeRegion = {}
        }
        this.DELETE_TEMPLATE_AND_FILES(data.id)
        this.screenType()
        // if (data.type==='image'){
        //   this.DELETE_REGINS_SHOW_MODE(data.id)
        // }
      }
    },

    watch: {
      selectedFiles: {
        handler (n, o) {
          if (this.activeSteps === 0) {
            this.$emit('update:canNext', this.canNextFn())
          }
        },
        deep: true
      },
      direction(v){
        this.templateWidth = (v===0)?1920:1080
        this.templateHeight = (v===0)?1080:1920
      },
      selectedTpl(v) {
        if (v.length>0) {
          this.selectStu = true
          this.screenType()
        } else {
          this.selectStu = false
        }
      },
      selectBgimg:{
        handler (v) { // 监听选中的模板的长度，长度大于0的时候，禁掉添加模板按钮
          if (v) {
            document.getElementById('template').style.backgroundImage = 'url('+v.path+')'
          } else {
            document.getElementById("template").style.backgroundImage = ''
          }
        }
      },
      activeSteps (n, o) {
        if (n === 0) {
          if (this.$route.params.id) {
            this.$emit('update:canNext', this.canNextFn())
          }
        }
      },
      percentage(n){
        document.getElementById('template').style.zoom =  this.percentage + '%'
      },
      activeTpl: {
        handler (n) {
          this.$nextTick(() => {
            this.$emit('update:canNext', this.canNextFn())
            // this.$refs.tpl.template 有可能还是undefined, 先渲染 new-tpl-content 再 渲染 tpl-item, 则OK; 反之, 则 template 还在初始化中, 无法加载事件 , 已改成稳妥的方式即子组件传递事件
            /* this.$refs.tpl.template.on('region_click', (region) => {
              this.activeRegion = region
            })
            this.$refs.tpl.template.on('region_plus', (region) => {
              this.activeRegion = region
              this.onAddClicked(region)
            }) */
          })
        },
        deep: true
      }
    },

    created () {
      this.CLEAR_PLAYLIST_MUTIPLETPL()
    }
  }
</script>
<style lang="scss">
  .playlist-editor-stepone{
    padding: 10px;
    .el-row{
      align-items: stretch;
      .el-card{
        /*height: 100%;*/
        .el-card__body{
          padding: 16px;
        }
        .tpl-item{
          width: 100%;
          border-bottom: 1px solid #ebeef5;
          margin-bottom: 14px;
          cursor: pointer;
          .img-wrapper{
            display: table-cell;
            width: 102px;
            height: 102px;
            vertical-align: middle;
            text-align: center;
            background-color: #f1f4f5;
            .imgH{
              width: 100%;
            }
            .imgV{
              height: 100%;
            }
          }
        }
        .active{
          border: 2px solid;
          border-radius: 4px;
          color: rgba(64, 160, 255, 0.877);
          border-color: #c6e2ff;
          background-color: #ecf5ff;
        }
      }
    }
    .no-shrink{
      flex-shrink: 0
    }
    .w330{
      width: 330px;
    }
    .w150{
      width: 150px;
    }
    .tpl-wrapper{
      position: relative;
      overflow: auto;
      .progressBox{
        position: absolute;
        bottom: 10px;
        width: 96%;
        left: 2%;
        .progressBtn{
          text-align: right;
        }
      }
    }
    .no-active-tpl{
      height:calc(100% - 1px);
      text-align: center;
      padding-top: 30px;
      .no-active-tpl-span{
        font-size: 20px;
      }
    }
    .sf{
      height: 100%;
    }
    .tpl-content{
      .el-card__body{
        height: 526px;
        overflow-y: auto;
      }
    }
  }
  .selectAudioList{
  }
  #template{
    background-size: 100% 100%;
  }
  .positionBox{
    padding-right: 4px;
    .el-form-item{
      margin-bottom: 2px;
    }
    .el-input__inner{
      height: 30px;
      line-height: 30px;
    }
  }
  .backElement{
    .item{
      margin-bottom: 7px;
    }
    .item:nth-of-type(2n+1){
      margin-left: 0px;
    }
  }
  span.textType.text{
    text-align: left;
    float: left;
    max-width: 100%;
    max-height: 100%;
    overflow: hidden;
    font-family: '宋体';
    white-space:pre-wrap;
    word-break:break-all;
  }
</style>
