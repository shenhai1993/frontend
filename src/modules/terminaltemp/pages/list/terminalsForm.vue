<template>
  <el-dialog
    @close="click_cancel"
    title="关联设备"
    :visible="showForm"
    width="700px"
    center
    v-loading="loading"
    class="terminals-form">
    <el-row>
      <el-col :span="7"><div class="terminals-form-header">设备组</div></el-col>
      <el-col :span="7"><div class="terminals-form-header">设备</div></el-col>
      <el-col :span="1">&nbsp;</el-col>
      <el-col :span="9">
        <div class="terminals-form-header">已选<el-button @click="clearChecked" type="text">清空</el-button></div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="7">
        <div class="terminals-form-tag">
          <el-tree
            :data="treeData"
            node-key="id"
            :props="defaultProps"
            @node-click="treeNodeClick"
            @node-expand="treeNodeExpand"
            @node-collapse="treeNodeCollapse">
          </el-tree>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="terminals-form-tag">
          <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
            :disabled="listData.length == 0">全选</el-checkbox>
          <div style="height: 15px;"></div>
          <el-checkbox-group v-model="checkedListData" @change="handleCheckedChange">
            <el-checkbox v-for="list in listData" :label="list" :key="list.id" :disabled="list.disabled">{{list.name}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </el-col>
      <el-col :span="1">&nbsp;</el-col>
      <el-col :span="9">
        <div class="terminals-form-tag">
          <el-tag
            v-for="(tag, index) in dynamicTags"
            :key="tag.name"
            closable
            filterable
            @close="handleClose(index)">
            {{tag.name}}
          </el-tag>
        </div>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitTerminals">保 存</el-button>
      <el-button @click="click_cancel">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {mapState, mapMutations, mapActions} from 'vuex'
import { Terminaltemp } from '../../static/js/terminaltemp.js'

export default {
  props: {
    item: {
      type: Object
    },

    show: {
      type: Boolean
    },

    array: {
      type: Array
    }
  },

  data () {
    return {
      showForm: this.show,
      currItem: this.item,
      options: [],
      dynamicTags: [],
      deviceArray: this.array,
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      treeData: [],
      checkAll: false,
      isIndeterminate: false,
      listAllData: [],
      listData: [],
      checkedListData: [],
      treeCheckedId: -1
    }
  },

  computed: {
    ...mapState({
      loading: state => state.terminaltemp.loading
    })
  },

  mounted () {
    this.getTrees()
    this.getTreesItem()
  },

  methods: {
    ...mapMutations([
      'LOADING_STATUS'
    ]),

    ...mapActions([
      'loadingStatus'
    ]),

    getTrees () {
      this.loadingStatus(true)
      Terminaltemp.getTerminalsTrees().then(res => {
        this.loadingStatus(false)
        if (res.data.success) {
          const data = res.data.message
          this.treeData.splice(0, 0, data)
        } else {
          this.$alert(res.data.message, '错误', {
            confirmButtonText: '知道了'
          })
        }
      }).catch(() => {
        this.loadingStatus(false)
        this.$alert('出错啦，请重试！', '错误', {
          confirmButtonText: '知道了'
        })
      })
    },

    getTreesItem () {
      this.loadingStatus(true)
      Terminaltemp.getTerminalsItem().then(res => {
        this.loadingStatus(false)
        if (res.data.success) {
          const data = res.data.message
          this.listAllData = data
          this.initData()
        } else {
          this.$alert(res.data.message, '错误', {
            confirmButtonText: '知道了'
          })
        }
      }).catch(() => {
        this.loadingStatus(false)
        this.$alert('出错啦，请重试！', '错误', {
          confirmButtonText: '知道了'
        })
      })
    },

    initData () {
      if (this.currItem.device) {
        const device = JSON.parse(this.currItem.device)
        this.dynamicTags = device.data
      }
      for (let i = 0; i < this.listAllData.length; i++) {
        this.listAllData[i].checked = false
        this.listAllData[i].disabled = false
        for (let k = 0; k < this.dynamicTags.length; k++) {
          if (this.listAllData[i].id == this.dynamicTags[k].id) {
            this.listAllData[i].checked = true
            break
          }
        }
        for (let j = 0; j < this.deviceArray.length; j++) {
          if (this.listAllData[i].id == this.deviceArray[j].id && this.currItem.id != this.deviceArray[j].model_Id) {
            this.listAllData[i].disabled = true
            break
          }
        }
      }
      this.getListData()
    },

    treeNodeClick (o, n, s) {
      if (o.children.length == 0) {
        this.treeCheckedId = o.id
        this.getListData()
      }
    },

    treeNodeExpand (o, n, s) {
      this.treeCheckedId = o.id
      this.getListData()
    },

    treeNodeCollapse (o, n, s) {
      this.treeCheckedId = -1
      this.getListData()
    },

    getListData () {
      this.listData = []
      this.checkedListData = []
      const data = JSON.parse(JSON.stringify(this.listAllData))
      if (this.treeCheckedId == -1) {
        this.listData = data
        for (let i = 0; i < data.length; i++) {
          if (data[i].checked) {
            this.checkedListData.splice(i, 0, data[i])
          }
        }
        this.getCheckedState()
        return
      }
      for (let i = 0; i < data.length; i++) {
        if (this.treeCheckedId == data[i].tree_id) {
          this.listData.splice(i, 0, data[i])
          if (data[i].checked) {
            this.checkedListData.splice(i, 0, data[i])
          }
        }
      }
      this.getCheckedState()
    },

    getTreesList (v, d) {
      const data = JSON.parse(JSON.stringify(v))
      const item = JSON.parse(JSON.stringify(d))
      const list = data.children
      for (let i = 0; i < list.length; i++) {
        let currList = list[i]
        for (let i = 0; i < item.length; i++) {
          if (currList.id == item[i].tree_id) {
            item[i].disabled = false
            for (let j = 0; j < this.deviceArray.length; j++) {
              if (item[i].id == this.deviceArray[j].id && this.currItem.id != this.deviceArray[j].model_Id) {
                item[i].disabled = true
                break
              }
            }
            currList.children.splice(i, 0, item[i])
          }
        }
        this.options.splice(i, 0, currList)
      }
    },

    submitTerminals () {
      const data = {
        model: [],
        data: this.dynamicTags
      }
      const terminals = {
        id: this.currItem.id,
        device: JSON.stringify(data)
      }
      this.loadingStatus(true)
      Terminaltemp.commitTerminals(terminals).then(res => {
        this.loadingStatus(false)
        if (res.data.success) {
          this.$message({
            message: '保存成功！',
            type: 'success'
          })
          this.showForm = false
          this.$emit('commitTerminalsForm')
        } else {
          this.$alert(res.data.message, '错误', {
            confirmButtonText: '知道了'
          })
        }
      }).catch(() => {
        this.loadingStatus(false)
        this.$alert('出错啦，请重试！', '错误', {
          confirmButtonText: '知道了'
        })
      })
    },

    click_cancel () {
      this.$confirm("尚未保存，确定要取消吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.showForm = false
        this.$emit('hideTerminalsForm')
      }).catch(() => {})
    },

    handleClose (v) {
      const id = this.dynamicTags[v].id
      for (let i = 0; i < this.checkedListData.length; i++) {
        if (id == this.checkedListData[i].id) {
          this.checkedListData.splice(i, 1)
          break
        }
      }
      this.getAllCheckedState(id)
      this.getCheckedState()
      this.dynamicTags.splice(v, 1)
    },

    clearChecked () {
      this.checkAll = false
      this._handleCheckAllChange(this.checkAll, -1)
      this.dynamicTags = []
    },

    getCheckedData () {
      const nodes = JSON.parse(JSON.stringify(this.listAllData))
      let newData = []
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        if (node.checked) {
          const data = {
            id: node.id,
            name: node.name,
            online_status: node.online_status,
            tree_id: node.tree_id
          }
          newData.push(data)
        }
      }
      this.dynamicTags = newData
    },

    handleCheckAllChange (val) {
      this._handleCheckAllChange(val)
    },

    _handleCheckAllChange (val, str) {
      this.checkedListData = []
      if (val) {
        let data = this.listData
        let checkData = []
        for (let i = 0; i < data.length; i++) {
          if (!data[i].disabled) {
            checkData.push(data[i])
          }
        }
        this.checkedListData = checkData
      }
      this.getAllCheckedState(str)
      this.getCheckedData()
      this.isIndeterminate = false
    },

    handleCheckedChange (val) {
      this.getAllCheckedState()
      this.getCheckedData()
      this.getCheckedState()
    },

    getCheckedState () {
      this.checkAll = this.listData.length > 0 && this.checkedListData.length === this.listData.length
      this.isIndeterminate = this.checkedListData.length > 0 && this.checkedListData.length < this.listData.length
    },

    getAllCheckedState (v) {
      if (v) {
        if (v == -1) {
          for (let i = 0; i < this.listAllData.length; i++) {
            this.listAllData[i].checked = false
          }
        } else {
          for (let i = 0; i < this.listAllData.length; i++) {
            if (this.listAllData[i].id == v) {
              this.listAllData[i].checked = false
              break
            }
          }
        }
        return
      }
      for (let i = 0; i < this.listAllData.length; i++) {
        for (let j = 0; j < this.listData.length; j++) {
          if (this.listAllData[i].id == this.listData[j].id) {
            this.listAllData[i].checked = false
            break
          }
        }
        for (let k = 0; k < this.checkedListData.length; k++) {
          if (this.listAllData[i].id == this.checkedListData[k].id) {
            this.listAllData[i].checked = true
            break
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">
  .terminals-form {
    .el-cascader-menu {
      width: 188px;
    }
    .el-cascader-menu__wrap {
      height: 374px;
    }
    .el-tag .el-icon-close {
      float: right;
      top: 6px;
      right: 0px;
    }
  }
</style>
<style lang="scss" scoped>
  .terminals-form-header {
    position: relative;
    padding: 15px;
    background-color: #F5F7FA;
    border: 1px solid #E4E7ED;
    .el-button {
      position: absolute;
      top: 8px;
      right: 15px;
    }
  }
  .el-cascader-panel.is-bordered {
    border-radius: 0;
  }
  .terminals-form-tag {
    height: 354px;
    border: 1px solid #E4E7ED;
    padding: 10px;
    overflow-y: auto;
    .el-tag, .el-checkbox {
      display: block;
    }
    .el-tag + .el-tag {
      margin-top: 10px;
    }
  }
  .terminals-form-tag::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  .terminals-form-tag::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background: #EAE9EA;
  }
  .terminals-form-tag::-webkit-scrollbar-track {
    border-radius: 2px;
    background: transparent;
  }
</style>
