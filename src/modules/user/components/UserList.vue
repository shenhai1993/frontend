<template>
  <div class="user-list-wrapper">
    <div class="user-btn-group">
      <el-button  @click="createUser" plain style="float: left">
        <i class="fa fa-plus"></i>
      </el-button>
      <!-- search -->
      <el-input placeholder="请输入登录名进行搜索" v-model="search" clearable class="input-with-select" width="200">
      </el-input>
      <!-- 编辑用户 -->
      <edit-user
      :vis.sync="showEditUser"  :checked="checked" :allUsersName="allUsersName" @refreshList="_getUsers" :user="user" :type="type" :groupId="groupId"
      :index="index"
      ></edit-user>
    </div>

    <!-- list -->
    <el-table v-loading="loading" :data="searchUser" ref="table" height="calc(100% - 60px)">
      <el-table-column prop="name" label="登录名"></el-table-column>
      <el-table-column label="角色" width="300px">
        <template slot-scope="scope">
          <list :list="scope.row.roles"></list>
        </template>
      </el-table-column>
      <el-table-column label="权限" type="expand" empty-text="显示" width="60">
        <template slot-scope="scope">
          <permissions-list :listRole="scope.row.roles" :listPermission="scope.row.permissions"></permissions-list>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="100">   <template slot-scope="scope">
          <el-tooltip v-if="String(scope.row.status) !== '1'" class="item" effect="dark" content="编辑" placement="bottom">
            <el-button type="text" size="mini" @click="editUser(scope)">
              <i class="fa fa-pencil"></i>
            </el-button>
          </el-tooltip>
          <el-tooltip v-if="String(scope.row.status) !== '1'" class="item" effect="dark" content="删除" placement="bottom">
            <el-button type="text" size="mini" @click="deleteUser(scope.row)">
              <i class="fa fa-trash"></i>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import List from '@/modules/user/components/List.vue'
import PermissionsList from '@/modules/user/components/PermissionsList.vue'
import EditUser from '@/modules/user/components/EditUser.vue'
import {newTip} from '@/assets/js/encapsulate.js'
import {mapState, mapMutations, mapActions} from 'vuex'
import http from "../../../../static/js/utils/http";

const TYPE_CREATE = 1
const TYPE_EDIT = 2

export default {
  data () {
    return {
      search: '',
      loading: false,
      showNewUser: false,
      showEditUser: false,
      checked: {roles: [], permissions: []},
      user: null,
      type: TYPE_CREATE,
      index: -1,
      searchUser: [],
      groupId: undefined
    }
  },
  computed: {
    ...mapState ({
      userList: state => state.user.userList,
      roleList: state => state.role.roleList
    }),

    allUsersName () {
      let allUsersName = []
      if (this.userList.length !== 0) {
        for (const item of this.userList) {
          allUsersName.push(item.name)
        }
      }
      return allUsersName
    }
  },
  components: {
    List,
    PermissionsList,
    EditUser
  },

  methods: {
    ...mapMutations([
      'SET_USER_LIST', 'SHOW_EDIT_WINDOW', 'REMOVE_FROM_USERLIST', 'SET_GROUP_LIST'
    ]),

    ...mapActions([
      'getPermissions', 'removeUser', 'getRoles', 'getUsers'
    ]),

    createUser () {
      this.getRoles().then(()=>{
        this.getGroups().then(
          res=>{
            if (res.data.success){
              this.SET_GROUP_LIST([res.data.message])
              this.type = TYPE_CREATE
              this.checked = {roles: [], permissions: []}
              this.user = null
              this.SHOW_EDIT_WINDOW(true)
            }
          }
        )
      })
    },
    getGroups(){
      let data = http.get('/groups')
      return data
    },
    editUser (scope) {
      if (this.roleList.length<1){
        this.getRoles()
      }
      this.getGroups().then(
        res=>{
          if (res.data.success){
            this.SET_GROUP_LIST([res.data.message])
            this.type = TYPE_EDIT
            this.user = scope.row
            this.checked.roles = scope.row.roles
            this.checked.permissions = scope.row.permissions
            this.index = scope.$index
            this.SHOW_EDIT_WINDOW(true)
          }
        }
      )
    },

    deleteUser (row) {
      let params = {
        message: '确定要删除该用户？'
      }
      let request = () => {
        return this.removeUser({id: row.id, data: {group_id: row.group_id}})
      }
      newTip(params, request)
    },

    _getUsers () {
      this.loading = true
      this.getUsers(this.groupId).then(res => {
        setTimeout(() => {
          this.loading = false
        }, 500)
      })
    }
  },
  watch: {
    $route: {
      handler (to, form) {
        let groupId = this.$route.query.groupId
        if (!groupId) {
          return
        }
        this.groupId = parseInt(groupId)
        this._getUsers()
      },
      immediate: true
    },

    userList: {
      handler (list) {
        this.searchUser = list
        this.search = ''
      }
    },

    search: {
      handler (val) {
        this.searchUser = this.userList.filter(
        user => {
          return user.name.indexOf(val) !== -1
        })
      }
    }
  },

  created () {
    this.getRoles()
    this.getPermissions()
  }
}
</script>

<style lang="scss" scoped>
.user-list-wrapper{
  height: 100%;
  .el-input{
    margin-left: 13px;
    width: 200px;
  }
}
</style>
