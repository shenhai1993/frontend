<template>
  <div class="group">
    <headerbar class="headerbar">
      <span slot='submenuName'>分组管理</span>
    </headerbar>

    <div class="groupEdit p-20">
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
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import TerminalGroup from '@/modules/terminal/static/js/TerminalGroup.js'
import headerbar from '../../../../components/HeaderBar.vue'

export default {
  components: {
    headerbar
  },
  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      groupName: ''
    }
  },
  computed: {
    ...mapState({
      terminalGroups: state => state.terminal.terminalGroups,
      selectedGroup: state => state.terminal.selectedGroup,
      selectedGroupParent: state => state.terminal.selectedGroupParent
    })
  },
  mounted () {
    this.getTerminalGroups()
  },
  methods: {
    ...mapActions([
      'getTerminalGroups'
    ]),
    ...mapMutations({
      getSelectedGroup: 'GET_SELECTED_TERMINAL_GROUP',
      addTerminalGroup: 'ADD_TERMINAL_GROUP',
      redactTerminalGroup: 'REDACT_TERMINAL_GROUP',
      getTerminalGroupParent: 'GET_TERMINAL_GROUP_PARENT',
      reomveTerminalGroup: 'REMOVE_TERMINAL_GROUP'
    }),
    handleNodeClick (data, node) {
      this.groupName = data.name
      this.getSelectedGroup(data)
      this.getTerminalGroupParent(node.parent.data.children)
    },
    async create () {
      let data = {
        'parentid': this.selectedGroup.id,
        'name': this.groupName
      }
      let res = await TerminalGroup.create(data)
      if (res.status === 200) {
        this.addTerminalGroup(res.data)
        this._empty()
      }
    },
    async redact () {
      let res = await TerminalGroup.redact(this.selectedGroup.id, {'name': this.groupName})
      if (res.status === 200) {
        this.redactTerminalGroup(this.groupName)
        this._empty()
      }
    },
    remove () {
      let self = this
      self.$reused._delete(self, `/web/groups/${self.selectedGroup.id}?delall=true`, function () {
        self.reomveTerminalGroup()
        self._empty()
      })
    },
    _empty () {
      this.groupName = ''
      this.getSelectedGroup(null)
    }
  }
}
</script>

<style lang="sass" scoped>
  .headerbar
    margin-top: 0;
    margin-left: 0;

  .groupEdit
    font-size: 14px;
    background-color: #fff;
    margin: 15px;
    height: calc(100% - 15px);
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1), 0px 0px 5px rgba(0, 0, 0, 0.1);
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
  .group
    height: calc(100% - 70px);
</style>

