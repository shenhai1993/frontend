<template>
  <ul class="list">
    <li class="item" v-for="(item, index) in list" :key="index">{{item.name}}</li>
  </ul>
</template>

<script>
export default {
  props: {
    list: {
      type: Array
    }
  }
}
</script>

<style lang="scss" scoped>
.list{
  display: flex;
  flex-wrap: wrap;
  .item{
    margin-right: 20px;
  }
}
</style>
