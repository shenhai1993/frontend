<template>
  <div class="terminalList">
    <terminal-list></terminal-list>
  </div>
</template>

<script>
import TerminalList from './list/lists'

export default {
  components: {
    TerminalList
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
  }
</style>


