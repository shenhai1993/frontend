<template>
    <el-checkbox-group v-model="checkList" @change="emitCheckedList">
      <el-checkbox width="150px" v-for="(item,index) in showList" :key="index" :label="item" :disabled="!showAll"></el-checkbox>
    </el-checkbox-group>
</template>

<script>
export default {
  data () {
    return {
      checkList: []
    }
  },

  props: {
    role: {
      type: Object
    },

    permissionList: {
      type: Array
    },

    showAll: {
      type: Boolean
    },

    type: {
      type: Number
    }
  },

  computed: {
    showList () {
      if (this.showAll) {
        return this.permissionList
      } else {
        return this.checkList
      }
    }
  },

  mounted () {
    this._initHasPermissions()
    this.emitCheckedList()
  },

  methods: {
    emitCheckedList () {
      this.$emit('update:emitChecked', this.checkList)
    },

    _initHasPermissions () {
      if (this.role) {
        this.role.permissions.forEach(element => {
          this.checkList.push(element.name)
        })
      } else {
        this.checkList = []
      }
    }
  },

  watch: {
    role () {
      this._initHasPermissions()
    },
    checkList () {
      this.emitCheckedList()
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
