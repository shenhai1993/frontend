<template>
  <header>
    <slot name='submenuName'></slot>
  </header>
</template>

<script>
import { mapState, mapActions } from 'vuex'
// import TerminalGroup from '../static/js/TerminalGroup.js'

export default {
  // props: ['fromExhibitionOnline', 'fromExhibitionNotonline', 'fromExhibitionAll'],
  // watch: {
  //   async fromExhibitionOnline (newV, oldV) {
  //     await this.getTerminalGroups()
  //     this._getTerminalList('在线')
  //   },
  //   async fromExhibitionNotonline (newV, oldV) {
  //     await this.getTerminalGroups()
  //     this._getTerminalList('离线')
  //   },
  //   async fromExhibitionAll (newV, oldV) {
  //     await this.getTerminalGroups()
  //     this._getTerminalList('全部')
  //   },
  //   filterText (val) {
  //     this.$refs.terminalGroupsTree.filter(val)
  //   }
  // },
  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      searchGroup: '',
      searchStatus: '全部',
      statusList: [
        { label: '全部' },
        { label: '离线' },
        // { label: '待机' },
        { label: '在线' }
        // { label: '正在下载' },
        // { label: '下载完成' }
      ],
      selectFilterItem: '',
      filterText: '',
      treeviewVisible: false,
      fastSearch: '',
      activeTerminalGroup: null
    }
  },
  computed: {
    ...mapState({
      terminalGroups: state => state.terminal.terminalGroups
    })
  },
  mounted () {
    // this.getTerminalGroups()
  },
  methods: {
    ...mapActions([
      'getTerminalGroups'
    ]),
    _getTerminalList (selectStatus) {
      if (this.terminalGroups.length) {
        let groups = {}
        groups.data = this.terminalGroups[0]
        this.handleNodeClick(this.terminalGroups, groups)
        this.selectStatus(selectStatus)
        this.searchStatus = selectStatus
      }
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    selectStatus (val) {
      this.$emit('terminalSearch', val)
    },
    selectFilter (val) {
      this.$emit('selectFilterItem', val)
    },
    handleNodeClick (data, node) {
      this.activeTerminalGroup = node.data
      this.$emit('terminalSearch', node.data)

      if (this.searchStatus !== '全部') {
        this.selectStatus('全部')
        this.searchStatus = '全部'
      }
      this.treeviewVisible = false
    },
    click_fastSearch () {
      this.$emit('fastSearch', this.fastSearch)
    },
    click_empty () {
      this.fastSearch = ''
      this.$emit('fastSearch', '')
    },
    click_refresh () {
      if (this.searchStatus !== '全部') {
        this.selectStatus('全部')
        this.searchStatus = '全部'
      }

      if (this.fastSearch) {
        this.fastSearch = ''
        this.$emit('fastSearch', '')
      }
      if (this.selectFilterItem !== '') {
        this.selectFilterItem = ''
        this.selectFilter('')
      }

      if (this.searchStatus === '全部' || !this.fastSearch) {
        this.$emit('refresh', true)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  header {
    height: 55px;
    background-color: #FFF;
    line-height: 56px;
    font-size: 14px;
    margin-left: -15px;
    padding-left: 15px;
    box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.1), 0px 0px 2px rgba(0, 0, 0, 0.1);
    .el-form {
      height: 56px;
      .el-form-item {
        margin-bottom: 0;
        height: 56px;
        > div[class^='el-form-item'] {
          height: 56px;
        }
      }
    }
    .filter {
      vertical-align: sub;
      height: 56px;
      line-height: 56px;
      float: right;
      .el-select {
        width: 120px;
      }
      > div {
        float: left;
      }
      > div + div {
        margin-left: 15px;
      }
    }
  }

  a {
    color: #333;
  }
  .submenuName {
    vertical-align: -webkit-baseline-middle;
  }
  .el-tree {
    max-height: 500px;
    overflow-y: auto;
  }
</style>
