<template>
  <div class="group-tree-content">
    <el-row>
        <el-col :span="12">
          <div class="tree-wrapper">
            <group filter gtype="groups" @onclick="selectedGroup"></group>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="tree-wrapper">
            <group filter gtype="trees" :groupId="selectedGroupId" @updateTreeNode="updateTreeNode" @onclick="selectedTree"></group>
          </div>
        </el-col>
      </el-row>
  </div>
</template>

<script>
import Group from '@/modules/group/components/group'

export default {
  components: {
    Group
  },
  data () {
    return {
      selectedGroupId: 0,
      selectedTreeId: 0
    }
  },

  methods: {
    selectedGroup (data) {
      this.selectedGroupId = data.id
    },

    updateTreeNode (node) {
      this.selectedTreeId = node.id
    },

    selectedTree (data) {
      this.selectedTreeId = data.id
    },

    updateData () {
      let data = {}
    }
  },

  watch: {
    selectedTreeId: {
      handler (n) {
        this.$emit('updateTreeId', n)
      }
    }
  }
}
</script>

<style lang="scss">
.group-tree-content {
  height: 100%;
  .el-row {
    height: 100%;
    .el-col {
      height: 100%;
    }
  }
}
</style>
