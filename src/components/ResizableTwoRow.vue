<template>
    <el-container class="resizable-two-row">
      <el-main class="top-part">
        <el-table>
          <el-table-column label="播放时间"></el-table-column>
        </el-table>
      </el-main>
      <div class="resize-bar"></div>
      <el-main class="bottom-part">bottom</el-main>
    </el-container>
</template>

<style lang="scss" scoped>
.resizable-two-row{
  flex-direction: column;
  height: 100%;
  .resize-bar{
    height: 5px;
    width: 100%;
    background-color: #ccc;
    cursor: row-resize;
  }
  .el-main{
    width: 100%;
    flex-grow: 1;
  }
}
</style>

