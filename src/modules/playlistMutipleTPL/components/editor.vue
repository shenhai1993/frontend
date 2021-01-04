<template>
  <div class='playListEditor'>
    <div class="content-wrapper">
      <div class="header">
       <!-- <h3 v-show="activeSteps === 0">选择内容</h3>-->
        <el-button v-show="activeSteps === 0">选择内容</el-button>
        <el-select v-model.number="direction" v-show="activeSteps === 0" style="width: 320px;vertical-align: middle" @change="changeDirection" placeholder="请选择屏幕方向">
          <el-option label="横屏" :value="0"></el-option>
          <el-option label="竖屏" :value="1"></el-option>
        </el-select>
        <el-row v-show="activeSteps === 1"><el-col :span="16"><el-button>选择终端</el-button></el-col>
          <el-col :span="8"><el-button>选择标签</el-button></el-col>
        </el-row>
      </div>
      <div class="content">
        <section v-show="activeSteps === 0">
            <content-tbale :tableData="files" :defaultRow="groupIdArr" :canNext.sync='canGoStepTwo' :loading.sync='loading' @changeArrId = "setContentId"></content-tbale>
        </section>
        <!--<section v-show="activeSteps === 0">
          <step-one :canNext.sync='canGoStepTwo' ref="stepOne"
          :activeSteps='activeSteps'></step-one>
        </section> -->
        <section v-show="activeSteps === 1" >
          <step-two :canNext.sync='canGoStepThree' :activeSteps='activeSteps' :defaultChecked.sync='this.selectedGroups' ref="stepTwo"></step-two>
        </section>
      </div>

      <div class="footer p-10">
        <el-button @click="previous" :disabled="activeSteps === 0">上一步</el-button>
         <el-button @click="next" :disabled="!canNext" >下一步</el-button>
         <el-button @click="showSaveDialog()" :disabled="!canSave">保存</el-button>
         <router-link to="/playlistmutipletpl/lists" class="m-l-10">
           <el-button>取消</el-button>
         </router-link>
       </div>
       <!-- 保存form -->
      <el-dialog @close="cancel" :visible.sync="saveDialog" width="520px" title="播出单">
        <el-form ref="form" :rules="rules" :model="form" label-width="100px">
          <el-form-item prop="name" label="名称">
            <el-input v-focus  v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item  label="类型">
            <el-radio-group v-model="form.type" @change="changetype">
              <el-radio :label="0">主播</el-radio>
              <el-radio :label="1">插播</el-radio>
              <el-radio :label="2">垫片</el-radio>
              <el-radio :label="3">弹窗</el-radio>
              <el-radio :label="4">点播</el-radio>
              <el-radio :label="5">互动</el-radio>
              <el-radio :label="6">同步</el-radio>
            </el-radio-group>
          </el-form-item>
          <!--
          <el-form-item prop="etype" label="主播扩展属性">
            <el-select v-model="form.etype" placeholder="请选择" :disabled = "form.type != 0">
              <el-option
                v-for="item in etypes"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="bind_id" label="关联播出单">
            <el-select v-model="form.bind_id" placeholder="请选择" :disabled = "form.etype != 2">
              <el-option-group
                v-for="group in plainTerminals"
                :key="group.label"
                :label="group.label">
                <el-option
                  v-for="item in group.options"
                  :key="item.playlist_id"
                  :label="item.label"
                  :value="item.playlist_id">
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
          -->
          <el-form-item prop="date" label="起止日期" class="flexStyle">
            <el-date-picker
              style="width: 178px"
              v-model="form.schedule.date.start"
              type="date"
              :clearable="false"
              :disabled = "timeStatus"
              :editable="false"
              placeholde="开始日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptionsStart">
              </el-date-picker>
              <span>至</span>
            <el-date-picker
              style="width: 178px"
              v-model="form.schedule.date.end"
              :disabled = "timeStatus"
              :clearable="false"
              :editable="false"
              type="date"
              placeholde="结束日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptionsEnd">
              </el-date-picker>
          </el-form-item>
          <el-form-item prop="time" label="播出时间段">
            <el-time-picker
              style="width: 100%"
              is-range
              :disabled = "timeStatus"
              v-model="form.time"
              :editable="false"
              range-separator="至"
              start-placeholde="开始时间"
              end-placeholde="结束时间"
              placeholder="选择时间范围"
              format='HH:mm'
              value-format='HH:mm'></el-time-picker>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" maxlength="50" placeholder="最多输入50个字" v-model="form.description"></el-input>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button  @click="cancel">取消</el-button>
          <el-button type="save" @click="save">保存</el-button>
          <el-button type="primary" @click="newSave">另存为</el-button>
