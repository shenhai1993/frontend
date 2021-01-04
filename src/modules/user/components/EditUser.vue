<template>
  <el-dialog :visible="showEditWindow" width="500px" @close="cancel"  :close-on-click-modal="false">
    <el-form :model="newUser" :rules="rules" label-width="90px" ref="editUser">
      <el-form-item label="登录名：" prop="name">
        <el-input v-focus  v-model="newUser.name" :disabled="type!==1"></el-input>
      </el-form-item>
      <el-form-item label="密码：" prop="password">
        <el-input v-model="newUser.password" type="password" minlength="6" maxlength="12"></el-input>
      </el-form-item>
      <el-form-item prop="password_confirmation" label="确认密码">
        <el-input type="password" v-model="newUser.password_confirmation" minlength="6" maxlength="12"></el-input>
      </el-form-item>
      <el-form-item label="组织机构：">
        <select-tree :options="groupLists" @clickGroupId="clickChildId" v-model="to_group_id" :props="defaultProps" />
      </el-form-item>
      <el-form-item prop="roles" label="选择角色：">
        <checkbox class="clearMargin" :list="rolesName" :checked="checkedRoles" :v-model="newUser.roles" @emitChecked="setCheckedRoles"></checkbox>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <dialog-button @clickCancel="cancel" @clickConfirm="submitForm('editUser')"></dialog-button>
    </div>
  </el-dialog>
</template>

<script>
import http from '@static/js/utils/http.js'
import Checkbox from '@/components/Checkbox.vue'
import {mapState, mapActions, mapMutations} from 'vuex'
import DialogButton from '@/components/DialogButton'
import SelectTree  from '@/components/SelectTree'

const TYPE_CREATE = 1
export default {
  data () {
    let validatorName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('登录名不能为空'))
      } else {
        for (const element of this.allUsersName) {
          if (this.user && this.user.name === value) {
            continue
          } else if (element === value) {
            callback(new Error('登录名已经存在'))
          }
        }
      }
      callback()
    }

    let validatorPassword = (rule, value, callback) => {
      if (!this.user && !value) {
        callback(new Error('密码不能为空'))
      } else if (value.length < 6) {
        callback(new Error('密码不能少于六位'))
      }else {
        callback()
      }
    }
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.newUser.password) {
        callback(new Error('两次输入密码不一样'))
      } else {
        callback()
      }
    }
    return {
      newUser: {},
      defaultProps: {
        parent_id: 'group_id',   // 父级唯一标识
        value: 'id',          // 唯一标识
        label: 'name',       // 标签显示
        children: 'children', // 子级
      },
      checkedRoles: [],
      to_group_id: undefined,
      rules: {
        name: [
          {required: true, validator: validatorName, trigger: 'blur'},
          { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号' }
        ],
        password: [{validator: validatorPassword, tigger: 'blur'}],
        password_confirmation: [{validator: validatePass2, tirgger: 'blur'}]
      }
    }
  },

  computed: {
    ...mapState({
      showEditWindow: state => state.user.showEditWindow,
      roleList: state => state.role.roleList,
      groupLists: state => state.user.groupLists,
    }),
    rolesName () {
      let rolesName = []
      if (this.roleList.length !== 0) {
        for (const item of this.roleList) {
          rolesName.push(item.name)
        }
      }
      return rolesName
    }
  },

  props: {
    checked: {
      type: Object
    },

    allUsersName: {
      type: Array,
      required: true
    },

    user: {
      type: Object,
      default: null
    },

    type: {
      type: Number,
      required: true
    },

    groupId: {
      type: Number
    },

    index: {
      type: Number,
      default: -1
    }
  },

  components: {
    Checkbox,
    DialogButton,
    SelectTree
  },
  methods: {
    ...mapMutations([
      'SHOW_EDIT_WINDOW'
    ]),

    ...mapActions([
      'createUser', 'modifyUser', 'getUsers'
    ]),
    clickChildId(val){
      this.newUser.to_group_id = val
    },
    submitForm (formName) {
      if (this.type === 1) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this._createUser()
          } else {
            return false
          }
        })
      } else {
        this._edit()
      }
    },

    setCheckedRoles (val) {
      this.newUser.roles = val
    },

    cancel () {
      this._hiddeWindow()
    },

    async _createUser () {
      if (this.to_group_id !==undefined && this.to_group_id !=='') {
        this.newUser.group_id = this.groupId
        let res = await this.createUser(this.newUser)
        if (res) {
          this._notify('成功', '操作成功', 'success')
          this._hiddeWindow()
        } else {
          this._notify('错误', '操作失败，请重试', 'error')
        }
      }  else {
        this._notify('错误', '请选择组织机构', 'error')
      }
    },

    async _edit () {
      if (this.to_group_id !==undefined && this.to_group_id !==''){
        let res = await this.modifyUser({user: this.newUser, index: this.index})
        if (res) {
          this._notify('成功', '操作成功', 'success')
          // this.getUsers(1)
          this._hiddeWindow()
        }
        else {
          this._notify('错误', '操作失败，请重试', 'error')
        }
      } else {
        this._notify('错误', '请选择组织机构', 'error')
      }
    },

    _notify (title, message, type) {
      this.$notify({
        title,
        message,
        type
      })
    },

    _hiddeWindow () {
      this._resetForm('editUser')
      this.to_group_id = undefined
      this.SHOW_EDIT_WINDOW(false)
    },

    _resetForm (formName) {
      this.$refs[formName].resetFields()
      this.newUser = {}
      this.checkedRoles = []
    },

    _initChecked () {
      // set checkedRoles
      this.checkedRoles = []
      if (this.checked.roles.length !== 0) {
        for (const item of this.checked.roles) {
          this.checkedRoles.push(item.name)
        }
      }
    },

    _initUser () {
      if (this.type === 1) {
        this.newUser = {}
        return
      }
      this.newUser.id = this.user.id
      this.newUser.name = this.user.name
      this.newUser.group_id = this.user.group_id
    }
  },

  watch: {
    showEditWindow: {
      handler () {
        this._initUser()
        this._initChecked()
        this.$nextTick(() => {
          this.autofocusFlag = !this.autofocusFlag
        })
      }
    },
    user(val){
      if (val){
        this.to_group_id = val.group_id
      }
    },
    groupId: {
      handler (val) {
        this.to_group_id = val
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.new-user-warpper{
  padding-left: 26px;
}
</style>
<style lang="scss">
  .clearMargin{
    .el-checkbox:first-child {
      margin-left: 0px !important;
    }
  }
</style>
