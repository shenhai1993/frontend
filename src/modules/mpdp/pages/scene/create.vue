<!--
  author: wangwei(w.w@tcl.com)  2017-11-16
  modifier: chenxi(chxi@tcl.com) 2017-11-18
-->
<template>
  <div class="parentConent" id="sstemplateeditor" v-loading="loading">
    <!-- 保存按钮触发的dialog -->
    <el-dialog
      title="场景制作"
      :visible.sync="showSaveDialog">
      <el-form :model="tpl" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="场景名称" prop="name">
          <el-input v-model="tpl.name" maxlength="20" show-word-limit></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
          <el-button @click="showSaveDialog = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- container -->
    <div class="sceneContainer">
      <div class="headerbar">
        <!--
        <el-select v-if="!isEdit" v-model="screen" placeholder="请选择适配规格">
          <el-option
            v-for="(item, index) in screens"
            :key="item.id"
            :label="item|screen"
            :value="index">
            <span style="float: left">{{ item.direction == 0 ? '横屏' : '竖屏' }} </span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.row }} * {{ item.col }}</span>
          </el-option>
        </el-select>
        -->

        <el-button v-if="!isEdit" type="primary" @click="setScreensDialog = true" style="vertical-align: middle;">设置规格</el-button>

        <el-button-group>
          <el-tooltip effect="dark" content="视频区域" placement="bottom">
            <el-button type="default" @click="addRegion('video')" title="视频区域" icon="el-icon-caret-right" :disabled="disabledAdd"></el-button>
          </el-tooltip>

          <!--
          <el-tooltip effect="dark" content="信源区域" placement="bottom">
            <el-button type="default" @click="addRegion('tv')" title="信源区域" icon="fa fa-tv"></el-button>
          </el-tooltip>
          -->

          <el-tooltip effect="dark" content="图片区域" placement="bottom">
            <el-button type="default" @click="addRegion('picture')" title="图片区域" icon="el-icon-picture" :disabled="disabledAdd"></el-button>
          </el-tooltip>

          <!--
          <el-tooltip effect="dark" content="网页区域" placement="bottom">
            <el-button type="default" @click="addRegion('webpage')" title="网页区域" icon="el-icon-tickets"></el-button>
          </el-tooltip>
          -->
        </el-button-group>

        <!-- <button @click="selectMusic">Music</button> -->
        <div class="saveback">
          <el-tooltip effect="dark" content="保存" placement="bottom">
            <el-button type="primary" @click="checkSaveDialog" icon="el-icon-check" title='保存'></el-button>
          </el-tooltip>

          <router-link to="/mpdp/scene/list">
            <el-tooltip effect="dark" content="返回" placement="bottom">
              <el-button icon="el-icon-arrow-left"></el-button>
              </el-tooltip>
          </router-link>
        </div>
      </div>
      <!-- 编辑区域 -->
      <editor :tpl="tpl"></editor>
    </div>

    <el-dialog
      width="500px"
      title="设置规格"
      :visible.sync="setScreensDialog"
      @close="setScreensDialog = false">
      <el-form
        label-width="120px">
        <el-form-item label="方向：">
          <el-radio v-model="setScreensData.direction" :label="0">横屏</el-radio>
          <el-radio v-model="setScreensData.direction" :label="1">竖屏</el-radio>
        </el-form-item>
        <el-form-item label="规格：">
          行&nbsp;&nbsp;
          <el-input-number v-model="setScreensData.row" :min="1" :max="10" controls-position="right" style="margin-bottom: 10px;"></el-input-number>
          <br/>
          列&nbsp;&nbsp;
          <el-input-number v-model="setScreensData.col" :min="1" :max="10" controls-position="right"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setScreensDialog = false">取 消</el-button>
        <el-button type="primary" @click="setScreens">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import editor from '../../components/Editor.vue'
import axios from '../../../../../static/js/utils/http'
import { copy } from '@/modules/terminals/static/js/utils.js'
import { mapState, mapMutations } from 'vuex'
import creator from '../../static/Creator'
import checkScreen from '../../static/checkScreen'
import headerbar from '@/components/HeaderBar'
import $ from 'jquery'

