<template>
  <div class="p-10 treeMenu">
    <el-input class="p-b-10"
              placeholder="输入关键字进行过滤"
              v-model="filterText">
    </el-input>
    <!-- 普通的tree节点显示 -->
    <el-tree :data="treeData"
             :props="defaultProps"
             @node-click="handleNodeClick"
             :filter-node-method="filterNode"
             ref="tree"
             node-key="id"
             highlight-current
             :expand-on-click-node="false"
             :default-expand-all="true"></el-tree>
  </div>
</template>

<script>
import api from '../static/js/api.js'

export default {
  data () {
    return {
      filterText: '',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },

  mounted () {
    api.getGroupTree()
      .then(res => {
        this.treeData = [res.data.message]
        let currentId = Number(this.$route.path.split('/')[3])
        if (!currentId) {
          this.handleNodeClick(this.treeData[0])
        } else {
          this.$nextTick(() => {
            this.$refs.tree.setCurrentKey(currentId)
          })
        }
      })
  },

  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },

  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    handleNodeClick (data) {
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey(data.id)
      })
      this.$router.push({query: {groupId: data.id}})
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
