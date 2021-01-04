<template>
  <div
    class="menu-left"
    :style="{
      fontSize: itemData.size + 'px',
      color: itemData.color
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
  .menu-left {
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
      overflow-x: hidden;
      overflow-y: auto;
      li {
        width: 80%;
        padding: 15.3% 0;
        margin: 0 auto;
        text-align: center;
      }
      li + li {
        border-top: 1px solid #DFE3E9;
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
