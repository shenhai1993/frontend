<template>
  <el-dialog title="编辑终端" :visible="isterminalEditVisible" width='500px'
             @close='click_cancel'>
    <el-form :model="formData" :rules="rules" ref="formData">
      <el-row>
        <el-col :span='23' :offset='0'>

          <el-form-item label="终端编号" :label-width="formLabelWidth" prop="number">
            <el-input v-model="formData.number" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>

          <el-form-item label="终端名称" :label-width="formLabelWidth" prop="name">
            <el-input v-model="formData.name" auto-complete="off" maxlength="15">
            </el-input>
          </el-form-item>

          <el-form-item label="屏幕方向" :label-width="formLabelWidth" prop="direction">
            <el-radio-group v-model="formData.direction" :disabled="radioStu">
              <el-radio :label="0">横屏</el-radio>
              <el-radio :label="2">横屏（反）</el-radio><br/>
              <el-radio :label="1">竖屏</el-radio>
              <el-radio :label="3">竖屏（反）</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="MAC地址" :label-width="formLabelWidth" prop="mac" >
            <el-input v-model="formData.mac" auto-complete="off" :disabled="true">
            </el-input>
          </el-form-item>

          <el-form-item label="型号" :label-width="formLabelWidth" prop="type">
            <el-select v-model="formData.type" placeholder="请选择型号" :disabled="true">
              <el-option label="windows" value="windows"></el-option>
              <el-option label="Linux" value="Linux"></el-option>
              <el-option label="Android" value="Android"></el-option>
              <el-option label="MS801" value="MS801"></el-option>
            </el-select>
          </el-form-item>

          <!-- <el-form-item label="屏幕方向" :label-width="formLabelWidth" prop="direction">
            <el-radio v-model="formData.direction" :disabled="true" label="0">横屏</el-radio>
            <el-radio v-model="formData.direction" :disabled="true" label="1">竖屏</el-radio>
          </el-form-item> -->

          <el-form-item label="版本号" :label-width="formLabelWidth" prop="version">
            <el-input v-model="formData.version" auto-complete="off" :disabled="true">
            </el-input>
          </el-form-item>

          <el-form-item label="安装地址" :label-width="formLabelWidth"  maxlength="30">
            <el-input v-model="formData.description" auto-complete="off">
            </el-input>
          </el-form-item>

          <el-form-item label="类型" :label-width="formLabelWidth">
            <el-radio v-model="normalnumType" label="0">普通屏</el-radio>
            <el-radio v-model="normalnumType" label="1">拼接屏</el-radio>
          </el-form-item>

          <el-form-item v-if="normalnumType == '1'" label="拼接规格" :label-width="formLabelWidth" prop="mpdp_spec">
            <el-select v-model="formData.mpdp_spec" placeholder="请选择规格">
              <el-option v-for="(item, index) in mpdpSpec" :key="index" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item v-if="normalnumType == '1'" label="拼接屏编号" :label-width="formLabelWidth" prop="normalnum">
            <el-input v-model="formData.normalnum" auto-complete="off">
            </el-input>
          </el-form-item>
<!--
          <el-form-item label="投放城市" :label-width="formLabelWidth" prop="city_id">
            <el-select v-model="formData.city_id" placeholder="请选择城市">
              <el-option v-for="(item, index) in cities" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="投放类型" :label-width="formLabelWidth" prop="place_type">
            <el-select v-model="formData.place_type" placeholder="请选择投放类型">
              <el-option label="医院" value="1"></el-option>
              <el-option label="小区" value="2"></el-option>
              <el-option label="学校" value="3"></el-option>
              <el-option label="公交站" value="4"></el-option>
            </el-select>
          </el-form-item>
 -->
          <el-form-item label="管理员" :label-width="formLabelWidth" prop="linkman">
            <el-input v-model="formData.linkman" auto-complete="off" maxlength="15">
            </el-input>
          </el-form-item>

          <el-form-item v-if="!ismpdp" :label-width="formLabelWidth" label="标签">
            <div class="tag-wrapper" v-if="terminalTags.length!==0">
              <el-tag class="tagged" closable @close="handleClose(tag)" size="medium" v-for="tag in terminalTags" :key="tag">{{tag}}</el-tag>
            </div>
            <el-button @click="selectTag">
              <i class="fa fa-plus"></i>
            </el-button>
          </el-form-item>


        </el-col>
      </el-row>
    </el-form>
    <el-dialog :visible.sync="tagsDialog" append-to-body width="500px" title="选择标签">
      <checkbox :list="allTagsList" class="terminalsCheckbox"
        :checked="tags" @emitChecked="updateTags" ref="chkTags"></checkbox>
      <el-input class="input-new-tag" @blur="handleInputConfirm" @keyup.enter.native="handleInputConfirm"  maxlength="8" size="small" ref="saveTagInput" v-if="inputVisible" v-model="newTag"></el-input>
      <el-button class="button-new-tag" size="small" v-else @click="showInput" style="margin-left: 0px">
        <i class="fa fa-plus"></i>
      </el-button>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save_tag()">确 定</el-button>
    </div>

    </el-dialog>
    <div slot="footer" class="dialog-footer">
      <el-button @click="click_cancel">取 消</el-button>
      <el-button type="primary" @click="click_save('formData')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import api from '../../static/js/api'
