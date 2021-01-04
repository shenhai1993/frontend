<template>
  <el-dialog width="500px" :title="title" :visible="showEditWindow" @close="click_cancel">
    <el-form :model="newRole" ref="newRole" :rules="rules">
      <el-form-item prop="name" label="角色名称">
        <el-input v-focus autofocus v-model="newRole.name" auto-complete="off"></el-input>
      </el-form-item>
      <p>功能权限</p>
      <el-form-item prop="checked">
        <checkbox :v-model="newRole.checked" class="clearMargin" :list="permissionsList" @emitChecked="getChecked" :checked="checked"></checkbox>
      </el-form-item>
      <p>通用权限</p>
      <el-form-item prop="checkedGeneral">
        <checkbox :v-model="newRole.checkedGeneral" class="clearMargin" :list="generalList" @emitChecked="getCheckedGeneral" :checked="checkedGeneral"></checkbox>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <dialog-button @clickCancel="click_cancel" @clickConfirm="submitForm('newRole')"></dialog-button>
    </div>
  </el-dialog>
</template>

<script>
// import PermissionList from './Permission.vue'
import Checkbox from '@/components/Checkbox.vue'
import http from '@static/js/utils/http'
import {mapState, mapMutations, mapActions} from 'vuex'
import DialogButton from '@/components/DialogButton'

const TYPE_CREATE = 1
const TYPE_EDIT = 2

export default {
  data () {
    let validatorName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('角色名称不能为空'))
      } else {
        for (const element of this.roleList) {
          if (this.role && this.role.name === value) {
            continue
          } else if (element.name === value) {
            callback(new Error('角色已存在'))
          }
        }
      }
      callback()
    }

    let validatorPermissions = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('最少选择一个权限'))
      } else {
        callback()
      }
    }

    return {
      newRole: {name: '', checked: [], checkedGeneral: []},
      title: '',
      checked: [],
      checkedGeneral: [],
      generalList: ['查看子分支', '操作子分支'],
      rules: {
        name: [{ validator: validatorName, trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' },
          { pattern: /[^\d]/g, message: '不允许输入纯数字' }
        ],
        checked: [{validator: validatorPermissions, trigger: 'blur'}]
      }
    }
  },
  computed : {
    ...mapState({
      permissionList: state => state.role.permissionList,
      roleList: state => state.role.roleList,
      showEditWindow: state => state.role.showEditWindow
    }),

    permissionsList () {
      return this.permissionList.filter( p => {
        return p !== '查看子分支' && p !== '操作子分支' && p !== '权限列表' && p !== '组织机构列表'
      }).map((it) => {return it.name})
    }
  },
  props: {
    role: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    },

    type: {
      type: Number
    },

    index: {
      type: Number
    }
  },

  components: {
    Checkbox,
    DialogButton
  },

  methods: {
    ...mapMutations([
      'SHOW_EDIT_WINDOW', 'SET_ROLELIST'
    ]),

    ...mapActions([
      'createRole', 'editRole'
    ]),
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.type === TYPE_EDIT) {
            this._redactRole()
          } else if (this.type === TYPE_CREATE) {
            this._addNewRole()
          }
        } else {
          return false
        }
      })
    },

    click_cancel () {
      this.checkedGeneral = []
      this._hiddenForm()
    },

    _setPayload (type) {
      let data = { name: this.newRole.name, permissions: this.newRole.checked }
      let flag = true
      data.permissions.some((p, i) => {
        if (p === '组织机构列表') {
          data.permissions.splice(i, 1)
          return true
        }
      })
      // 用户\终端\播出单 默认给组织机构列表权限
      data.permissions.some(p => {
        if (p === '用户管理' || p === '终端管理' || p === '播出单管理') {
            data.permissions.push('组织机构列表')
            return true
          }
      })
      // 角色管理默认给权限列表权限
      // data.permissions.some((p, i) => {
      //   if (p === '权限列表') {
      //     data.permissions.splice(i, 1)
      //     return true
      //   }
      // })
      data.permissions.some(p => {
        if (p === '角色管理') {
          data.permissions.push('权限列表')
        }
      })
      if (this.newRole.checkedGeneral.length !== 0) {
        data.permissions = data.permissions.concat(this.newRole.checkedGeneral)
      }
      return data
    },

    _addNewRole () {
      let data = this._setPayload(TYPE_CREATE)
      this.createRole(data)
      .then(res => {
        this._notify('成功', '新建角色成功', 'success')
        })
        .catch(e => {
          this._notify('错误', '发生错误', 'error')
          console.log(e)
        })
    },
    _redactRole () {
      let data = this._setPayload(TYPE_EDIT)

      this.editRole({
        id: this.role.id,
        data,
        index: this.index
      })
    },

    _notify (title, message, type) {
      this.$notify({
        title,
        message,
        type
      })
    },

    _hiddenForm () {
      this._resetForm('newRole')
      this.SHOW_EDIT_WINDOW(false)
    },

    _resetForm (formName) {
      this.$refs[formName].resetFields()
      this.newRole = {name: '', checked: [], checkedGeneral: []}
    },

    getChecked (checked) {
      this.newRole.checked = checked
    },

    getCheckedGeneral (checked) {
      this.newRole.checkedGeneral = checked
    },

    _initChecked () {
      this.checked = []
      if (JSON.stringify(this.role) !== '{}' && this.role.permissions.length !== 0) {
        this.role.permissions.forEach(item => {
          if (item.name === '查看子分支' || item.name === '操作子分支') {
            this.checkedGeneral.push(item.name)
          } else {
            this.checked.push(item.name)
          }
        });
      }
    },

    _initRoleName () {
      if (this.type === TYPE_CREATE) {
        this.newRole = {name: '', checked: [], checkedGeneral: []}
      }
      this.newRole.name = this.role.name
    }
  },

  watch: {
    role: {
      handler (val) {
        this.newRole.name = val.name
      },
      deep: true
    },

    showEditWindow: {
      handler () {
        this._initChecked()
        this._initRoleName()
        this.$nextTick(() => {
          this.autofocusFlag = !this.autofocusFlag
        })
      }
    }
  }
}
</script>
<style lang="scss">
  .clearMargin{
    .el-checkbox:first-child {
      margin-left: 0px !important;
    }
  }
</style>
