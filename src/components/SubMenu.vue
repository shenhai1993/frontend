<template>
  <el-menu class="el-menu-vertical-demo" :default-active="defaultActive" :menu="menu" :router="router" @select="clickMenu">
    <el-menu-item v-for="m in menu" :key="m.key" :index="m.index">
      <i :class="m.icon"></i>
      <span>{{ m.title }}</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  props: {
    menu: {
      type: Array,
      default: []
    },
    router: {
      type: Boolean,
      default: true,
    },
    defaultActive: {
      type: String
    }
  },

  methods: {
    clickMenu (index) {
      this.$emit('clickMenu', index)
    }
  }
}
</script>

<style scoped>
.el-menu-item [class^=fa] {
  margin-right: 5px;
  width: 24px;
  text-align: center;
  font-size: 18px;
  vertical-align: middle;
}
</style>
