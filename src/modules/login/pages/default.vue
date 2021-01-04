<template>
  <div id="signinPage">
    <div class="logo text-center">
      <img src="../../../../static/images/logo3.png" />
    </div>
    <div class="content-div">
      <div class="card-left"></div>
      <div class="login-right">
        <el-tabs v-model="activeName">
          <el-tab-pane label="" name="signin">
            <el-form
              :model="loginForm"
              :rules="loginRules"
              ref="loginForm"
              label-width="80px"
            >
              <h3 style="text-align: center;font-size: 20px;font-weight: 600; margin-bottom: 25px">账号密码登录</h3>
              <!-- 登录表单内容 -->
              <el-form-item prop="username">
                <el-input class="loginItemWidth"
                          v-model="loginForm.username"
                          placeholder="用户名"
                          :maxlength='12' :minlength='1'
                          @keyup.enter.native="login"></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input class="loginItemWidth"
                          type="password"
                          v-model="loginForm.password"
                          :maxlength='16'
                          placeholder="密码"
                          @keyup.enter.native="login"></el-input>
              </el-form-item>
              <el-form-item>
                <p class="rememberOrforget">
                  <el-checkbox v-model="rememberme">记住用户名</el-checkbox>
                </p>
                <el-button type="primary"
                           class="loginItemWidth"
                           @click="login"
                           :loading="islogin">
                           <!-- native-type="submit" -->
                  登录
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>

      </div>
    </div>
    <footer class="text-center m-b-10">
      <span>
        Copyright © 2011 - {{ new Date().getFullYear() }} 易秀 &nbsp;&nbsp;
      </span>
    </footer>
  </div>
</template>

<script>
// import 'bubbly-bg'
import api from '../../../../static/js/api/index.js'
import http from '../../../../static/js/utils/http'
import { Notification } from 'element-ui'
export default {
  mounted () {
    if (window.localStorage && localStorage.awesomeEshowUserPhone) {
      this.loginForm.username = localStorage.awesomeEshowUserPhone
      this.rememberme = true
    }

    // window.bubbly({
    //   colorStart: '#ebf4fa', // default is blue-ish
    //   colorStop: '#ebf4fa', // default is blue-ish
    //   compose: 'lighter', // default is 'lighter' 'source-over'
    //   shadowColor: '#adfcf2' // default is #fff
    // })
  },

  data () {
    // 密码的验证
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6 || value.length > 12) {
        callback(new Error('密码长度在 6 到 12 个字符'))
      } else {
        if (this.registerForm.password_confirmation !== '') {
          this.$refs.registerForm.validateField('password_confirmation')
        }
        callback()
      }
    }

    // 用户名的验证
    const checkUsername = (rule, value, callback) => {
      let username = value.trim()
      console.log(username.length)
      if (username === '') {
        callback(new Error('请输入用户名'))

        return false
      } else if (username.length < 1 || username.length > 12) {
        callback(new Error('用户名的长度在1-12个字符之间'))

        return false
      } else {
        return true
      }
    }

    return {
      text: '登录',
      loginForm: {
        username: '',
        password: '',
        licenseList: {}
      },

      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 1, max: 12, message: '长度在 1 到 12 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
      },

      activeName: 'signin',

      isforget: false,
      rememberme: false,
      islogin: false
    }
  },

  watch: {
    activeName (v, ov) {
      if (v === 'signin') {
        this.isforget = false
      }
    },

    rememberme (v, ov) {
      if (v && this.loginForm.username) {
        localStorage.awesomeEshowUserPhone = this.loginForm.username
      }
      if (!v) {
        localStorage.awesomeEshowUserPhone = ''
      }
    },

    'loginForm.username' (v, ov) {
      if (v && this.rememberme) {
        localStorage.awesomeEshowUserPhone = this.loginForm.username
      }
    }
  },

  methods: {
    login () {
      let username = this.loginForm.username
      let password = this.loginForm.password

      this.$refs['loginForm'].validate(valid => {
        if (valid) {
          this.islogin = true

          api.login(username, password)
            .then(res => {
              if(res.code == 500) {
                sessionStorage.setItem('license', JSON.stringify(res.message))
                return this.$router.push('/license')
              }
              if(res.code == 501) {
                Notification({
                  title: '错误',
                  type: 'error',
                  message: res.message
                })
                this.loginForm.password = ''
                return this.islogin = false
              }
              if (res.success) {
                let auth = res.message
                delete auth.roles
                this.$cookies.set('authUser', JSON.stringify(auth))
                this.$router.push({path: '/welcome'})
                this.islogin = false
              }
            })
            .catch((err => {
              this.islogin = false
            }))
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .tab {
    color: grey;
  }

  .wangjing {
    width: 20px;
    height: 30px;
    border-width: 0px;
    border: hidden;
    border: none;
  }

  .sub_title {
    font-size: 27px;
    color: #409EFF;
    margin-bottom: 1%;
  }

  #signinPage {
    height: 100vh;
    .content-div{
      width: 1000px;
      position: absolute;
      left: 50%;
      top: 50%;
      border-radius: 8px;
      -webkit-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
      height: 425px;
      overflow: hidden;
      .card-left{
        width: 540px;
        float: left;
        height: 100%;
        background-image: url("../../../../static/images/background.png");
        background-size: cover;
      }
      .login-right{
        width: 463px;
        height: 393px;
        background: #ffff;
        position: absolute;
        right: 10px;
        top: 15px;
        box-shadow: 0px 0px 3px rgba(0,2,2,0.5);
      }
    }
    .logo {
      position: absolute;
      top: 15px;
      left: 15px;
    }

    .el-form {
      width: 450px;
      margin: 0 auto;
    }

    .loginItemWidth {
      width: 298px;
    }

    [class^='el-tabs']::after {
      background-color: transparent!important;
    }

    #tab-register,
    #tab-signin {
      font-size: 18px;
    }

    #pane-register,
    #pane-signin {
      color: #666;
    }
    div[role='tablist'] {
      left: calc(50% - 56px);
    }
    // .noSigin {
    //   div[role='tablist'] {
    //     left: calc(50% - 18px);
    //     > div {
    //       width: 100%!important;
    //     }
    //   }
    // }

    .getcode {
      background-color: #409EFF;
      color: #fff;
      border-radius: 0;
      border: 1px solid #409EFF;
      border-right: 1px;
      margin-right: -21px;
      border-top-right-radius: 3px;
      border-bottom-right-radius: 3px;
      width: 134px;
      &:hover {
        background-color: #66b1ff;
      }
    }

    .el-button.is-disabled {
        background-color: #f5f7fa;
        border-color: #ebeef5;
        color: #c0c4cc;
      &:hover {
        background-color: #f5f7fa;
        border-color: #ebeef5;
        color: #c0c4cc;
      }
    }

    .loginItemWidth {
      width: 298px;
    }

    footer {
      color: #b8aebe;
      position: fixed;
      bottom: 0;
      width: 100%;
      img {
        vertical-align: sub;
      }
    }
  }
  .el-tabs__item {
    color: #b8aebe;
  }
  .rememberOrforget {
    margin-bottom: 40px;
    .el-checkbox {
      color: #b8aebe;
    }
    width: 300px;
    a {
      float: right;
      &:hover {
        color: #66b2ff!important;
      }
    }
  }
</style>
