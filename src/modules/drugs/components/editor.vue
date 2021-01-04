<template>
  <div class='playListEditor p-10'>
    <div class="content-wrapper">
      <div class="header">
        <h3 v-show="activeSteps === 0">选择模板和素材</h3>
      </div>
      <div class="content">
        <section v-show="activeSteps === 0">
          <step-one :canNext.sync='canGoStepTwo' ref="stepOne"
          :activeSteps='activeSteps'></step-one>
        </section>
      </div>

      <div class="footer p-10">
<!--        -->
<!--        <el-button @click="next" :disabled="!canNext">下一步</el-button>-->
        <el-button @click="showSaveDialog()" :disabled="!canNext">保存</el-button>
        <el-button @click="saveTplDialog" :disabled="selectedTpl.length===0">保存为模板</el-button>
        <router-link to="/content/list" class="m-l-10">
          <el-button>取消</el-button>
        </router-link>
      </div>
      <el-dialog @close="tplCancel" :visible.sync="tplDialog" width="490px" title="模板保存">
        <el-form ref="tplForm" :rules="tplRules" :model="tplForm" label-width="60px">
          <el-form-item prop="name" label="名称">
            <el-input v-focus autofocus v-model="tplForm.name"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button  @click="tplCancel">取消</el-button>
          <el-button type="primary" @click="tplSave" @keyup.enter.native="tplSave">保存</el-button>
          <!--<dialog-button @clickConfirm="save" @clickCancel="cancel" confirmText="保存"></dialog-button>-->
        </div>
      </el-dialog>
      <!-- 保存form -->
      <el-dialog @close="cancel" :visible.sync="saveDialog" width="490px" title="内容管理">
        <el-form ref="form" :rules="rules" :model="form" label-width="100px">
          <el-form-item prop="name" label="名称">
            <el-input v-focus autofocus v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item prop="bgType" label="背景类型">
            <el-radio v-model="form.bgType" :label="0">标准</el-radio>
            <el-radio v-model="form.bgType" :label="1">异型</el-radio>
          </el-form-item>
          <!--<el-form-item prop="type" label="类型">
            <el-radio v-model="form.type" label="0">主播</el-radio>
            <el-radio v-model="form.type" label="1">插播</el-radio>
            <el-radio v-model="form.type" label="2">垫片</el-radio>
          </el-form-item>
          <el-form-item prop="date" label="起止日期">
            <el-date-picker
              style="width: 164px"
              v-model="form.schedule.date.start"
              type="date"
              placeholde="开始日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptionsStart">
              </el-date-picker>
              <span>至</span>
            <el-date-picker
              style="width: 164px"
              v-model="form.schedule.date.end"
              type="date"
              placeholde="结束日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptionsEnd">
              </el-date-picker>
          </el-form-item>
          <el-form-item prop="time" label="播出时间段">
            <el-time-picker
              is-range
              v-model="form.time"
              range-separator="至"
              start-placeholde="开始时间"
              end-placeholde="结束时间"
              placeholder="选择时间范围
              "
              format='HH:mm'
              value-format='HH:mm'></el-time-picker>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" placeholder="请输入备注" v-model="form.description"></el-input>
          </el-form-item>-->

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button  @click="cancel">取消</el-button>
          <el-button type="primary" @click="save" @keyup.enter.native="save">保存</el-button>
          <el-button type="primary" @click="newSave">另存为</el-button>
          <!--<dialog-button @clickConfirm="save" @clickCancel="cancel" confirmText="保存"></dialog-button>-->
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import StepOne from './editor/stepOne.vue'
import StepTwo from './editor/stepTwo.vue'
import http from '@static/js/utils/http'
import DialogButton from '@/components/DialogButton'

const STEPS = 2