import { copy } from '@static/js/utils/utils.js'
import Checkbox from '@/components/Checkbox'

const _mpdpSpec = [
        '1X1',
        '1X2',
        '1X3',
        '1X4',
        '1X5',
        '1X6',
        '1X7',
        '1X8',
        '1X9',
        '1X10',
        '2X1',
        '2X2',
        '2X3',
        '2X4',
        '2X5',
        '2X6',
        '2X7',
        '2X8',
        '2X9',
        '2X10',
        '3X1',
        '3X2',
        '3X3',
        '3X4',
        '3X5',
        '3X6',
        '3X7',
        '3X8',
        '3X9',
        '3X10',
        '4X1',
        '4X2',
        '4X3',
        '4X4',
        '4X5',
        '4X6',
        '4X7',
        '4X8',
        '4X9',
        '4X10',
        '5X1',
        '5X2',
        '5X3',
        '5X4',
        '5X5',
        '5X6',
        '5X7',
        '5X8',
        '5X9',
        '5X10',
        '6X1',
        '6X2',
        '6X3',
        '6X4',
        '6X5',
        '6X6',
        '6X7',
        '6X8',
        '6X9',
        '6X10',
        '7X1',
        '7X2',
        '7X3',
        '7X4',
        '7X5',
        '7X6',
        '7X7',
        '7X8',
        '7X9',
        '7X10',
        '8X1',
        '8X2',
        '8X3',
        '8X4',
        '8X5',
        '8X6',
        '8X7',
        '8X8',
        '8X9',
        '8X10',
        '9X1',
        '9X2',
        '9X3',
        '9X4',
        '9X5',
        '9X6',
        '9X7',
        '9X8',
        '9X9',
        '9X10',
        '10X1',
        '10X2',
        '10X3',
        '10X4',
        '10X5',
        '10X6',
        '10X7',
        '10X8',
        '10X9',
        '10X10'
      ]

