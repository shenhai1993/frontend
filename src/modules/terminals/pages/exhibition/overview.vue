<template>
  <ul>
    <li>
      <span>终端概览</span>
    </li>
    <li>
      <router-link :to="{ path: 'list' }"
                   title='点击查看 在线终端 列表'>
        <i class="online fa fa-circle"></i> 在线终端：<span>{{ lineTerminal }} <span>台</span></span>
      </router-link>
    </li>
    <li>
      <router-link :to="{ path: 'list' }"
                   title='点击查看 离线终端 列表'>
        <i class="notonline fa fa-circle"></i> 离线终端：<span>{{ outLineTerminal }} <span>台</span></span>
      </router-link>
    </li>
    <!-- <li>
      <router-link :to="{ path: 'ungroup' }"
                   title='点击查看 未分组终端 列表'>
        <i class="ungrouped el-icon-more"></i> 未分组终端：<span>{{ ungroupedTerminalTotalNum }} <span>台</span></span>
      </router-link>
    </li> -->
    <li>
      <router-link :to="{ path: 'list' }"
                   title='点击查看 所有终端 列表'>
        终端总数：<span>{{ totalTerminal }} <span>台</span></span>
      </router-link>
    </li>
  </ul>
</template>

<script>
  import { mapState, mapMutations } from 'vuex'
  import TerminalGroup from '../../static/js/TerminalGroup.js'

  export default {
    data () {
      return {
        lineTerminal: 0,
        outLineTerminal: 0,
        totalTerminal: 0
      }
    },
    computed: {
      ...mapState({
        ungroupedTerminalTotalNum: state => state.terminal.ungroupedTerminalTotalNum
      })
    },
    async mounted () {
      let self = this
      // 改接口后
      let num = 0
      let total = 0
      let terminalList = await TerminalGroup.getTerminals()
      terminalList.data.forEach(ele => {
        total++
        if (String(ele.online_status) === '0') {
          num++
        }
      })
      self.outLineTerminal = num
      self.lineTerminal = total - num
      self.totalTerminal = total
      // 改接口之前
      // let resUngroup = await TerminalGroup.getUngroupTerminals(1, null, '', '', '')
      // self.getUngroupTerminalNum(resUngroup.data.total)

      // let outLineTerminal = await TerminalGroup.getUngroupTerminals(1, 1, '&online_status=0', '', '')
      // self.outLineTerminal = outLineTerminal.data.total

      // let lineTerminal = await TerminalGroup.getUngroupTerminals(1, 1, '&online_status=1', '', '')
      // self.lineTerminal = lineTerminal.data.total

      // self.totalTerminal = self.lineTerminal + self.outLineTerminal + resUngroup.data.total
      // if (isNaN(self.totalTerminal) === true) {
      //   self.totalTerminal = ''
      // }
    },
    methods: {
      ...mapMutations({
        'getUngroupTerminalNum': 'GET_UNGROUP_TERMINAL_TOTAL_NUM'
      })
    }
  }
</script>

<style lang="scss" scoped>
ul {
  > li {
    a {
      font-size: 14px;
      padding: 9px 20px;
      display: inline-block;
      width: 100%;
      &:hover {
        color: #409EFF;
      }
      > span {
        float: right;
      }
    }
    &:first-child {
      > span {
        padding: 18px 20px;
        display: inline-block;
        font-size: 16px;
        width: 100%;
        // border-bottom: 1px solid #e6ebf5;
        color: #2d2f33;
      }
    }
    &:last-child {
      > a {
        font-size: 16px;
      }
    }
  }
}
a,
a:focus,
a:active,
a:visited {
  color: #2d2f33;
}
.online {
  color: #67C23A;
}
.notonline {
  color: #FA5555;
}
.ungrouped {
  color: #EB9E05;
}
</style>



