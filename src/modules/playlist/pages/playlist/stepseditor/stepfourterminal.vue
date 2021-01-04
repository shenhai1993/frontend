<template>
  <div id="choiceTerminal">
    <el-transfer filter-placeholder="请输入终端名称"
                 v-model="searchKeys"
                 :data="terminalData"
                 :titles="titles"
                 @change="choiceChange">
    </el-transfer>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import TerminalGroup from '@/modules/terminals/static/js/TerminalGroup.js'

export default {
  props: ['activeSteps'],
  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      terminalList: null,
      searchKeys: [],
      titles: ['终端列表', '已选择终端列表'],
      groupId: 0
    }
  },
  computed: {
    ...mapState({
      'terminalGroups': state => state.terminal.terminalGroups
    }),
    terminalData () {
      let me = this
      const data = []
      if (me.terminalList && me.terminalList.length) {
        me.terminalList.forEach((terminal, index) => {
          data.push({
            label: terminal.name,
            key: index
          })
        })
        return data
      }
    }
  },
  async mounted () {
    this.groupId = JSON.parse(this.$cookies.get('authUser')).group_id

    this.terminalList = await TerminalGroup.getTerminals(this.groupId)
  },
  methods: {
    ...mapActions([
      'getTerminalGroups'
    ]),
    ...mapMutations([
      'PUT_PLAYLIST_TERMINAL'
    ]),
    choiceChange (indexArr) {
      let me = this
      let choicedTerminal = []
      indexArr.forEach(eleIndex => {
        choicedTerminal.push(me.terminalList[eleIndex])
      })
      this.$emit('update:canNext', choicedTerminal.length > 0)
      this.PUT_PLAYLIST_TERMINAL(choicedTerminal)
    }
  }
}
</script>

<style lang="scss">
  #choiceTerminal {
    width: 660px;
    margin: 60px auto;
    .el-input {
      width: 100%;
      input {
        margin-left: -30px;
        width: calc(100% - 30px);
      }
    }
  }
  .el-transfer {
    width: 540px;
    height: 420px;
    .el-transfer-panel{
      height: 100%;
      .el-transfer-panel__body{
        height: 100%;
      }
      .el-transfer-panel__list{
        height: 100%;
      }
    }
  }
  // @media screen and (max-width: 1440px) {
  //   .el-transfer {
  //     width: 540px;
  //     height: 420px;
  //     .el-transfer-panel{
  //       height: 100%;
  //     }
  //   }
  // }
  // @media screen and (min-width: 1441px) and (min-width: 1920px) {
  //   .el-transfer {
  //     width: 600px;
  //     height: 650px;
  //       .el-transfer-panel{
  //         height: 100%;
  //     }
  //   }
  // }
</style>
