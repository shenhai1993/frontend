<template>
  <div class="parentConent">
    <el-header>
      <slot name="submenuName"></slot>
    </el-header>
    <section class="templateContainer">
      <router-view></router-view>
    </section>
  </div>
</template>
