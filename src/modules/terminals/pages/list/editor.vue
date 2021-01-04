<template>
  <el-dialog title="编辑终端" :visible.sync="terminalEditVisible" width='40%'
             @close='click_cancel'>
    <el-dialog width="30%" class='innerDialog'
               title="选择终端分组"
               :visible.sync="innerVisible"
               append-to-body>

      <el-input placeholder="输入关键字进行过滤" v-model="filterText" size='mini' class='m-b-20'></el-input>
      <el-tree :data="filterText"
               :props="defaultProps"
               node-key="id"
               @node-click="handleNodeClick"
               :highlight-current='true'
               :default-expand-all='true'
               :expand-on-click-node="false"
               :filter-node-method="filterNode"
               ref="terminalGroupsTree">
      </el-tree>

    </el-dialog>
    <el-form :model="formData" :rules="rules" ref="formData" size='mini'>
      <el-row>
        <el-col :span='16' :offset='2'>

          <el-form-item label="终端编号" :label-width="formLabelWidth" prop="number">
            <el-input v-model="formData.number" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>

          <el-form-item label="终端名称" :label-width="formLabelWidth" prop="name">
            <el-input v-model="formData.name" auto-complete="off">
            </el-input>
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

          <el-form-item label="屏幕方向" :label-width="formLabelWidth" prop="direction">
            <el-radio v-model="formData.direction" :disabled="true" label="0">横屏</el-radio>
            <el-radio v-model="formData.direction" :disabled="true" label="1">竖屏</el-radio>
          </el-form-item>

          <el-form-item label="版本号" :label-width="formLabelWidth" prop="version">
            <el-input v-model="formData.version" auto-complete="off" :disabled="true">
            </el-input>
          </el-form-item>

          <!-- <el-form-item label="天气城市" :label-width="formLabelWidth">
            <el-select v-model="formData.city_id" placeholder="请选择城市">
              <el-option label="北京" value="北京"></el-option>
              <el-option label="上海" value="上海"></el-option>
              <el-option label="深圳" value="深圳"></el-option>
            </el-select>
            </el-input>
          </el-form-item> -->

          <el-form-item label="安装地址" :label-width="formLabelWidth">
            <el-input v-model="formData.adress" auto-complete="off">
            </el-input>
          </el-form-item>

          <!-- <el-form-item label="所属分组" :label-width="formLabelWidth" prop="groupName">
            <el-input v-model='formData.group_name' @focus='selectiveGroup' readonly></el-input>
          </el-form-item> -->

          <!-- <el-form-item label="拼接编号" :label-width="formLabelWidth">
            <el-input v-model="formData.determ_number" auto-complete="off">
            </el-input>
          </el-form-item> -->

          <!-- <el-form-item label="地理位置" :label-width="formLabelWidth">
            <div id="geographical"></div>
          </el-form-item> -->
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="click_cancel">取 消</el-button>
      <el-button type="primary" @click="click_save('formData')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import TerminalGroup from '../../static/js/TerminalGroup.js'
import { copy } from '../../static/js/utils.js'

export default {
  props: ['isterminalEditVisible', 'redactTerminal'],

  watch: {
    'isterminalEditVisible' (newV, oldV) {
      this.terminalEditVisible = newV
    },
    filterText (val) {
      this.$refs.terminalGroupsTree.filter(val)
    },
    'redactTerminal' (newV, oldV) {
      this.formData = newV
      copy(this.activeTerminalCopy, newV)
    }
  },

  computed: {
    ...mapState({
      terminalGroups: state => state.terminal.terminalGroups
    })
  },

  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      terminalEditVisible: false,
      innerVisible: false,
      formData: {
        number: '',
        name: '',
        region: '',
        mac: '',
        direction: '0',
        version: '',
        city_id: '',
        group_id: '',
        group_name: '',
        // determ_number: '',
        description: '',
        type: ''
      },
      formLabelWidth: '120px',
      filterText: '',
      activeTerminalCopy: {},
      rules: {
        number: [{required: true, message: '请输入终端编号', tigger: 'blur'}],
        // name: [{required: true, message: '请输入终端名称', tigger: 'blur'}],
        mac: [{required: true, message: '请输入MAC地址', tigger: 'blur'}],
        type: [{required: true, message: '请输入型号', tigger: 'blur'}],
        direction: [{required: true, message: '请选择屏幕方向', tigger: 'blur'}],
        version: [{required: true, message: '请输入版本号', tigger: 'blur'}]
      }
    }
  },

  mounted () {
    // this.getTerminalGroups()
  },

  methods: {
    ...mapActions([
      'getTerminalGroups'
    ]),

    ...mapMutations({
      is_refresh: 'IS_REFRESH'
    }),

    handleNodeClick (data, node) {
      this.formData.group_name = node.data.name
      this.formData.group_id = node.data.id
      this.innerVisible = false
    },

    click_cancel () {
      this.$emit('terminalEditHiden', false)
      this.terminalEditVisible = false
      copy(this.formData, this.activeTerminalCopy)
      console.log(this.formData)
      console.log(this.activeTerminalCopy)
    },

    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },

    selectiveGroup () {
      this.innerVisible = true
      // this.$refs.terminalGroupsTree.setCurrentKey(this.formData.id)
    },

    click_save (formName) {
      let self = this
      self.$refs[formName].validate((valid) => {
        if (valid) {
          let terminalId = self.formData.id
          let groupId = self.formData.group_id
          let terminalName = self.formData.name
          let description = self.formData.description
          self.is_refresh(true)
          TerminalGroup.terminalRedact(terminalId, groupId, terminalName, description)
            .then(res => {
              console.log(res)
              self.formData = res.data
              self.is_refresh(false)
              self.$emit('terminalEditHiden', false)
            })
            .catch(err => {
              console.log(err)
              self.is_refresh(false)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    handleSelect (item) {
      console.log(item)
    },

    handleIconClick (ev) {
      console.log(ev)
    }
  }
}
</script>

<style lang='scss' scoped>
  // .el-form-item {
  //   margin-bottom: 13px;
  // }
  // .el-form-item__label,
  // .el-form-item__content {
  //   line-height: 30px;
  // }
  // .el-select,
  // .el-cascader {
  //   width: 100%;
  // }
  // .el-autocomplete {
  //   width: 100%;
  // }
  .el-tree {
    max-height: 500px;
    overflow-y: auto;
  }
  #geographical {
    height: 150px;
    border: 1px solid red;
  }
</style>
