<template>
  <div class="parentConent">
    <!-- header -->
    <headerbar>
      <span slot='submenuName'>审核</span>
    </headerbar>
    <!-- container -->
    <div class="templateContainer">
      <!-- 按钮区 -->
      <div class="btn-context">
        <refresh-button v-on:refresh="refresh"></refresh-button>
        <el-tooltip class="item" effect="dark" content="保存" placement="bottom">
          <el-button @click="saveExamineList"><i class="fa fa-floppy-o"></i></el-button>
        </el-tooltip>
      </div>
      <!-- <div v-if="JSON.stringify(form) !== '{}'"> -->
        <el-form ref="form" :model="form" label-width="80px" v-loading="loading">
          <el-form-item v-if="elementAuth" label="素材：">
            <el-radio-group v-model="form.element.status">
              <el-radio :label="1">开</el-radio>
              <el-radio :label="0">关</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="playlistAuth" label="播出单：">
            <el-radio-group v-model="form.playlist.status">
              <el-radio :label="1">开</el-radio>
              <el-radio :label="0">关</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="marqueesAuth" label="跑马灯：">
            <el-radio-group v-model="form.marquee.status">
              <el-radio :label="1">开</el-radio>
              <el-radio :label="0">关</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      <!-- </div> -->
    </div>
  </div>
</template>

<script>
  import RefreshButton from '@/components/RefreshButton'
  import headerbar from '@/components/HeaderBar'
  import { mapState, mapMutations, mapActions } from 'vuex'
  import { copy } from '@static/js/utils/utils'
  import http from '../../../../static/js/utils/http'
  import { Notification } from 'element-ui'
  import VueCookie from "vue-cookies"

  export default {
    components: {
      RefreshButton, headerbar
    },

    data () {
      return {
        form: {
          marquee: {
            status: ''
          },
          playlist: {
            status: ''
          },
          element: {
            status: ''
          }
        },
        elementAuth : false,
        playlistAuth : false,
        marqueesAuth : false
      }
    },

    methods: {
      ...mapActions([
        'getExamineList'
      ]),

      refresh () {
        this.getExamineList()
      },

      saveExamineList () {
        let that = this
        http.put('/audit/settings', that.form)
        .then(res => {
          if (res.status === 200) {
            // Notification({
            //   type: 'success',
            //   duration: 5000,
            //   title: '保存成功！'
            // })
            this.$notify({
              title: '成功',
              type: 'success',
              message: '修改保存成功！'
            })
            return 'ok'
          }
        })
        .catch(err => {
          console.log(err)
        })
      }
    },

    mounted () {
      this.getExamineList()
      let objAuth = VueCookie.get('authUser')
      let authUser = (typeof objAuth === 'string') ? JSON.parse(objAuth) : objAuth
      this.elementAuth = authUser.permission_names.includes('素材管理')
      this.playlistAuth = authUser.permission_names.includes('播出单管理')
      this.marqueesAuth = authUser.permission_names.includes('跑马灯管理')
    },

    computed: {
      ...mapState({
        examineList: state => state.setting.examineList,
        loading: state => state.setting.loading
      })
    },

    watch: {
      examineList: {
        handler( n, o ) {
          this.form = copy({}, n)
        },deep:true
      }
    }
  }
</script>

<style scoped>
  .btn-context {
    margin: 0 0 30px;
  }
</style>
