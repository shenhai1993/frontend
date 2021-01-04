<template>
  <div
    class="menu-left"
    :style="{
      fontSize: itemData.size / 10 + 'rem',
      color: itemData.color
    }">
    <ul>
      <li
        v-for="(value, name, index) in itemData.list"
        :class="{'menu-active': name == currMenu}"
        @click="selectMenu(name)">
        {{value.cname}}
        <i v-show="value.num > 0" class="number-icon">{{value.num}}</i>
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
  },

  data () {
    return {
      currMenu: 0
    }
  },

  methods: {
    selectMenu (id) {
      if (id == this.currMenu){
        return
      }
      this.currMenu = id
      this.$emit('getNewProductList', id)
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
    border-radius: 0.625rem;
    box-shadow: 0 1px 5px 2px #DFE3E9;
    background-color: #FFFFFF;
    overflow: hidden;
    ul {
      width: 100%;
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      li {
        position: relative;
        width: 80%;
        padding: 15.3% 0;
        margin: 0 auto;
        text-align: center;
        .number-icon {
          position: absolute;
          width: 1.6rem;
          height: 1.6rem;
          line-height: 1.6rem;
          top: 5px;
          right: 0px;
          font-size: 1.2rem;
          color: #FFFFFF;
          text-align: center;
          border-radius: 50%;
          background-color: #FF8F1F;
        }
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
