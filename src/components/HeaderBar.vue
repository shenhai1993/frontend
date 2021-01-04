<template>
  <header>
    <span class="submenuName">
      <slot name='submenuName'></slot>
      <slot name="subbutton"></slot>
    </span>
    <slot name="subsearchInput"></slot>
  </header>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
  header {
    height: 55px;
    background-color: #FFF;
    line-height: 56px;
    font-size: 14px;
    padding-left: 15px;
    box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.1), 0px 0px 2px rgba(0, 0, 0, 0.1);
  }
</style>
