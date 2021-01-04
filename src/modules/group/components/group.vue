<!--
  props:  filter(是否显示搜索)
          edit（是否可以编辑节点）
          showCheckbox(是否显示checkbox)
          disabled (checkbox是否可选)
  $emit： @oncheck（点击checkbox时触发）
          @onclick（点击树节点时触发）
 -->

<template>
  <div v-loading="loading" class="p-10 treeMenu" style="font-size: 14px;">
    <slot :filterText="filterText" name="actions">
      <el-input v-if="filter" class="p-b-10" placeholder="输入关键字进行过滤" v-model="filterText" clearable />
    </slot>

    <!-- 携带增删改查 -->
    <el-tree :data="treeData"
             :props="defaultProps"
             :filter-node-method="filterNode"
             :expand-on-click-node="false"
             :default-expand-all="true"
             ref="tree"
             node-key="id"
             :draggable="draggable"
             @node-drop="onNodeDrop"
             @allow-drag="onAllowDrag"
             @allow-drop="onAllowDrop"
             highlight-current
             empty-text='暂无数据'
             @node-click="handleNodeClick"
             :default-checked-keys="defaultGroup"
             :show-checkbox="showCheckbox"
             @check="handleNodeCheck"
             :check-strictly="strictly"
    >
      <div class="custom-tree-node" slot-scope="{ node, data }">
        <span><i class="fa fa-folder " aria-hidden="true"></i>  {{ node.label }}</span>
        <span v-if="edit" class="group_btns">
          <div>
          <el-popover
            placement="top-start"
            width="80"
            trigger="hover">
            <el-tooltip class="item opt-margin" effect="dark" content="新增分组" placement="bottom">
              <span class="el-icon-circle-plus-outline blueHover" @click="() => append(node, data, 0)"></span>
            </el-tooltip>
            <el-tooltip class="item opt-margin" effect="dark" content="修改分组" placement="bottom">
              <span class="el-icon-edit blueHover" @click="() => append(node, data, 1)"></span>
            </el-tooltip>
            <el-tooltip v-if="node.level !== 1" class="item opt-margin" effect="dark" content="删除分组" placement="bottom">
              <span class="el-icon-delete redHover" @click="() => remove(node, data, 2)"></span>
            </el-tooltip>
            <el-tooltip class="item opt-margin" effect="dark" content="属性" placement="bottom">
              <i class="fa fa-cog greenHover" @click="() => terminal_set_props(node, data)"></i>
            </el-tooltip>
            <i class="el-icon-more greenHover groups-more" slot="reference"></i>
          </el-popover>
          </div>
        </span>
        <span v-if="strictly && cascader" class="cascader">
          <el-tooltip effect="dark" placement="right" content="级联选择">
            <span class="el-icon-circle-check-outline" @click="() => handleCascader(node, data)"></span>
          </el-tooltip>
        </span>
      </div>
    </el-tree>

    <!-- 终端属性设置的对话框模块 -->
    <terminal-porps :isterminalPropsVisible.sync='isterminalPropsVisible' :id='currentTreeId' type="tree"></terminal-porps>

    <!-- 添加分组的对话框 -->
    <el-dialog @close="cancel" :title="dialogTitle" :visible.sync="treeDialogVisible" width="30%">
      <!-- 表单 -->
      <el-form :model="treeForm" ref="treeForm" :rules="rules">
        <el-form-item label="分组名称" label-width="120px" prop='name'>
          <el-input v-model="treeForm.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import api from '../static/api'
  import terminalPorps from '../../terminal/pages/terminal/props.vue'

  export default {
    name: 'grouppanel',
    props: {
      filter: Boolean,
      edit: Boolean,
      showCheckbox: {
        type: Boolean,
        default: false
      },
      gtype: {
        type: String,
        default: 'groups' // groups | trees
      },
      draggable: {
        type: Boolean,
        default: false
      },
      groupId: {
        type: Number
      },
      defaultChecked: {
        type: Array
      },
      strictly: {
        type: Boolean,
        default: false
      },
      cascader: {
        type: Boolean,
        default: false
      },
      filterTextFromFather: {
        type: String
      },
      disabled: {
        type: Boolean,
        default: false
      },
      autoclick: {
        type: Boolean,
        default: true
      },
    },

    data () {
      return {
        isterminalPropsVisible: false,
        currentTreeId: null,
        dialogTitle: '',
        filterText: '',
        loading: false,
        type: -1,
        treeData: [],
        defaultGroup: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        treeDialogVisible: false,
        treeForm: {
          name: ''
        },
        currentTreeNode: null,
        rules: {
          name: [
            {required: true, message: '名称不能为空'},
            {max: 12, message: '名称不能超过12个字符'},
          ]
        }
      }
    },

    components: {
      terminalPorps
    },

    computed: {
      filterValue () {
        if (this.filterTextFromFather) {
          return this.filterTextFromFather
        }
        return this.filterText
      }
    },

    mounted () {
      this.loading = true
      api.getGroupTree(this.gtype).then(res => {
        this.treeData = [res.data.message]
        if (this.gtype === 'groups') {
          window.localStorage.setItem('treeList', JSON.stringify(this.treeData))
        }
        if (!this.showCheckbox) {
          this.defaultGroup.push(this.treeData[0].id)
        } else if (this.defaultChecked) {
          this.defaultGroup = this.defaultChecked.concat()
        }
        if (this.disabled) {
          this.handleDisabled(this.treeData[0])
        }
        setTimeout(() => {
          this.loading = false
        }, 500)
        if (this.autoclick) {
            this.handleNodeClick(this.treeData[0])
        }
      })
        .catch(e => console.log(e.message))
    },

    watch: {
      filterValue (val) {
        this.$refs.tree.filter(val)
      },

      groupId (v, o) {
        this.getTreeData(v)
      },

      /* defaultChecked(v, o) {
        log(this.defaultChecked)
        if (this.defaultChecked) {
        }
        this.$refs.tree.setCheckedKeys(this.defaultChecked);
      } */
    },

    methods: {
      // 直接设置树的选中项
      setChecked (checked) {
        this.$refs.tree.setCheckedKeys(checked);
      },

      filterNode (value, data) {
        if (!value) return true
        return data.name.indexOf(value) !== -1
      },

      getTreeData (groupId) {
        api.getGroupTree(this.gtype, groupId).then(res => {
          this.treeData = [res.data.message]
          if (this.disabled) {
            this.handleDisabled(this.treeData[0])
          }
          this.$emit('updateTreeNode', this.treeData[0])
        })
      },

      handleDisabled (data) {
        if (data.children.length !== 0) {
          data.children.forEach(child => {
            this.handleDisabled(child)
          })
        }
        data.disabled = true
      },

      handleNodeCheck (data, checked) {
        this.$emit('oncheck', {data, checked})
      },

      handleNodeClick (node) {
        this.$emit('onclick', node)
      },

      // 增删方法
      append (node, data, type) {
        this.type = type
        this.treeDialogVisible = true
        this.currentTreeNode = data
        if (this.type === 0) {
          this.dialogTitle = '添加分组'
          this.treeForm.name = ''
        } else if (this.type === 1) {
          this.dialogTitle = '编辑分组'
          this.treeForm.name = data.name
        }
      },

      remove (node, data) {
        this.$confirm('确定要删除该分组', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.removeGroup(data.id, this.gtype).then(res => {
            const parent = node.parent
            const children = parent.data.children || parent.data
            const index = children.findIndex(d => d.id === data.id)
            children.splice(index, 1)
          })
        })
      },
      // 修改分组的终端属性
      terminal_set_props (node, data) {
        this.currentTreeNode = data
        this.currentTreeId = data.id
        this.isterminalPropsVisible = true
      },
      // 级联选择
      handleCascader (node, data) {
        let me = this
        let tmp = []
        let checkedNodes = _setNodes()
        tmp = []
        let checkedKeys = _setKeys()

        this.$refs.tree.setCheckedKeys(checkedKeys)
        let checked = {
          checkedNodes: checkedNodes,
          checkedKeys: checkedKeys
        }
        this.$emit('oncheck', {node, checked})
        // 选中节点nodes
        function _setNodes () {
          let checkedNodesNew = _getChildren(data, 'node')
          let checkedNodesOld = me.$refs.tree.getCheckedNodes()
          let checkedNodes = _setChecked(node.checked, checkedNodesOld, checkedNodesNew, 'node')
          return checkedNodes
        }
        // 选中节点keys
        function _setKeys () {
          let checkedKeysNew = _getChildren(data, 'key')
          let checkedKeysOld = me.$refs.tree.getCheckedKeys()
          let checkedKeys = _setChecked(node.checked, checkedKeysOld, checkedKeysNew, 'key')
          return checkedKeys
        }
        // 获取点击node下的所有子节点
        function _getChildren (node, type) {
          if (node.children.length !== 0) {
            node.children.forEach(child => {

              if (child.children.length !== 0) {
                _getChildren(child, type)
              } else {
                type === 'key' ? tmp.push(child.id) : tmp.push(child)
              }
            })
          }
          type === 'key' ? tmp.push(node.id) : tmp.push(node)
          return tmp
        }
        // 构造选中节点
        function _setChecked (checked, oldCheck, newCheck, type) {
          if (checked) {
            if (type === 'key') {
              return oldCheck.filter(node => {
                return !newCheck.some(child => {
                  if (child === node) {
                    return true
                  }
                })
              })
            } else {
              return oldCheck.filter(node => {
                return !newCheck.some(child => {
                  if (child.id === node.id) {
                    return true
                  }
                })
              })
            }
          } else {
            return oldCheck.concat(newCheck)
          }
        }
      },

      save () {
        let me = this
        this.$refs['treeForm'].validate((valid) => {
          if (valid) {
            if (this.type === 0) {
              _add()
            } else if (this.type === 1) {
              _edit()
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
        // 新建
        function _add () {
          me.treeForm.parent_id = me.currentTreeNode.id
          if (me.gtype === 'trees') {
            me.treeForm.parent_level = me.currentTreeNode.level
          }
          api.addGroup(me.treeForm, me.gtype)
            .then(res => {
              if (!me.currentTreeNode.children) {
                me.$set(me.currentTreeNode, 'children', [])
              }
              me.currentTreeNode.children.push(res.data.message)
              me.$notify.success({
                title: '成功',
                message: '新建成功'
              })
              me.cancel()
            })
        }
        // 编辑
        function _edit () {
          api.editGroup(me.currentTreeNode.id, me.treeForm, me.gtype)
            .then(res => {
              if (!me.currentTreeNode.children) {
                me.$set(me.currentTreeNode, 'children', [])
              }
              me.currentTreeNode.name= res.data.message.name
              me.$notify.success({
                title: '成功',
                message: '修改成功'
              })
              me.cancel()
            })
        }
      },

      cancel () {
        this.treeDialogVisible = false
        this.$refs.treeForm.resetFields()
      },

      onNodeDrop (node, rnode, pos, e) {
        console.log(node, rnode, pos)
        if (node.parent === null) return false
      },

      onAllowDrag (node) {
        if (node.parent === null) return false
      },

      onAllowDrop (dragnode, dropnode, type) {
        if (dropnode.parent === null && type === 'before') return false
      }
    }
  }
</script>

<style lang="scss">
  .treeMenu {
    height: 100%;
    .el-tree {
      // height: calc(100% - 46px);
      overflow-y: auto;
    }
    .el-tree-node {
      > div {
        > span:nth-child(2) {
          display: inline-block;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding-right: 50px;
        }
      }
    }

    // 添加增加删除的css
    .custom-tree-node {
      width: calc(100% - 24px);
      line-height: 1;
      position: relative;
      &:hover {
        > span:nth-child(2) {
          display: inline-block;
        }
      }
      > span:first-child {
        display: inline-block;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-right: 30px;
      }
      .group_btns {
        position: absolute;
        right: 0;
        display: none;
        span {
          font-size: 14px;
          margin-left: 5px;
        }
      }
      .el-icon-circle-plus-outline, .el-icon-edit, .el-icon-delete {
        background-color: #f0f7ff;
      }
      .cascader {
        position: absolute;
        right: 0;
      }
    }
  }
  .opt-margin {
    margin-right: 12px !important;
    display: inline-block;
    cursor: pointer;
  }
  .groups-more {
    padding-right: 6px;
  }
  .treeMenu {
    .custom-tree-node .fa-folder {
      color: #3f94ef;
    }
    .custom-tree-node{
      padding-top: 4px;
    }
  }
</style>
