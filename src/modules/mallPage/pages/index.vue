<template>
  <div class="mall-index" id="mallPage" v-loading="loading">
    <sims-view></sims-view>
  </div>
</template>

<script>
import VueCookie from 'vue-cookies'
import SimsView from '../components/simsView.vue'
import { mallPage } from '../static/js/mallPage.js'
import { mapState, mapMutations, mapActions } from 'vuex'
//import  { MQTT_SERVICE, MQTT_USERNAME, MQTT_PASSWORD } from '../static/js/sysconstant.js'
//import { CryptoData } from '../static/js/crypt.js'

export default {
  components: {
    SimsView
  },

  data () {
    return {
      modelInfo: {
        id: 0,
        deviceid: ''
      }
    }
  },

  computed: {
    ...mapState({
      loading: state => state.mallPage.loading
    })
  },

  mounted () {
    const query = this.$route.query
    this.modelInfo = Object.assign({}, this.modelInfo, query)
    this.$cookies.set('deviceId', this.modelInfo.deviceid)
    console.log(VueCookie.get('deviceId'))
    //this.checkJson()
    this.getTemplate()
    //this.setEncypts()
  },

  methods: {
    ...mapMutations([
      'GET_TEMPLATE_DATA',
      'LOADING_STATUS',
      'SHOW_PAY_CALLBACK',
      'BASE_WH'
    ]),

    ...mapActions([
      'getTemplateData',
      'loadingStatus',
      'payCallbackStatus',
      'setBaseWH'
    ]),

    checkJson () {
      this.getTemplateJson()
    },

    getTemplateJson () {
      this.loadingStatus(true)
      mallPage.getModelShowJson().then(res => {
        console.log(res)
        if (res.data.success) {
          this.loadingStatus(false)
          this.initData(res.data.message)
        } else {
          this.getTemplate()
        }
      }).catch(() => {
        this.getTemplate()
      })
    },

    getTemplate () {
      this.loadingStatus(true)
      mallPage.getModelShow(this.modelInfo.id).then(res => {
        this.loadingStatus(false)
        if (res.data.success) {
          this.initData(res.data.message)
        } else {
          this.$alert(res.data.message, '错误', {
            confirmButtonText: '知道了'
          })
        }
      }).catch(() => {
        this.loadingStatus(false)
        this.$alert('出错啦，请重试！', '错误', {
          confirmButtonText: '知道了'
        })
      })
    },

    initData (val) {
      let wh = JSON.parse(val.sims_wh)
      if (wh === null) {
        wh = [488, 868]
      }
      this.setBaseWH([wh[0], wh[1]])
      const data = JSON.parse(val.item_data)
      this.getTemplateData(data)
    }
    //,

    //setEncypts () {
      //let hash1 = CryptoData.encrypt('200.89')
      //console.log(hash1)  // U2FsdGVkX1+kWBW8RHyMrH0SPXQWqdpVSwIqxDCyikw=
      // let encryptor = new JSEncrypt() // 新建JSEncrypt对象
      // let publicKey = '-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDS6VbgEpOwVc8jXYx/uL6ItMS6\naBPVo8fvw0pd90jLJYvfJcFJdYVFh6JPRdpGhlIrED45VdsktcJvJj0cLNI5ZIZ6\n80aS6JTFe3ScBY4Mi7bLKzBNYtMBtnkAFbMmWlCXV4qzZYg8+xNktY5ClZZCvZzz\nlaU5djtUSoxTLkxcmwIDAQAB\n-----END PUBLIC KEY-----'
      // encryptor.setPublicKey(publicKey) // 设置公钥
      // let rsaPassWord = encryptor.encrypt('liukai') // 对需要加密的数据进行加密
      // console.log(rsaPassWord)
      // let privateKey = '-----BEGIN RSA PRIVATE KEY-----\nMIICXAIBAAKBgQDS6VbgEpOwVc8jXYx/uL6ItMS6aBPVo8fvw0pd90jLJYvfJcFJ\ndYVFh6JPRdpGhlIrED45VdsktcJvJj0cLNI5ZIZ680aS6JTFe3ScBY4Mi7bLKzBN\nYtMBtnkAFbMmWlCXV4qzZYg8+xNktY5ClZZCvZzzlaU5djtUSoxTLkxcmwIDAQAB\nAoGAZT944gZo+bynvH17JhEk/nFxA19VLjj6kSH6AFPmkQcMN2pjeIU/Hhq3k0Cg\nQTzYEy4wAMwzcFME7OC5c14c6GsnOQVEbzT3jA5lNuMnrvb+ehyE0w/O7ah8sSLQ\n3B42GFKkaKiuY2ufsVC4pv6LMn5Sh26ApW332yO0dXZXagECQQDvAWV+n41R9pUp\niB0+ycBvkuE6yjlohc2MqAxdD+EYNgO4jb1F21pZcqasd/SbpiQwVUKk/uxlOvl9\n3dBlcOWbAkEA4eiMv8UiGwBxjBGrz+I/tBq56gcnjvlOkJFyAyxbKaA1C9C51eVv\n39OftI9DqCzcuAYZsCmspb6XEPBIB01VAQJAZVyAQM1Fz+b1p6F0VbaWiDsQjjBJ\nXIyyed6jL6yWWABAX7qs9L1sedbn3OkashAp9N2T4AnFE8GJIdo6kWrp1QJAGOiF\nLFfWDNgdrO393av6jicsPIuRZwhCC1qeEY+AdbR+ZNEczGLB1RIGV+g7830O0ROL\nHYtax+Od0HZN2tBCAQJBANIg+HO5+Qy5hgRO3+uRHERgUQxqHzheLdo5GnoQ/sfT\nsex4mxgze6oq+HldvNWzVjBu9g9417T5WMgyWQ8Unhw=\n-----END RSA PRIVATE KEY-----'
      // encryptor.setPrivateKey(privateKey)
      // let getWord = encryptor.decrypt(rsaPassWord) // 解密
      // console.log(getWord)
    //}

  }
}
</script>

<style lang="scss">
  @import '../static/css/mallPage.scss';
</style>
