<template>
  <div class="playlist">
     <el-table :data="playlist" style="width: 100%">
      <el-table-column prop="state" label="状态" show-overflow-tooltip :width="80"></el-table-column>
      <el-table-column prop="name" label="名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="screen" label="方向" show-overflow-tooltip :width="80"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      playlist: [{
        state: '已发布',
        name: '征兵',
        screen: '横屏'
      }, {
        state: '已发布',
        name: '征兵',
        screen: '竖屏'
      }, {
        state: '已发布',
        name: '征兵',
        screen: '竖屏'
      }, {
        state: '已发布',
        name: '征兵',
        screen: '横屏'
      }]
    }
  }
}
</script>

<style lang="sass">
  .playlist
    .el-table
      font-size: 12px;
      th
        height: 15px;
        background-color: white;
        font-weight: 600;
        div
          height: 20px;
          line-height: 20px;
          background-color: white;
      td
        height: 20px;
        line-height: 20px;
</style>
