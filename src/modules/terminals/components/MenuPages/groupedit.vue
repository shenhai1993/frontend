<template>
  <div class="groupEdit">
    <div>
      <el-tree :data="terminalGroups" :props="defaultProps" 
               @node-click="handleNodeClick"
               :highlight-current='true'
               :default-expand-all='true'
               :expand-on-click-node="false"></el-tree>
    </div>
    <div class="p-15">
      <el-row class='m-t-20'>
        <el-col :span="12">
          <el-form>
            <el-form-item>
              <el-input v-model="groupName" placeholder="请输入分组名称"></el-input>
              <div class="m-t-30">
                <el-button type="default" plain @click='create' :disabled="!selectedGroup">新增</el-button>
                <el-button type="primary" plain :disabled="!selectedGroup" @click='redact'>编辑</el-button>
                <el-button type="danger" plain :disabled="!selectedGroup" @click='remove'>删除</el-button>
              </div>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
// import { mapState, mapActions } from 'vuex'
// import TerminalGroupManager from '../../../../models/TerminalGroupManager.js'

// export default {
//   data () {
//     return {
//       defaultProps: {
//         children: 'children',
//         label: 'name'
//       },
//       groupName: '',
//       selectedGroup: null,
//       selectedGroupParent: []
//     }
//   },
//   computed: mapState([
//     'terminalGroups'
//   ]),
//   mounted () {
//     this.getTerminalGroups()
//   },
//   methods: {
//     ...mapActions([
//       'getTerminalGroups'
//     ]),
//     handleNodeClick (data, node) {
//       this.groupName = data.name
//       this.selectedGroup = data
//       this.selectedGroupParent = node.parent.data.children
//     },
//     async create () {
//       let data = {
//         'parentid': this.selectedGroup.id,
//         'name': this.groupName
//       }
//       let res = await TerminalGroupManager.create(data)
//       if (res.status === 200) {
//         this.selectedGroup.children.push(res.data)
//         this._empty()
//       }
//     },
//     async redact () {
//       let res = await TerminalGroupManager.redact(this.selectedGroup.id, {'name': this.groupName})
//       if (res.status === 200) {
//         this.selectedGroup.name = this.groupName
//         this._empty()
//       }
//     },
//     remove () {
//       let self = this
//       self.$reused._delete(self, `/web/groups/${self.selectedGroup.id}?delall=true`, function () {
//         self.$reused._remove(self.selectedGroup, self.selectedGroupParent)
//         self._empty()
//       })
//     },
//     _empty () {
//       this.groupName = ''
//       this.selectedGroup = null
//     }
//   }
// }
</script>

<style lang="sass" scoped>
  .groupEdit
    font-size: 14px;
    > div
      &:first-child
        float: left;
        width: 300px;
        .el-tree
          border-width: 0;
          box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1), 0px 0px 5px rgba(0, 0, 0, 0.1);
          overflow: hidden;
      &:nth-child(2)
        margin-left: 300px;
        .groupLabel
          line-height: 36px;

</style>

