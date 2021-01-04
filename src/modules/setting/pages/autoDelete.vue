<template>
  <div class="parentConent">
    <!-- header -->
    <headerbar>
      <span slot='submenuName'>自动删除</span>
    </headerbar>
    <!-- container -->
    <div class="templateContainer">
      <!-- 按钮区 -->
      <div class="btn-context">
        <refresh-button v-on:refresh="refresh"></refresh-button>
        <el-tooltip class="item" effect="dark" content="保存" placement="bottom">
          <el-button @click="saveAutoDeleteList"><i class="fa fa-floppy-o"></i></el-button>
        </el-tooltip>
      </div>
      <div v-loading="loading">
        <div class="el-form-item">
          <label class="el-form-item__label" style="width: 130px;">过期播出单：</label>
          <div class="el-form-item__content" style="margin-left: 130px;">
            <div class="el-col el-col-11">
              <el-select v-model="form.playlist" placeholder="请选择" size="medium">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="el-form-item">
          <label class="el-form-item__label" style="width: 130px;">过期跑马灯：</label>
          <div class="el-form-item__content" style="margin-left: 130px;">
            <div class="el-col el-col-11">
              <el-select v-model="form.marquee" placeholder="请选择" size="medium">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="el-form-item">
          <label class="el-form-item__label" style="width: 130px;">过期操作日志：</label>
          <div class="el-form-item__content" style="margin-left: 130px;">
            <div class="el-col el-col-11">
              <el-select v-model="form.log" placeholder="请选择" size="medium">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import RefreshButton from '@/components/RefreshButton'
  import headerbar from '@/components/HeaderBar'
  import { mapState, mapMutations, mapActions } from 'vuex'
  import { copy } from '@static/js/utils/utils'
  import http from '../../../../static/js/utils/http'

  export default {
    components: {
      RefreshButton, headerbar
    },
    data () {
      return {
        form: {
          playlist: '',
          marquee: '',
          log: ''
        },
        options: [{
          value: 10,
          label: '十天'
        }, {
          value: 15,
          label: '半个月'
        }, {
          value: 30,
          label: '一个月'
        }, {
          value: 0,
          label: '不删除'
        }]
      }
    },

    computed: {
      ...mapState({
        autoDeleteList: state => state.setting.autoDeleteList,
        loading: state => state.setting.loading
      })
    },

    mounted () {
      this.getAutoDeleteList()
    },

    methods: {
      ...mapActions([
        'getAutoDeleteList'
      ]),

      refresh () {
        this.getAutoDeleteList()
      },

      saveAutoDeleteList () {
        let that = this
        http.put('/autodelete', that.form)
        .then(res => {
          if (res.status === 200) {
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

    watch: {
      autoDeleteList: {
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
  .el-form-item__content > div.line {
    text-align: right;
  }
  .tabPane-txt {
    margin-left: 120px;
    margin: 20px 0 10px 10px;
    font-size: 14px;
    color: #606266;
  }
</style>
