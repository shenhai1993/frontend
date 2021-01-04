<template>
  <ul class="list">
    <el-tooltip  v-for="(item, index) in showList" :key="index" effect="dark" :content="item.roleName" :disabled="!item.roleName"  placement="top-start">
      <li class="item" :class="{'not-in-role': !item.roleName}">{{item.permission}}</li>
    </el-tooltip>
  </ul>
</template>

<script>
export default {
  props: {
    listRole: {
      type: Array,
      required: true
    },
    listPermission: {
      type: Array,
      required: true
    }
  },
  computed: {
    showList () {
      let showList = []
      let list = this.listRole
      let roleName = ''
      if (list.length !== 0) {
        for (const role of list) {
          roleName = role.name
          for (const permission of role.permissions) {
            showList.push(this._initShowList(permission, roleName))
          }
        }
      }
      roleName = ''
      list = this.listPermission
      if (list.length !== 0) {
        for (const permission of list) {
          showList.push(this._initShowList(permission))
        }
      }
      return showList
    }
  },
  methods: {
    _initShowList (item, roleName) {
      let value = {}
      value.roleName = roleName
      value.permission = item.name
      return value
    }
  }
}
</script>

<style lang="scss" scoped>
.list{
  display: flex;
  flex-wrap: wrap;
  .not-in-role{
    color: #194219
  }
  .item{
    margin-right: 20px;
  }
}
</style>
