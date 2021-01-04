<template>
  <div id="signinPage">
    <el-row>
      <el-col :span="12" :offset="6" style="color: #fff;">
        <!-- <div class="logo text-center">易秀</div> -->
        <div class="logo text-center">
          <!-- <img src="../../static/images/eshow.png" /> -->
        </div>
        <div class="sub_title text-center">{{ text }}易秀，让您大开眼界</div>

        <!--  :class="!isforget ? 'noSigin' : ''" -->
        <el-tabs v-model="activeName" @tab-click="tabClick">
          <el-tab-pane label="登录" name="signin">
            <el-form
              :model="loginForm"
              :rules="loginRules"
              ref="loginForm"
              label-width="80px"
            >
              <!-- 登录表单内容 -->
              <el-form-item>
                <el-input class="loginItemWidth"
                          v-model.number="loginForm.username"
                          placeholder="手机号"
                          :maxlength='11' :minlength='11'
                          @keyup.enter.native="login"></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input class="loginItemWidth"
                          type="password"
                          v-model="loginForm.password"
                          placeholder="密码"
                          @keyup.enter.native="login"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary"
                           class="loginItemWidth"
                           @click="login"
                           :loading="islogin">
                           <!-- native-type="submit" -->
                  登录
                </el-button>
                <p class="rememberOrforget">
                  <el-checkbox v-model="rememberPhone">记住手机号</el-checkbox>
                  <a class="blueWhiteHover" href="javascript:;" @click="forgetPassword">忘记密码？</a>
                </p>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <!-- v-if="isforget"  -->
          <el-tab-pane :label="isforget ? '忘记密码' : '注册'" name="register" class="tab">
                <!-- 注册表单内容 -->
            <el-form
              :model="registerForm"
              :rules="registerRules"
              ref="registerForm"
              label-width="80px">
                <el-form-item prop="phone">
                  <el-input placeholder="请输入手机号" class="loginItemWidth norightBorder"
                            v-model.number="registerForm.phone" auto-complete="off"
                            :maxlength='11' :minlength='11'>
                    <template slot="append" v-if="!isHascode">
                      <el-button class="getcode" @click="getCode"
                                 :disabled="!regularMobile">
                                 {{ !isclickGetcode ? '获取验证码' : `${countDown}s后再次获取`}}
                      </el-button>
                    </template>
                  </el-input>
                </el-form-item>

                <el-form-item prop="code">
                  <el-input class="loginItemWidth" v-model="registerForm.code"
                            auto-complete="off" placeholder="输入验证码"></el-input>
                </el-form-item>

                <el-form-item prop="password">
                  <el-input type="password" class="loginItemWidth"
                            v-model="registerForm.password" auto-complete="off" placeholder="密码"></el-input>
                </el-form-item>

                <el-form-item prop="password_confirmation">
                  <el-input type="password" class="loginItemWidth" v-model="registerForm.password_confirmation" auto-complete="off" placeholder="确认密码"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" v-if="isforget"
                             class="loginItemWidth"
                             @click="register">
                             重设密码
                  </el-button>
                  <el-button type="primary" v-if="!isforget"
                             class="loginItemWidth"
                             @click="register">
                             注册
                  </el-button>
                </el-form-item>
            </el-form>

          </el-tab-pane>
        </el-tabs>

      </el-col>
    </el-row>
    <footer class="text-center m-b-10">
      <span>
        <!-- Copyright © 2011 - {{ this.$moment().format('YYYY') }} 易秀 &nbsp;&nbsp; -->
        <!-- <span v-html="wangjing"></span> -->
        <!-- <a href="http://szcert.ebs.org.cn/158ce959-cf46-4fcc-9836-5d24a456da82" target="_blank">
          <img src="http://szcert.ebs.org.cn/Images/govIcon.gif" class="wangjing" title="深圳市市场监督管理局企业主体身份公示" alt="深圳市市场监督管理局企业主体身份公示" />
        </a> -->
        粤ICP备14100498号-1
      </span>
    </footer>
  </div>
</template>

<script>
import api from '../../../../static/js/api/index.js'

