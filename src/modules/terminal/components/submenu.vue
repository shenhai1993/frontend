<template>
  <div>
    <group-panel v-on:onclick="group_onclick" v-bind:edit="true" v-bind:filter="false"></group-panel>
  </div>
</template>

<script>
import GroupPanel from '../../groupc/components/group'
import api from '../static/js/api'
import { tip } from '../../../assets/js/encapsulate'

export default {
  components: {
    GroupPanel
  },

  data () {
    return {
      filterText: '',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      treeDialogVisible: false,
      treeForm: {},
      currentTreeNode: null,
      rules: {
        name: [
          {required: true, message: '名称不能为空'}
        ]
      }
    }
  },

  mounted () {
    // api.getGroupTree()
    //   .then(res => {
    //     this.treeData = [res.data.message]
    //     let currentId = Number(this.$route.path.split('/')[3])
    //     if (!currentId) {
    //       this.handleNodeClick(this.treeData[0])
    //     } else {
    //       this.$nextTick(() => {
    //         // this.$refs.tree.setCurrentKey(currentId)
    //       })
    //     }
    //   })
  },

  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },

  methods: {
    group_onclick (node) {
      this.$router.push({path: `/group/terminals/${node.id}`})
    },

    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    handleNodeClick (data) {
      this.$nextTick(() => {
        // this.$refs.tree.setCurrentKey(data.id)
      })
      this.$router.push({path: `/group/terminals/${data.id}`})
    },
    // 增删方法
    append (node, data) {
      this.treeDialogVisible = true
      this.treeForm.parent_id = data.id
      this.currentTreeNode = data
    },

    remove (node, data) {
      let tips = '是否永久删除此条数据，删除后不可恢复。'
      tip('delete', `groups/${data.id}`, '', tips, (success) => {
        const parent = node.parent
        const children = parent.data.children || parent.data
        const index = children.findIndex(d => d.id === data.id)
        children.splice(index, 1)
      })
    },
    save () {
      this.$refs['treeForm'].validate((valid) => {
        if (valid) {
          api.addGroup(this.treeForm)
            .then(res => {
              if (!this.currentTreeNode.children) {
                this.$set(this.currentTreeNode, 'children', [])
              }
              this.currentTreeNode.children.push(res.data.message)
              this.cancel()
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancel () {
      this.treeDialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .treeMenu {
    height: 100%;
    .el-tree {
      height: calc(100% - 60px);
      overflow-y: auto;
    }
  }

  .el-tree-node {
    > div {
      > span:nth-child(2) {
        display: inline-block;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
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
    }
    > span:nth-child(2) {
      position: absolute;
      right: 0;
      display: none;
      > span {
        font-size: 14px;
        margin-left: 5px;
        background-color: white;
      }
    }
  }

</style>