export default {
  components: {
    editor, headerbar
  },
  filters: {
    screen: function (item) {
      let a = item.direction === 0 ? '横屏' : '竖屏'
      let b = `${item.row} * ${item.col}`
      return a + '    ' + b
    }
  },
  data () {
    return {
      loading: false,
      disabledAdd: true,
      isEdit: false,
      groupId: 0,
      showSaveDialog: false,
      elementsdialogshow: false,
      selectedReginType: '',
      isCollapse: false,
      // 屏幕列表
      screens: [],
      // 选中屏幕
      screen: null,
      tpl: {
        bg_img_path: '',
        direction: '0'
      },
      before_tpl: '',
      rules: {
        name: [
          { required: true, message: '请输入场景的名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      },
      setScreensDialog: false,
      oldScreensData: '',
      setScreensData: {
        direction: 0,
        row: 1,
        col: 1
      }
    }
  },
  mounted () {
    let objAuth = this.$cookies.get('authUser')
    let authUser = (typeof objAuth === 'string') ? JSON.parse(objAuth) : objAuth
    this.groupId = authUser.group_id
    this.initData()
    var me = this
    window.onbeforeunload = function () {
      let flag = JSON.stringify(me.tpl.data)
      if (flag !== me.before_tpl) {
        event.returnValue = '确定离开当前页面吗？'
      }
    }
    // this.$router.beforeEach((to, from, next) => {
    //   if (from.name && from.name.indexOf('templateedit') > -1) {
    //     let flag = JSON.stringify(me.tpl.data)
    //     if (flag !== me.before_tpl) {
    //       if (!window.confirm('确定离开当前页面吗？场景已修改，没有保存噢')) {
    //         return
    //       } else {
    //         me.before_tpl = flag
    //         window.onbeforeunload = undefined
    //       }
    //     }
    //   }
    //   next()
    // })
  },
  computed: {
    ...mapState({
      count: state => state.template.count,
      current_region: state => state.template.current_region
    }),
    zoom: {
      get () {
        return this.$store.state.template.zoom
      },
      set (value) {
        this.$store.commit('SET_ZOOM', value)
      }
    }
  },
  watch: {
    // 通过选中屏幕，改变模板属性
    'screen': function (i) {
      let v = this.screens[i]
      this.tpl.data = []
      if (v) {
        this.tpl.direction = v.direction
        this.tpl.row = v.row
        this.tpl.column = v.col
        creator.computeSize(this.tpl)
        this.$set(this.tpl, 'update', new Date())
        this.disabledAdd = false
      } else {
        this.disabledAdd = true
      }
    }
  },
  methods: {
    ...mapMutations([
      'SET_FLOAT_2_INT'
    ]),
    setBeforeData (data) {
      this.before_tpl = JSON.stringify(data)
    },
    selectMusic () {
      this.selectedReginType = 'audio'
      this.elementsdialogshow = true
    },
    initData () {
      let id = this.$route.params.id
      let me = this
      if (id) {
        this.isEdit = true
        let scene = this.$route.params.scene || JSON.parse(sessionStorage.getItem('MPDP_SCENE_EDIT'))
        sessionStorage.setItem('MPDP_SCENE_EDIT', JSON.stringify(scene))
        me.tpl = creator.adaptSize(scene)
        me.setBeforeData(me.tpl.data)
        this.disabledAdd = false
      } else {
        this.isEdit = false
        me.tpl = creator.newTpl(this.$route.params.type)
        me.tpl = Object.assign({}, me.tpl, { column: 1, row: 1 })
        me.setBeforeData(me.tpl.data)
      }
      axios.get(`mpdp/screens`).then((resp) => {
        me.screens = resp.data.message
      })
    },
    // 清空背景
    clearBg () {
      this.$set(this.tpl, 'bg_img_path', '')
      this.$notify({
        message: '背景已清除',
        type: 'success'
      })
    },
    checkBg () {
      $('input.fileUploadBtn').click()
    },
    onFilesChange (e) {
      let me = this
      let file = e.target.files[0]
      var fileReader = new FileReader()
      if (file.size > 2 << 20) {
        this.$notify({
          message: '背景图片不能超过2M',
          type: 'warning'
        })
        e.target.value = ''
      } else {
        fileReader.onloadend = function () {
          if (fileReader.readyState === fileReader.DONE) {
            me.$set(me.tpl, 'bg_img_path', fileReader.result)
          }
          e.target.value = ''
        }
        fileReader.readAsDataURL(file)
      }
    },
    // 音乐文件选中，通过vuex更新
    onFileSelected (files) {
      let obj = {}
      obj.index = this.selectId
      // files.forEach(ele => {
      //   console.log(ele)
      //   // if (ele.type === 'image') {
      //   //   ele.seconds = 15
      //   // }
      // })
      obj.data = files
      this.ADD_SELECTED_ELEMENT(obj)
    },
    addRegion (type) {
      let { id, count } = creator.findId(this.tpl.data, type)
      let typeCount = {
        'video': 20,
        'date': 1,
        'time': 1,
        'webpage': 1,
        'picture': 30
      }
      if (count >= typeCount[type]) {
        this.$notify({
          message: `该类型区域，只能添加 ${typeCount[type]} 个`,
          type: 'warning'
        })
      } else {
        let data = creator.createRegion(type, id, count)
        this.tpl.data.push(data)
      }
      console.log('this.tpl.data:==>', this.tpl.data)
    },
    // 检查区域是否有溢出
    // 并清除选中状态
    buildSaveData () {
      let tpl = this.tpl
      let flag = true
      this.tpl.data.forEach(function (node) {
        if (node.top < 0 || node.left < 0 || node.top + node.height > tpl.height || node.left + node.width > tpl.width) {
          flag = false
        }
      })
      return flag
    },
    checkSaveDialog () {
      if (this.tpl.data.length == 0) {
        this.$notify({
          message: `请先添加元素再保存`,
          type: 'warning'
        })
        return false
      }
      let screenState = checkScreen(this.tpl)
      if (screenState) {
        this.$notify({
          message: '一块屏幕不能出现多个视频，请检查',
          type: 'warning'
        })
        return false
      }
      this.showSaveDialog = true
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        }
        let submitData = {}
        copy(submitData, this.tpl)
        submitData = creator.fullSize(submitData)
        this.SET_FLOAT_2_INT(submitData)
        if (this.buildSaveData() === false) {
          this.$notify({
            message: `有区域溢出场景，请检查后再次操作`,
            type: 'warning'
          })
          return false
        }
        submitData.group_id = this.groupId

        this.showSaveDialog = false
        this.loading = true
        let res
        if (this.tpl.id) {
          res = axios.put(`mpdp/scenes/${this.tpl.id}`, submitData)
        } else {
          res = axios.post('mpdp/scenes', submitData)
        }
        res.then((response) => {
          this.loading = false
          if (!response || !response.data.success) {
            this.$notify({
              message: '失败了',
              type: 'error'
            })
            return
          }
          this.$notify({
            message: '恭喜你，场景保存成功',
            type: 'success'
          })
          this.setBeforeData(this.tpl.data)
          this.tpl.id = response.data.message.id
          this.$router.push({path: '/mpdp/scene/list'})
        }).catch((resp) => {
          this.loading = false
          this.$notify({
            message: '失败了',
            type: 'error'
          })
        })
      })
    },
    setScreens () {
      const v = this.setScreensData
      const v_str = JSON.stringify(v)
      if (this.oldScreensData !== '' && this.oldScreensData === v_str) {
        this.setScreensDialog = false
        return
      }
      this.oldScreensData = v_str
      this.tpl.data = []
      this.tpl.direction = v.direction
      this.tpl.row = v.row
      this.tpl.column = v.col
      creator.computeSize(this.tpl)
      this.$set(this.tpl, 'update', new Date())
      this.disabledAdd = false
      this.setScreensDialog = false
    }
  }
}
</script>
<style lang="scss">
#sstemplateeditor {
  .sceneContainer {
    height: 100%;
  }
  .el-select {
    width: 160px;
    vertical-align: middle;
  }
  .headerbar {
    margin: -15px -15px 15px -15px;
    .saveback {
      float: right;
      margin-right: 15px;
    }
  }

  .hidden {
    visibility: hidden;
  }
}
</style>
