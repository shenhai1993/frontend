<template>
  <div class="role-warpper">
    <div class="new-btn">
      <el-button @click="createRole" plain>
        <i class="fa fa-plus"></i>
      </el-button>
      <add-role 
      ref="editWindow" :vis.sync="addFormVisible" @refreshRoleList="_getRoles"
      :type="type" :allRole="roleList" :role="currentRole"
      :index="index"
      ></add-role>
    </div>
      <el-table v-loading="loading" :data="roleList" highlight-current-row height="calc(100% - 60px)">
          <el-table-column type="expand">
            <template slot-scope="props">
              <ul class="list">
                <li class="item" v-for="(item,index) in props.row.permissions" :key="index">{{item.name}}</li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="角色名称"></el-table-column>
          <el-table-column align="center" label="创建时间" prop="created_at" width="200px"></el-table-column>
          <el-table-column align="center" label="修改时间" prop="updated_at" width="200px"></el-table-column>
          <el-table-column width="80px" label="操作" align="center">
            <template slot-scope="scope">
              <el-tooltip  class="item" effect="dark" content="编辑" placement="bottom">
                <el-button type="text" size="mini" @click="editRole(scope, scope.$index)">
                  <i class="fa fa-pencil"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
                <el-button type="text" size="mini" @click="deleteRole(scope.row.id)">
                  <i class="fa fa-trash"></i>
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
      </el-table>
  </div>
</template>

<script>
import Permissions from './Permission.vue'
import AddRole from './AddRole.vue'
import {newTip} from '@/assets/js/encapsulate.js'
import http from '@static/js/utils/http'
import { mapState, mapMutations, mapActions } from 'vuex'

const TYPE_CREATE = 1
const TYPE_EDIT = 2

export default {
  components: {
    AddRole
  },

  data () {
    return {
      show: false,
      type: TYPE_CREATE,
      loading: false,
      checkList: [],
      addFormVisible: false,
      hasPermission: [],
      currentRole: {},
      index: -1
    }
  },
  computed: {
    ...mapState({
      permissionList: state => state.role.permissionList,
      roleList: state => state.role.roleList
    })
  },

  methods: {
    ...mapMutations([
      'SET_PERMISSIONS', 'SET_ROLELIST', 'SHOW_EDIT_WINDOW'
    ]),

    ...mapActions([
      'getPermissions', 'getRoles', 'createRole', 'removeRole'
    ]),

    editRole (props, index) {
      this.type = TYPE_EDIT
      this.SHOW_EDIT_WINDOW(true)
      this.$refs.editWindow.title = '更改角色'
      this.currentRole = props.row
      this.index = index
    },

    deleteRole (id) {
      let params = {
        message: '确定要删除该角色？',
        successCb: () => {
          this._notify('删除成功', '已成功删除该角色', 'success')
        }
      }
      let request = () => {
        return this.removeRole(id)
      }
      newTip(params, request)
    },

    createRole () {
      this.type = TYPE_CREATE
      this.$refs.editWindow.title = '新建角色'
      this.currentRole = {}
      this.SHOW_EDIT_WINDOW(true)
    },
    _notify (title, message, type) {
      this.$notify({
        title,
        message,
        type
      })
    },

    _getRoles () {
      this.loading = true
      this.getRoles().then(res => {
        setTimeout(() => {
          this.loading = false
        }, 500)
      })
    },

    _getPermissions () {
      this.getPermissions()
    }
  },

  created () {
    this._getRoles()
    this._getPermissions()
  }
}
</script>

<style lang="scss" scoped>
.role-warpper{
  height: 100%;
  .new-btn{
    margin-bottom: 20px
  }
  .list{
    display: flex;
    flex-wrap: wrap;
    padding-left: 50px;
    .item{
    flex-basis: 180px
    }
  }
}
</style>
