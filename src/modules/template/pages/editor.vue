<!--
  author: wangwei(w.w@tcl.com)  2017-11-16
  modifier: chenxi(chxi@tcl.com) 2017-11-18
-->
<template>
  <div class="parentConent">
    <!-- header -->
    <headerbar>
      <span slot='submenuName'>模板制作</span>
    </headerbar>
    <!-- 保存按钮触发的dialog -->
    <el-dialog
      title="模板名称"
      placeholder="请输入模板名称"
      :visible.sync="showSaveDialog"
      width="200"
      modal
      modal-append-to-body
      show-close
      lock-scroll>
      <el-form :model="tpl" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="模板名称" prop="name">
          <el-input v-model="tpl.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
          <el-button @click="showSaveDialog = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- container -->
    <div class="templateContainer">
      <div class="headerbar">

        <el-radio-group v-model="tpl.direction" v-if="!tpl.id" >
          <el-radio-button label="0" >横屏</el-radio-button>
          <el-radio-button label="1">竖屏</el-radio-button>
        </el-radio-group>

        <el-button-group>
          <el-tooltip effect="dark" content="视频区域" placement="bottom">
            <el-button type="default" @click="addRegion('video')" title="视频区域" icon="el-icon-caret-right"></el-button>
          </el-tooltip>

          <el-tooltip effect="dark" content="图片区域" placement="bottom">
            <el-button type="default" @click="addRegion('picture')" title="图片区域" icon="el-icon-picture"></el-button>
          </el-tooltip>

          <el-tooltip effect="dark" content="日期" placement="bottom">
            <el-button type="default" @click="addRegion('date')" title="日期" icon="el-icon-date"></el-button>
          </el-tooltip>

          <el-tooltip effect="dark" content="时间" placement="bottom">
            <el-button type="default" @click="addRegion('time')" title="时间" icon="el-icon-time"></el-button>
          </el-tooltip>
        </el-button-group>
        <el-button-group>
          <el-tooltip effect="dark" content="设置背景图片" placement="bottom">
            <el-button type="default" @click="checkBg" title="设置背景图片" icon="el-icon-picture-outline"></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="清除背景图片" placement="bottom">
            <el-button type="default" :disabled="tpl.bg_img_path == ''" @click="clearBg" title="清除背景图片" icon="el-icon-remove-outline"></el-button>
          </el-tooltip>
        </el-button-group>
        <!-- <button @click="selectMusic">Music</button> -->
        <div class="saveback">
          <el-tooltip effect="dark" content="保存" placement="bottom">
            <el-button type="primary"  @click="showSaveDialog = true" icon="el-icon-check" title='保存'></el-button>
          </el-tooltip>
          <router-link to="/template/list">
            <el-tooltip effect="dark" content="返回" placement="bottom">
              <el-button icon="el-icon-arrow-left"></el-button>
              </el-tooltip>
          </router-link>
        </div>

      </div>
      <!-- 编辑区域 -->
      <editor :tpl="tpl"></editor>
    </div>
    <!-- 真实的选择文件按钮 -->
    <div class="hidden">
      <input type="file" multiple class="fileUploadBtn" @change="onFilesChange" accept=".png,.jpg,.jpeg">
    </div>
    <element-selector :elementsdialogshow.sync='elementsdialogshow'
                      v-on:fileSelected="onFileSelected"
                      :selectedReginType = 'selectedReginType'>
    </element-selector>
  </div>
</template>

<script>
import editor from '../components/Editor.vue'
// import axios from 'axios'
import axios from '../../../../static/js/utils/http'
import { mapState, mapMutations } from 'vuex'
import creator from '../static/Creator'
import headerbar from '@/components/HeaderBar'
import $ from 'jquery'

import elementSelector from '@/modules/element/lib/addelementsdialog.vue'

export default {
  components: {
    editor, headerbar, elementSelector
  },
  data () {
    return {
      showSaveDialog: false,
      elementsdialogshow: false,
      selectedReginType: '',
      isCollapse: false,
      tpl: {
        bg_img_path: '',
        direction: '0'
      },
      groupId: 1,
      before_tpl: '',
      rules: {
        name: [
          { required: true, message: '请输入模板的名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.initData()
    var me = this
    window.onbeforeunload = function () {
      let flag = JSON.stringify(me.tpl.data)
      if (flag !== me.before_tpl) {
        event.returnValue = '确定离开当前页面吗？'
      }
    }
    this.$router.beforeEach((to, from, next) => {
      if (from.name && from.name.indexOf('templateedit') > -1) {
        let flag = JSON.stringify(me.tpl.data)
        if (flag !== me.before_tpl) {
          if (!window.confirm('确定离开当前页面吗？模板已修改，没有保存噢')) {
            return
          } else {
            me.before_tpl = flag
            window.onbeforeunload = undefined
          }
        }
      }
      next()
    })
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
        axios.get(`templates?id=${id}`).then((resp) => {
          me.tpl = resp.data
          me.setBeforeData(me.tpl.data)
        }).catch((resp) => {
          console.log('1111')
        })
      } else {
        me.tpl = creator.newTpl(this.$route.params.type)
        me.setBeforeData(me.tpl.data)
      }
    },
    // 清空背景
    clearBg () {
      this.$set(this.tpl, 'bg_img_path', '')
      this.$notify({
        message: '背景图片已清除',
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
      // 视频区域只能添加1个
      // 图片区域限制10个
      let { id, count } = creator.findId(this.tpl.data, type)
      let typeCount = {
        'video': 1,
        'date': 1,
        'time': 1,
        'picture': 10
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
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        }
        this.SET_FLOAT_2_INT(this.tpl)
        if (this.buildSaveData() === false) {
          this.$notify({
            message: `有区域溢出模板，请检查后再次操作`,
            type: 'warning'
          })
          return false
        }
        let res
        if (this.tpl.id) {
          res = axios.put(`templates/${this.tpl.id}`, this.tpl)
        } else {
          this.tpl.group_id = this.groupId
          res = axios.post('templates', this.tpl)
        }
        res.then((response) => {
          this.$notify({
            message: '恭喜你，模板保存成功',
            type: 'success'
          })
          this.setBeforeData(this.tpl.data)
          this.showSaveDialog = false
        }).catch((resp) => {
          this.$notify({
            message: '失败了',
            type: 'error'
          })
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .templateContainer{
    position: relative;  
    .headerbar {
      margin: -15px -15px 15px -15px;
      width: 100%;
      .saveback {
        display: inline-block;
        margin-right: 15px;
      }
    }
  }
  .hidden {
    visibility: hidden;
  }
</style>
