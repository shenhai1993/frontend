<template>
  <div class="text-center f-18" id="logout">
    <div class="logo text-center">
      <!-- <img src="../../static/images/eshow.png" /> -->
    </div>
    <div v-if="islogout">
      <div class="p-t-30">
        <span>您已注销，请您重新</span>
        <el-button type="text"
                   @click="login"
                   class="loginButton">
          登录
        </el-button>
        <span>！</span>
      </div>
      <div class="p-t-15">
        <span>{{ countdown }} 秒后自动跳转到登录界面</span>
      </div>
    </div>
    <div v-else>
      正在注销，请稍后!
    </div>
  </div>
</template>

<script>
import api from '../../../../static/js/api'
import {mapState, mapMutations} from 'vuex'

export default {
  data () {
    return {
      timer: null,
      countdown: 5,
      islogout: false
    }
  },

  computed: {
    ...mapState ({
      originState: state => state.originState
    })
  },

  mounted () {
    (async () => {
      this.logout()
      this.timer = setInterval(() => {
        --this.countdown
      }, 1000)
    })()
  },
  watch: {
    countdown: function (newV, oldV) {
      if (newV === -1) {
        this.login()
      }
    }
  },

  methods: {
    ...mapMutations([
      'RESET'
    ]),
    logout () {
      api.logout()
        .then(res => {
          if (res.success) {
            console.log(this.$cookies.keys())
            this.islogout = true
            this.$cookies.remove('authUser')
          }
        })
        .catch(error => {
          console.log(error)
        })
    },

    login () {
      if (!this.islogout) return

      clearInterval(this.timer)
      this.$router.push('/login')
      this.RESET(this.originState)
    }
  }
}
</script>

<style lang="scss" scoped>
  #logout {
    color: #C0C4CC;
    padding-top: 60px;
    a {
      color: #409EFF;
      size: 30px;
      &:hover {
        color: #66b1ff;
      }
    }
  }

  .logo {
    font-size: 60px;
    color: #409EFF;
    margin-top: 10%;
  }
  .loginButton {
    font-size: 18px;
  }
</style>