export default {
  components: {
    Checkbox
  },

  props: ['isterminalEditVisible', 'terminalData', 'allTags', 'ismpdp', 'cities', 'radioStu'],

  data () {
    return {
      innerVisible: false,
      allTagsList: [],
      tagsDialog: false,
      tags: [],
      newTag: '',
      inputVisible: false,
      terminalTags: [],
      normalnumType: '0',
      formData: {
        number: '',
        name: '',
        region: '',
        mac: '',
        direction: 0,
        version: '',
        normalnum: 1,
        mpdp_spec: '',
        city_id: '',
        group_id: '',
        group_name: '',
        // determ_number: '',
        description: '',
        type: '',
        place_type: 1,
        linkman: ''
      },
      mpdpSpec: _mpdpSpec,
      formLabelWidth: '120px',
      activeTerminalCopy: {},
      rules: {
        number: [{required: true, message: '请输入终端编号', tigger: 'blur'}],
        // name: [{required: true, message: '请输入终端名称', tigger: 'blur'}],
        mac: [{required: true, message: '请输入MAC地址', tigger: 'blur'}],
        type: [{required: true, message: '请输入型号', tigger: 'blur'}],
        direction: [{required: true, message: '请选择屏幕方向'}],
        version: [{required: true, message: '请输入版本号', tigger: 'blur'}],
        mpdp_spec: [{required: true, message: '请选择规格', trigger: 'change'}],
        normalnum: [{required: true, pattern: /^[1-9]\d*$/, message: '请输入正整数', trigger: 'blur'}]
      }
    }
  },

  computed: {

  },

  methods: {
    handleNodeClick (data, node) {
      this.formData.group_name = node.data.name
      this.formData.group_id = node.data.id
      this.innerVisible = false
    },

    click_cancel () {
      this.$emit('update:isterminalEditVisible', false)
      this.$emit('update:radioStu', false)
      copy(this.formData, this.activeTerminalCopy)
    },

    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },

    selectiveGroup () {
      this.innerVisible = true
    },

    updateTags (checked) {
      // this.terminalTags = checked  // 弹出框点击确定时再同步到 terminalTags
      // this.tags = checked // 这里浏览器会崩, 死循环
    },

    selectTag () {
      this.tagsDialog = true
    },

    showInput () {
      this.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm () {
      this.newTag = this.newTag.trim()
      if (this.newTag !== '') {
        if(this.newTag.length > 20) {
          return this.$notify({
            title: '警告',
            message: '标签长度不能超过20字',
            type: 'warning'
          });
        }
        if (!this.allTagsList.includes(this.newTag)){
          this.allTagsList.push(this.newTag)
          this.tags.push(this.newTag)
        } else {
          this.$notify({
            title: '警告',
            message: '标签不能重复',
            type: 'warning'
          });
        }
        // this.terminalTags.push(this.newTag) // 弹出框点击确定时再同步到 terminalTags
      }
      this.inputVisible = false
      this.newTag = ''
    },

    handleClose (tag) {
      this.terminalTags.splice(this.terminalTags.indexOf(tag), 1)
      this.tags.splice(this.tags.indexOf(tag), 1)
    },

    click_save (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let terminalId = this.formData.id
          this.formData.tags = this.terminalTags
          if (this.formData.tags.length === 0) {
            // delete this.formData.tags // 不能删除, 需要通知后台清空终端标签属性
          }
          let loading = this.$loading({
            lock: true,
            text: '保存中, 请稍后...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          if (this.normalnumType == '0') {
            this.formData = Object.assign({}, this.formData, { normalnum: 0 })
          } else {
            const normalnum = parseInt(this.formData.normalnum)
            const max = this.getMaxNormals()
            if (normalnum > max) {
              loading.close()
              this.$alert(
                '拼接屏编号（' + normalnum + '）不在拼接规格（' + this.formData.mpdp_spec + '）范围内，请重新输入',
                '错误',
                {
                  type: 'warning',
                },
              )
              return
            }
            this.formData = Object.assign({}, this.formData, { normalnum: normalnum })
          }
          api.editTerminal(terminalId, this.formData)
            .then(res => {
              loading.close()
              if(res.data.success === true) {
                this.$notify.success({
                  title: '修改成功'
                })
                this.$emit('update:isterminalEditVisible', false)
                this.$emit('refresh')
                return
              }
              this.$notify.error({
                title: '错误',
                message: res.data.message,
                showClose: false
              })
            }).catch(() => {
              loading.close()
              this.$notify.error({
                title: '错误',
                message: '修改未成功，请检查后重试',
                showClose: false
              })
            })
        }
      })
    },

    // 选择标签, 点击确认后保存到终端tags
    save_tag() {
      let checked = this.$refs.chkTags.getChecked()
      // this.terminalTags = this.tags = checked
      this.tags = checked
      this.terminalTags = checked.concat()
      this.tagsDialog = false
    },

    _setTags () {
      let _tags = []
      this.terminalData.tagged.forEach(tag => {
        _tags.push(tag.tag.name)
      })
      this.terminalTags = _tags
    },

    getMaxNormals () {
      let spec = this.formData.mpdp_spec
      let max = 1
      if (spec !== '') {
        spec = spec.split('X')
        max = parseInt(spec[0]) * parseInt(spec[1])
      }
      return max
    }
  },

  watch: {
    terminalData: {
      handler (n, o) {
        this._setTags()
        this.formData = JSON.parse(JSON.stringify(n))
        this.formData.place_type = String(this.formData.place_type)
        if (this.formData.normalnum > 0) {
          this.normalnumType = '1'
        } else {
          this.normalnumType = '0'
        }
        copy(this.activeTerminalCopy, n)
        let _tags = []
        n.tagged.forEach(tag => {
          _tags.push(tag.tag.name)
        })
        this.tags = _tags
      },
      deep: true
    },

    normalnumType (v) {
      if (v == '1' && !(/^[1-9]\d*$/.test(this.formData.normalnum))) {
        this.formData = Object.assign({}, this.formData, { normalnum: 1 })
      }
    },

    allTags: {
      handler (n, o) {
        this.allTagsList = n.concat()
      },
      deep: true
    }
  }
}
</script>

<style lang='scss' scoped>
.tag-wrapper{
  display: inline-block;
  .el-tag {
    margin-right: 10px;
  }
}
.tagged {
  margin-bottom: 8px;
}
.el-checkbox {
  width: 100px;
  margin-bottom: 10px;
}
.button-new-tag, .input-new-tag {
  margin: 10px 0 0 30px
}
.input-new-tag {
  width: 160px;
}
.el-radio {
  margin-bottom: 10px;
}
</style>
<style lang="scss">
  .terminalsCheckbox{
   >.el-checkbox:first-child{
     margin-left: 0px !important;
   }
  }
</style>
