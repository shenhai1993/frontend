<template>
  <div class="choiceTerminal">
    <div>
      <h2 class="m-b-15">终端列表</h2>
      <el-tree :data="terminalList && terminalList.data" :props="defaultProps"
               @check-change="handleNodeClick"
               :highlight-current='true'
               :default-expand-all='true'
               show-checkbox
               ref="tree"
               :expand-on-click-node="false">
      </el-tree>
    </div>
    <div>
      <!-- <h2 class="m-b-15">终端列表</h2> -->
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import TerminalGroup from '@/modules/terminal/static/js/TerminalGroup.js'

export default {
  props: ['activeSteps'],
  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      terminalList: null
    }
  },
  computed: {
    ...mapState({
      'terminalGroups': state => state.terminal.terminalGroups,
      'playlistselectedTerminal': state => state.mpdp.playlistselectedTerminal,
      'editItem': state => state.mpdp.editItem
    })
  },
  async mounted () {
    this.terminalList = await TerminalGroup.getTerminals()

    // 获取终端分组
    // this.getTerminalGroups()
  },
  methods: {
    ...mapActions([
      'getTerminalGroups'
    ]),
    ...mapMutations([
      'PUT_PLAYLIST_TERMINAL_MPDP'
    ]),
    handleNodeClick (editData) {
      let nodes = this.$refs.tree.getCheckedNodes()
      let data = []
      nodes.forEach(element => {
        data.push(element.id)
      })
      console.log(data)
      this.$emit('update:canNext', data.length > 0)
      this.PUT_PLAYLIST_TERMINAL_MPDP(data)
    }
  }
}
</script>

<style lang="scss" scoped>
  .choiceTerminal {
    display: table;
    width: 100%;
    > div {
      display: table-cell;
      width: 50%;
    }
  }
</style>
