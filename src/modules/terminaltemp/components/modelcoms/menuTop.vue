<template>
  <div
    class="menu-top"
    :style="{
      fontSize: itemData.size + 'px',
      color: itemData.color,
      lineHeight: itemData.height + 'px'
    }">
    <ul>
      <li
        v-for="(value, name, index) in itemData.list"
        :class="{'menu-active': index == 0}">
        {{value}}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    itemData: {
      type: Object
    }
  }
}
</script>

<style lang="scss" scoped>
  .menu-top {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0px;
    top: 0px;
    border-radius: 6px;
    box-shadow: 0 1px 5px 2px #DFE3E9;
    background-color: #FFFFFF;
    overflow: hidden;
    ul {
      width: 100%;
      height: 100%;
      white-space: nowrap;
      overflow-x: auto;
      overflow-y: hidden;
      li {
        display: inline-block;
        padding: 0 10px;
      }
    }
    ul::-webkit-scrollbar {
      width: 0px;
      height: 0px;
    }
    ul::-webkit-scrollbar-thumb {
      background: transparent;
    }
    ul::-webkit-scrollbar-track {
      background: transparent;
    }
  }
  .menu-active {
    color: #FF8F1F;
  }
</style>
