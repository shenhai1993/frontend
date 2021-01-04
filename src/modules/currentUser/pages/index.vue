<template>
  <div class="current-user-content">
      <div class="fixed">
        <el-popover width="120" trigger="hover">
        <div slot="reference">
          <i class="fa fa-user"></i>
          {{ authUser.name }}
        </div>
        <div class="user-name">{{ authUser.name }}</div>
          <div @click="_showDialog('showDialog')" class="clickable-item">
            <!-- <i class="fa fa-cog"> 修改密码</i> -->
            修改密码
          </div>
          <div @click="logout" class="clickable-item">
            <!-- <i class="fa fa-sign-out"> 退出</i> -->
            退出
          </div>
        </el-popover>
      </div>
      <el-dialog @close="cancel" width="500px" title="修改密码" :visible="showDialog">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item prop="password_old" label="当前密码">
            <el-input v-focus autofocus type="password" v-model="form.password_old"></el-input>
          </el-form-item>
          <el-form-item prop="password" label="新密码" :minlength='6' :maxlength='16'>
            <el-input type="password" v-model="form.password"></el-input>
          </el-form-item>
          <el-form-item prop="password_confirmation" label="确认密码">
            <el-input type="password" v-model="form.password_confirmation"></el-input>
          </el-form-item>
          <span class="tip">  修改后需重新登录</span>
        </el-form>
        <div class="footer" slot="footer">
          <dialog-button @clickCancel="cancel" @clickConfirm="confirm"></dialog-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
import VueCookie from "vue-cookies"
import api from '../static/js/api'
import DialogButton from '@/components/DialogButton'

export default {
  components: {
    DialogButton
  },
  created () {
    //this.authUser = JSON.parse(VueCookie.get('authUser'))
    let objAuth = VueCookie.get('authUser')
    this.authUser = (typeof objAuth === 'string') ? JSON.parse(objAuth) : objAuth
  },

  data () {
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else if ( value.length < 6 || value.length > 16) {
        callback(new Error('密码的长度在6-16个字符之间'))
        return false
      }else {
        if (this.form.password_confirmation !== '') {
          this.$refs.form.validateField('password_confirmation')
        }
        callback()
      }
    }

    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一样'))
      } else {
        callback()
      }
    }

    return {
      authUser: {},
      form: {
        password_old: '',
        password: '',
        password_confirmation: ''
      },
      showDialog: false,
      rules: {
        password_old: [
          {required: true, message: '请输入旧密码', tirgger: 'blur'},
          {max: 16,mix: 6, message: '密码的长度在6-16个字符之间', tirgger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', tirgger: 'blur'},
          {validator: validatePass, trigger: 'blur'}
        ],
        password_confirmation: [
          {validator: validatePass2, tirgger: 'blur'},
          {required: true, message: '请输入确认密码', trigger: 'blur'}
        ]
      }
    }
  },

  methods: {
    cancel () {
      this.$refs.form.resetFields()
      this._hideDialog('showDialog')
    },

    confirm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          api.resetPassword(this.form).then(res => {
            // this.$notify.success({
            //   title: '修改成功'
            // })
            if (res.status === 200){
              this.$alert('密码修改成功，请重新登录。', '修改成功', {
                confirmButtonText: '确定',
                callback: action => {
                  this.$router.push({path: '/logout'})
                }
              })
              this.cancel()
            }
          }).catch (e => {
            this.$notify.error({
              title: '修改失败'
            })
          })
        }
      })
    },

    logout () {
      this.$router.push({path: '/logout'})
    }
  }
}
</script>

<style lang="scss">
.current-user-content {
  .fixed {
    position: fixed;
    right: 30px;
    top: 12px;
    font-size: 20px;
    color: #ffffff;
    cursor: pointer;
  }
}
.clickable-item {
  margin: 10px;
  cursor: pointer;
  &:hover {
    color: #409eff;
  }
}
.user-name {
  margin: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebeef5;
}
.tip {
  margin-top: 20px;
  color: #ff0000d8;
}
</style>