export default {
  mounted () {
    // this.$cookie.delete('authUser')
    if (window.localStorage && localStorage.awesomeEshowUserPhone) {
      this.loginForm.username = localStorage.awesomeEshowUserPhone
      this.rememberPhone = true
    }
  },

  data () {
    // 密码的验证
    var validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 6 || value.length > 12) {
        callback(new Error('密码长度在 6 到 12 个字符'))
      } else {
        if (this.registerForm.password_confirmation !== '') {
          this.$refs.registerForm.validateField('password_confirmation')
        }
        callback()
      }
    }

    var validateCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    // 手机号码的验证
    let me = this
    var checkMobile = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号'))

        return false
      } else if (!(/^((1[3-8][0-9])+\d{8})$/.test(value))) {
        if (this.activeName === 'register') {
          this.countDown = 60
          this.isclickGetcode = false
          this.regularMobile = false
          clearInterval(this.setInterval_)
        }
        callback(new Error('请输入正确的手机号'))

        return false
      } else if ((/^((1[3-8][0-9])+\d{8})$/.test(value))) {
        callback()

        if (this.activeName === 'register' && (this.countDown === 60 || this.countDown === 0)) {
          this.regularMobile = true
        }

        return true
      }
    }

    return {
      text: '登录',
      loginForm: {
        username: '',
        password: ''
      },

      loginRules: {
        username: [
          { validator: checkMobile, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
      },

      activeName: 'signin',
      isHascode: false,
      registerForm: {
        phone: '',
        code: '',
        password: '',
        password_confirmation: ''
      },

      registerRules: {
        phone: [
          { validator: checkMobile, trigger: 'change' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        password_confirmation: [
          { validator: validateCheck, trigger: 'blur' }
        ]
      },

      regularMobile: false,
      countDown: 60,
      isclickGetcode: false,
      setInterval_: '',
      isforget: false,
      rememberPhone: false,
      islogin: false
    }
  },

  watch: {
    activeName (v, ov) {
      if (v === 'signin') {
        this.isforget = false
      }
    },

    rememberPhone (v, ov) {
      if (v && this.loginForm.username) {
        localStorage.awesomeEshowUserPhone = this.loginForm.username
      }
      if (!v) {
        localStorage.awesomeEshowUserPhone = ''
      }
    },

    'loginForm.username' (v, ov) {
      if (v && this.rememberPhone) {
        localStorage.awesomeEshowUserPhone = this.loginForm.username
      }
    }
  },

  methods: {
    tabClick (tab, e) {
      this.text = (tab.name === 'signin') ? '登录' : '注册'
    },

    login () {
      let username = this.loginForm.username
      let password = this.loginForm.password

      this.$refs['loginForm'].validate(valid => {
        if (valid) {
          this.islogin = true

          api.login(username, password)
            .then(res => {
              if (res.success) {
                this.$cookies.set('authUser', JSON.stringify(res.message))

                this.$router.push('/welcome')
                 this.islogin = false
              }
            })
            .catch((err => {
              this.islogin = false
            }))
        }
      })
    },

    register () {
      this.$refs['registerForm'].validate(async (valid) => {
        if (valid) {
          let res
          // registerForm
          this.registerForm.email = this.registerForm.phone + '@qq.com'
          if (this.isforget) {
            res = await api.forgot(this.registerForm)
          } else {
            res = await api.registerUser(this.registerForm)
          }

          if (res.status === 200) {
            this.$notify.success({
              title: '操作成功, 请登录！'
            })
            this.activeName = 'signin'
            this.registerForm = {
              phone: '',
              code: '',
              password: '',
              password_confirmation: ''
            }
            this.loginForm.username = res.data.phone
          } else {
            this.$notify.error({
              title: '错误',
              message: res.data.message,
              showClose: false
            })
          }
        }
      })
    },

    async getCode () {
      let mobile = this.registerForm.phone || null
      if (!mobile) {
        this.$notify.warning({
          title: '警告',
          message: '请输入正确的手机号',
          showClose: false
        })
      }

      // 检测手机号是否已注册
      // http://192.168.1.8:4001/web/user/checkphone/13800138000
      let res = await api.checkMobile(mobile)
      if (res.status === 200) {
        if (res.data.success) {
          this.$notify.warning({
            title: '提示',
            message: '您输入的手机号已注册<br />如您密码丢失，请在登录界面点击<br />“忘记密码”',
            dangerouslyUseHTMLString: true
          })

          return
        }
      }

      // verfycode?phone=13426294841
      let ret = await api.getCode(mobile)

      // let me = this
      this.isclickGetcode = true
      this.countDown = 59

      if (ret.status === 200) {
        this.isclickGetcode = true
        this.regularMobile = false

        this.setInterval_ = setInterval(() => {
          this.countDown--

          if (this.countDown === 0) {
            clearInterval(this.setInterval_)

            this.countDown = 60
            this.isclickGetcode = false
            this.regularMobile = true

            return false
          }
        }, 1000)
      }
    },

    forgetPassword () {
      this.isforget = true
      this.activeName = 'register'
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
    .logo {
      font-size: 60px;
      color: #409EFF;
      margin-top: 10%;
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
