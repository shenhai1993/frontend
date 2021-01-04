<template>
  <aside class="submenu">
    <header>
      <slot name="title"></slot>
    </header>
    <div>
      <slot name="component"></slot>
    </div>
  </aside>
</template>

<script>
export default {
  // props: {
  //   // menus数组里面的数据参数格式为:
  //   // {name: '终端列表', icon: 'el-icon-tickets', path: '/terminal/list'}
  //   menus: {
  //     type: Array,
  //     default: () => []
  //   },
  //   // 是否重新改变布局
  //   ischangeLayout: {
  //     type: Boolean,
  //     default: () => false
  //   }
  // }
}
</script>
