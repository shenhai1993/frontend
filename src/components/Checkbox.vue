<template>
    <el-checkbox-group v-model="checkedList" >
      <el-checkbox width="width" v-for="(item,index) in list" :key="index" :label="item"></el-checkbox>
    </el-checkbox-group>
</template>

<script>
export default {
  data () {
    return {
      checkedList: []
    }
  },

  props: {
    list: {
      type: Array
    },

    checked: {
      type: Array,
      default () {
        return []
      }
    },

    width: {
      type: Number,
      default: 150
    }
  },

  mounted () {
    this._initCheckedList()
  },

  methods: {
    _initCheckedList () {
      this.checkedList = []
      if (this.checked.length !== 0) {
          this.checkedList = this.checked.concat()
        }
      },
    // 直接返回选中的值
    getChecked() {
      return this.checkedList
    }
  },

  watch: {
    checked: {
      handler (newVal, oldVal) {
        this._initCheckedList()
      },
      deep: true,
      immediate: true
    },

    checkedList (val) {
      this.$emit('emitChecked', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-checkbox{
  width: 120px
}
.el-checkbox:first-child{
  margin-left: 30px
}
</style>
