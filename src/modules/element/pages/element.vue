<template>
  <div class="autoHeight" style="overflow: hidden">
    <filelist></filelist>
    <uploadwindow class='uploadWindow'></uploadwindow>
  </div>
</template>

<script>
import filelist from '../components/FileList'
import uploadwindow from '../components/Window'

export default {
  components: {
    filelist, uploadwindow
  }
}
</script>

<style lang='scss'>
.autoHeight {
  height: calc(100% - 28px);
}

.uploadWindow {
    border: 1px solid red;
    position: fixed;
    right: 30px;
    left: auto;
    bottom: 0px;
    border-top-left-radius: 7px;
    border-top-right-radius: 7px;
    border: 1px solid #e2e2e2;
    box-shadow: 0 0 10px #ccc;
    margin-bottom: 3px;
    background-color: white;
    overflow: hidden;
    padding: 3px 8px;
    z-index: 10;
  }
</style>