export default {
  beforeRouteLeave(to, form, next) {
    if (!this.saveStatus){
      this.$confirm('是否放弃编辑当前内容单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          next()
      }).catch(() => {

      })
    } else {
      next()
    }
  },
  components: {
   StepOne, StepTwo, DialogButton
  },

  data () {
    return {
      groupId: 0,
      activeSteps: 0,
      canGoStepTwo: false,
      canGoStepThree: false,
      canSave: false,
      saveStatus: false,
      tplDialog: false,
      tplForm: {},
      form: {
        id: 0, // > 0 为编辑
        name: '',
        bgType: 0, // 背景类型, 0 - 标准; 1 - 异形
        //type: '0',
       // time: ['08:00', '20:00'],
       // direction: -1,
        tpl: {},
       // description: '',
       // trees: {},
       // tags: {},
      },
      saveDialog: false,
      pickerOptionsStart: {
        disabledDate: (time) => {
          return Math.floor(( Date.now() - time.getTime()) / 86400000) > 0 || time.getTime() > new Date(this.form.endDate)
        }
      },
      pickerOptionsEnd: {
        disabledDate: (time) => {
          return time.getTime() < new Date(this.form.startDate)
        }
      },
      tplRules: {
        name: [{required: true, message: '请输入名称', trigger: 'blur'}]
      },
      rules: {
        name: [{required: true, message: '请输入名称', trigger: 'blur'}]
      }
    }
  },

  computed: {
    ...mapState({
      selectedTpl: state => state.drugs.selectedTpl,
      selectedFiles: state => state.drugs.selectedFiles,
      selectedGroups: state => state.drugs.selectedGroups,
      selectedTags: state => state.drugs.selectedTags,
      selectItemData: state => state.drugs.selectItemData
      // reginsShowMode: state => state.drugs.reginsShowMode,
    }),

    canNext () {
      if (this.activeSteps === 0) {
        return this.canGoStepTwo
      }
      if (this.activeSteps === 1) {
        this.canSave = this.canGoStepThree
        return false
      }
      return false
    }
  },
  created(){
    document.onkeyup= e =>{
      if (e.keyCode === 13) {
        this.save()//调用登录 验证方法
      }
    }
  },
  async mounted () {
    let _this = this
    //this.groupId = JSON.parse(this.$cookies.get('authUser')).group_id
    let objAuth = this.$cookies.get('authUser')
    this.groupId = (typeof objAuth === 'string') ? JSON.parse(objAuth).group_id : objAuth.group_id
    // 编辑加载
    let id = this.$route.params.id
    id = parseInt(id)
    if(id > 0) {
      console.log(this.selectItemData)
      let item = this.selectItemData
      await http.get('content/' + id)
        .then(res => {
          item = res.data.message
        })
        .catch(err => {
          console.log(err)
        })

      this.LOAD_ITEM_DRUGS(item)
      this.$nextTick(function(){
        this.SET_SELECT_BGIMG( item.tpl.background)
      })
      this.canGoStepTwo = true
      this.canGoStepThree = true
      this.canSave = true
      this.$refs.stepOne.setActiveTpl(this.selectedTpl[0], 0)
      this.form.name = item.name
      this.form.id = item.id
      this.form.bgType = item.bgType

    }
    // 阻止当前页面的浏览器后退事件
    history.pushState(null, null, document.URL)
    window.addEventListener('popstate', function() {
      history.pushState(null, null, document.URL)
    })
    // else {
    //   this.$refs.stepTwo.setEditSelectGroups([])
    //   this.$refs.stepTwo.setEditCheckedTags([])
    // }
  },

  methods: {
    ...mapMutations([
      'LOAD_ITEM_DRUGS', 'CLEAR_SELECT_AUDIO', 'SET_SELECT_BGIMG',
      'SET_PLAYLIST_MUTIPLETPL_SELECTED_TAGS',
      'SET_PLAYLIST_MUTIPLETPL_SELECTED_GROUPS'
    ]),

    ...mapActions(['saveDrgus'
    ]),

    // previous () {
    //   this.activeSteps--
    // },
    //
    // next () {
    //   this.activeSteps++
    // },
    /**
     * 保存为模板
     * */
    saveTplDialog(){
      this.tplDialog = true
    },
    tplCancel() {
      this.tplDialog = false
      this.$refs.tplForm.resetFields()
    },
    tplSave (){
      let data = this._setTplData()
      this.$refs.tplForm.validate(valid => {
        if (valid) {
          http.post('templates',data).then(res=>{
            if (res.data.success){
              this.$notify({
                title: '成功',
                message: '模板保存成功',
                type: 'success'
              })
              this.tplCancel()
            }

          })
        } else {
          this.$notify.error({
            title: '错误',
            message: error.data.message
          })
        }
      })
    },
    /**
     * 设置保存为模板的data
     * */
    _setTplData() {
      let data = {}
      data.name = this.tplForm.name
      data.bgm = this.selectedTpl[0].bgm
      data.direction = this.selectedTpl[0].direction
      data.width = this.selectedTpl[0].width
      data.height = this.selectedTpl[0].height
      data.regions = this.selectedTpl[0].regions
      return data
    },
    /**
     * 保存为内容
     * */
    save () {
      this.$refs.form.validate(valid => {
        this.saveStatus = true
        if (valid) {
          let data = this._setUploadData()
          this.saveDrgus(data).then(res => {
            this._hideDialog('saveDialog')
            this.$router.push('/content/list')
          }).catch(e => {
            return false
          })
        } else {
          return false
        }
      })
    },
    /**
     * 另存为内容
     * */
    newSave(){
      this.$refs.form.validate(valid => {
        if (valid) {
          let data = JSON.parse(JSON.stringify(this._setUploadData()))
          data.id = 0
          this.saveDrgus(data).then(res => {
            this._hideDialog('saveDialog')
            this.$router.push('/content/list')
          }).catch(e => {
            return false
          })
        } else {
          return false
        }
      })
    },
    cancel () {
      this._hideDialog('saveDialog')
      this.$refs.form.resetFields()
    },

    showSaveDialog () {
      this._showDialog('saveDialog')
    },
    /**
     * 保存数据时提交的data
     * */
    _setUploadData () {
      let data = this.form
      let _tpl = {}
      let files = this.selectedFiles
      let tpls = JSON.parse(JSON.stringify(this.selectedTpl))
      tpls.forEach((tpl, tplIndex) => {
        tpl.regions.forEach((region, rIndex) => {
          if (region.type !=='text') {
            region.files = files[tplIndex][rIndex]
          }
        })
      })

      //data.tpl = this.selectedTpl[0]
      data.direction = tpls[0].direction
      data.tpl = tpls[0]
      data.template_id = this.selectedTpl[0].id
      return data
    }
  }
}
</script>
<style lang="scss">
  #content{
    .parentConent .templateContainer{
      height:100%;
      padding: 15px;
    }
  }
</style>
<style lang="scss" scoped>
  .playListEditor {
    height: 100%;
    background-color: #fff;
    position: relative;
    .content-wrapper{
      height: 100%;
      .header{
        font-size: 14px;
        padding-left: 10px;
        margin-top: -10px;
        padding-bottom: 6px;
        border-bottom: 1px solid #e6e6e6
      }
      .content{
        height: calc(100% - 50px);
        overflow-y: auto;
        position: relative;
        section {
          height: 100%;
        }
      }
    .footer {
      width: 100%;
      position: absolute;
      bottom: 0;
      background-color: #fff;
      z-index: 1000;
    }
    }
  }
</style>
