<template>
  <div class="terminalList">
    <header-bar id="terminaHeader">
      <span slot="submenuName">终端列表</span>
    </header-bar>
    <terminal-list></terminal-list>
  </div>
</template>

<script>
import TerminalList from './lists'
import HeaderBar from '../../components/HeaderBar.vue'

export default {
  components: {
    TerminalList, HeaderBar
  },
  mounted () {
  },
  data () {
    return {
      showDetails: false
    }
  },
  methods: {
    isTerminalInfoShow (data) {
      this.showDetails = data
    },
    isShowFromInfo (data) {
      this.showDetails = data
    }
  }
}
</script>

<style lang="scss" scoped>
  .terminalList {
    height: 100%;
    padding-bottom: 25px;
    #terminaHeader {
      margin-left: 0;
    }
  }
</style>