<!--          <dialog-button @clickConfirm="save" @clickCancel="cancel" confirmText="保存"></dialog-button>-->
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import StepTwo from './editor/stepTwo.vue'
import ContentTbale from './editor/contentTbale.vue'
import http from '@static/js/utils/http'
import DialogButton from '@/components/DialogButton'

const STEPS = 2

export default {
  components: {
    StepTwo, DialogButton, ContentTbale
  },

  data () {
    return {
      plainTerminals: [],
      groupId: 0,
      activeSteps: 0,
      canGoStepTwo: false,
      canGoStepThree: false,
      canSave: false,
      timeStatus: false,
      files: [],
      direction: 0, // 屏幕方向
      contentList: [],
      groupIdArr: [],
      loading: false,
      etypes: [{
        value: 0,
        label: '无'
      }, {
        value: 1,
        label: '同步'
      }, {
        value: 2,
        label: '关联播出单'
      }],
      form: {
        id: 0, // > 0 为编辑
        name: '',
        type: 0,
        etype: 0,
        bind_id: null,
        time: ['00:00', '23:59'],
        schedule: {
          date: {
            start: '',
            end: ''
          },
          time: {
            start: '',
            end: ''
          }
        },
        direction: 0, //无此属性, 播出单的横竖屏由list里的内容方向决定
        description: '',
        trees: {},
        tags: {},
      },
      saveDialog: false,
      pickerOptionsStart: {
        disabledDate: (time) => {
          return Math.floor(( Date.now() - time.getTime()) / 86400000) > 0 || time.getTime() > new Date(this.form.schedule.date.end)
        }
      },
      pickerOptionsEnd: {
        disabledDate: (time) => {
          return time.getTime() < new Date(this.form.schedule.date.start)
        }
      },
      rules: {
        name: [{required: true, message: '请输入名称', trigger: 'blur'},
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }],
        type: [{required: true, message: '请选择类型', trigger: 'change'}],
        // startDate: [{required: true, message: '请选择开始日期'}],
        // endDate: [{required: true, message: '请选择结束日期'}],
        // time: [{required: true, message: '请选择播出时间段'}]
      }
    }
  },
  computed: {
    ...mapState({
      selectedTpl: state => state.playlistMutipleTPL.selectedTpl,
      drugslists: state => state.playlistMutipleTPL.drugslists,
      selectedFiles: state => state.playlistMutipleTPL.selectedFiles,
      selectedGroups: state => state.playlistMutipleTPL.selectedGroups,
      selectPlayItemData: state => state.playlistMutipleTPL.selectPlayItemData,
      selectedTags: state => state.playlistMutipleTPL.selectedTags,
      playlists: state => state.playlistMutipleTPL.playlists
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

  async mounted () {
    if(this.drugslists.length == 0) { // 页面直接刷新无数据
      this.loading = true
      await this.getContentsLists()
      this.loading = false
    }

    // let _this = this
    //this.groupId = JSON.parse(this.$cookies.get('authUser')).group_id
    let objAuth = this.$cookies.get('authUser')
    this.groupId = (typeof objAuth === 'string') ? JSON.parse(objAuth).group_id : objAuth.group_id

    if(this.playlists.length == 0) {
      this.getPlaylists(this.groupId)
    }

    // 编辑加载
    let id = this.$route.params.id
    id = parseInt(id)
    if(id > 0) {
      let item = this.selectPlayItemData
      this.loading = true
      let res = await http.get('playlists/' + id)
      this.loading = false
      if(!res.data.success){
        return this.$alert('播出单不存在，请返回重试！', '提示', {
          callback: () => {
            this.$router.push('/playlistmutipletpl/lists')
          }
        })
      }
      item = res.data.message // 取最新

      this.direction =  item.direction
      //this.contentList = item.contents
      // this.LOAD_ITEM(item)
      this.changeDirection(this.direction)
      this.canGoStepTwo = true
      this.canGoStepThree = true
      this.canSave = true
      // let arr = []
      // item.tpl.forEach(ele => {
      //   arr.push(ele.id)
      // })
      // this.$refs.stepOne.setActiveTpl(this.selectedTpl[0], 0)
      this.form.id = id
      this.form.name = item.name
      this.changetype(item.type)
      //this.form.type = this.form.type + "" // 转字符串
      this.form.type = item.type
      this.form.etype = item.etype
      this.form.bind_id = item.bind_id
      this.form.schedule.date.start = item.schedule.date.start
      this.form.schedule.date.end = item.schedule.date.end
      this.form.time = [item.schedule.time.start, item.schedule.time.end ]
      this.form.description = item.description
      let trees = []
      item.trees.forEach(ele => {
        trees.push(ele.id)
      });
      this.$refs.stepTwo.setEditSelectGroups(trees)
      let tags = []
      /* item.tags.forEach(ele => {
        tags.push(ele.name)
      }); */
      item.tagged.forEach(ele => {
        tags.push(ele.tag_name)
      });
      this.$refs.stepTwo.setEditCheckedTags(tags)
      this.groupIdArr = item.contents
      // .forEach(ele =>{
      //   this.groupIdArr.push(ele.id)
      // })
    }
    else {
      this.filterTable(0)
      this.$refs.stepTwo.setEditSelectGroups([])
      this.$refs.stepTwo.setEditCheckedTags([])
      this.getNowTime()
    }
    this._getPlainTerminals()
  },

  methods: {
    ...mapMutations([
      'LOAD_ITEM',
      'SET_PLAYLIST_MUTIPLETPL_SELECTED_TAGS',
      'SET_PLAYLIST_MUTIPLETPL_SELECTED_GROUPS'
    ]),

    ...mapActions(['savePlaylist', 'getContentsLists', 'getPlaylists'
    ]),
    changeDirection(val){
      this.filterTable(val)
      this.form.direction = val
    },
    filterTable(val){
      this.files = this.drugslists.filter(file => {
        return file.direction === val
      })
    },
    getNowTime() {
      let now = new Date();
      let year = now.getFullYear() //得到年份
      let month = now.getMonth() //得到月份
      let date = now.getDate() //得到日期
      month = month + 1
      month = month.toString().padStart(2, "0")
      date = date.toString().padStart(2, "0")
      let defaultDate = `${year}-${month}-${date}`

      this.form.schedule.date.start = defaultDate
      this.form.schedule.date.end = defaultDate
    },
    /**
     *  回选选中的id
     * */
    setContentId(val){
      this.contentList = val
    },
    previous () {
      this.activeSteps--
    },
    /**
     *  监听类型 当类型为垫片,互动,点播时禁止选时间
     * */
    changetype(val){
      if (val === 2 || val === 5 || val === 4){
        this.timeStatus = true
      }else {
        this.timeStatus = false
      }
    },
    next () {
      // this.saveDialog = true
      this.activeSteps++
    },

    save () {
      this.$refs.form.validate(valid => {
        if (valid) {
          let data = this._setUploadData()
          this.savePlaylist(data).then(res => {
            this._hideDialog('saveDialog')
            this.$router.push('/playlistmutipletpl/lists')
          }).catch(e => {
            return false
          })
        } else {
          return false
        }
      })
    },
    newSave(){
      this.$refs.form.validate(valid => {
        if (valid) {
          let data = JSON.parse(JSON.stringify(this._setUploadData()))
          data.id = 0
          this.savePlaylist(data).then(res => {
            this._hideDialog('saveDialog')
            this.$router.push('/playlistmutipletpl/lists')
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

    _setUploadData () {
      let data = this.form
      let _tpl = {}
      let files = this.selectedFiles
      if(data.time !== null){
        data.schedule.time.start = data.time[0]
        data.schedule.time.end = data.time[1]
      }
      data.contents = this.contentList
      // this.selectedTpl.forEach((tpl, tplIndex) => {
      //   tpl.regions.forEach((region, rIndex) => {
      //     region.files = files[tplIndex][rIndex]
      //   })
      // })
      // data.tpl = this.selectedTpl
       data.trees = this.selectedGroups
       data.tags = this.selectedTags
       data.publish = 0
      // data.direction = this.selectedTpl[0].direction
      return data
    },

    // 获取关联播出单的终端下拉选框数据
    _getPlainTerminals () {
      let data = this.form
      let url = 'trees/plain-terminals'
      http.get(url)
        .then(res => {
          this.plainTerminals = res.data.message
        })
        .catch(err => {
          console.log(err)
        })

      return data
    }
  }
}
</script>

<style lang="scss" scoped>
  .playListEditor {
    height: 100%;
    padding: 20px;
    background-color: #fff;
    position: relative;
    .content-wrapper{
      height: 100%;
      .header{
        font-size: 14px;
        padding-bottom: 20px;
        border-bottom: 1px solid #e6e6e6
      }
      .content{
        height: calc(100% - 90px);
        overflow-y: auto;
        position: relative;
        section {
          height: 100%;
        }
      }
    .footer {
      width: 100%;
      position: absolute;
      bottom: 15px;
      background-color: #fff;
      z-index: 1000;
    }
    }
  }
</style>
<style lang="scss">
  .flexStyle{
    .el-form-item__content{
      >span{
        margin: 0 3px;
      }
      display: flex}
    }

</style>
