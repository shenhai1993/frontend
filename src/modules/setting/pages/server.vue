<template>
  <div class="parentConent">
    <!-- header -->
    <headerbar>
      <span slot='submenuName'>服务器</span>
    </headerbar>
    <!-- container -->
    <div class="templateContainer">
      <!-- 按钮区 -->
      <div class="btn-context">
        <refresh-button v-on:refresh="refresh"></refresh-button>
        <el-tooltip class="item" effect="dark" content="保存" placement="bottom">
          <el-button @click="saveServerList"><i class="fa fa-floppy-o"></i></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="点击下载激活文件" placement="bottom">
          <el-button @click="saveActivationfile"><i class="el-icon-download"></i></el-button>
        </el-tooltip>
        <iframe id="downloadFile" style="display:none"></iframe>
      </div>
      <div v-loading="loading">
        <!-- 接口服务器(终端) -->
        <div class="el-form-item">
          <label class="el-form-item__label" style="width: 120px;">接口服务器：</label>
          <div class="el-form-item__content" style="margin-left: 120px;">
            <div class="el-col el-col-9">
              <el-input v-model="form.interface.host" type="text" size="medium">
                <template slot="prepend">https://</template>
              </el-input>
            </div>
            <div class="line">端口：</div>
            <div class="el-col el-col-6">
              <el-input-number v-model="form.interface.port" size="medium" controls-position="right" :min="1"></el-input-number>
            </div>
            <el-tooltip class="item" effect="dark" content="测试服务器连通性" placement="bottom">
              <el-button @click='testServer("interface")'><i class="fa fa-stethoscope"></i></el-button>
            </el-tooltip>
          </div>
        </div>

        <!-- 文件服务器(下载或CDN) -->
        <div class="el-form-item">
          <label class="el-form-item__label" style="width: 120px;">文件服务器：</label>
          <div class="el-form-item__content" style="margin-left: 120px;">
            <div class="el-col el-col-9">
              <el-input v-model="form.file.host" type="text" size="medium">
                <template slot="prepend">https://</template>
              </el-input>
            </div>
            <div class="line">端口：</div>
            <div class="el-col el-col-6">
              <el-input-number v-model="form.file.port" size="medium" controls-position="right" :min="1">
              </el-input-number>
            </div>
            <el-tooltip class="item" effect="dark" content="测试服务器连通性" placement="bottom">
              <el-button @click='testServer("file")'><i class="fa fa-stethoscope"></i></el-button>
            </el-tooltip>
          </div>
        </div>

        <!-- 通讯服务(messaged) -->
        <div class="el-form-item">
          <label class="el-form-item__label" style="width: 120px;">通讯服务：</label>
          <div class="el-form-item__content" style="margin-left: 120px;">
            <div class="el-col el-col-9">
              <el-input v-model="form.messaged.host" type="text" size="medium">
                <template slot="prepend">&nbsp;tcp://</template>
              </el-input>
            </div>
            <div class="line">端口：</div>
            <div class="el-col el-col-6">
              <el-input-number v-model="form.messaged.port" size="medium" controls-position="right" :min="1"></el-input-number>
            </div>
            <el-tooltip class="item" effect="dark" content="测试服务器连通性" placement="bottom">
              <el-button @click='testServer("messaged")'><i class="fa fa-stethoscope"></i></el-button>
            </el-tooltip>
          </div>
        </div>

        <!-- 消息服务器(messaged) -->
        <div class="el-form-item">
          <label class="el-form-item__label" style="width: 120px;">消息服务器：</label>
          <div class="el-form-item__content" style="margin-left: 120px;">
            <div class="el-col el-col-9">
              <el-input v-model="form.mqtt.host" type="text" size="medium">
                <template slot="prepend">&nbsp;mqtt://</template>
              </el-input>
            </div>
            <div class="line">端口：</div>
            <div class="el-col el-col-6">
              <el-input-number v-model="form.mqtt.port" size="medium" controls-position="right" :min="1"></el-input-number>
            </div>
            <el-tooltip class="item" effect="dark" content="测试服务器连通性" placement="bottom">
              <el-button @click='testServer("mqtt")'><i class="fa fa-stethoscope"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="修改服务器用户名密码" placement="bottom">
              <el-button @click="openEditDialog"><i class="el-icon-edit"></i></el-button>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>

    <el-dialog title="服务器编辑" :visible="showEditWindow" width="500px" @close="cancelEditDialog('editUser')">
      <el-form :model="newUser" :rules="rules" label-width="80px" ref="editUser">
        <el-form-item label="用户名" prop="username">
          <el-input v-focus autofocus v-model="newUser.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="newUser.password" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('editUser')">保存</el-button>
        <el-button @click="cancelEditDialog('editUser')">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import RefreshButton from '@/components/RefreshButton'
import headerbar from '@/components/HeaderBar'
import { mapState, mapMutations, mapActions } from 'vuex'
import { copy } from '@static/js/utils/utils'
import http from '../../../../static/js/utils/http'
import $ from 'jquery'

export default {
  components: {
    RefreshButton, headerbar
  },

  data () {
    let validatorName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('登录名不能为空'))
      }
      callback()
    }

    let validatorPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('密码不能为空'))
      } else if (value.length < 6) {
        callback(new Error('密码不能少于六位'))
      }
      callback()
    }
    return {
      baseUrl: process.env.API_BASE, // 请求基础地址
      showEditWindow: false,
      rules: {
        name: [{required: true, validator: validatorName, trigger: 'blur'}],
        password: [{validator: validatorPassword, tigger: 'blur'}]
      },
      form: {
        interface: {
          host: '',
          port: ''
        },
        file: {
          host: '',
          port: ''
        },
        messaged: {
          host: '',
          port: ''
        },
        mqtt: {
          host: '',
          port: '',
          username: '',
          password: ''
        }
      },
      newUser: {}
    }
  },

  computed: {
    ...mapState({
      serverList: state => state.setting.serverList,
      loading: state => state.setting.loading
    })
  },

  methods: {
    ...mapActions([
      'getServerList'
    ]),

    ...mapMutations([
      'UPDATE_LOADING_STATUS'
    ]),

    refresh () {
      this.getServerList()
    },

    saveServerList () {
      this.UPDATE_LOADING_STATUS(true)
      let that = this
      http.put('/server/settings', that.form)
      .then(res => {
        if (res.data.success === true) {
          this.$notify({
            title: '成功',
            type: 'success',
            message: '修改保存成功！'
          })
        }
        setTimeout(() => {
         this.UPDATE_LOADING_STATUS(false)
        }, 300)
      })
      .catch(err => {
        console.log(err)
        this.UPDATE_LOADING_STATUS(false)
      })
    },

    saveActivationfile () {
      const fileEle = document.getElementById('downloadFile')
      //fileEle.src = '/bank/server/activationfile'
      fileEle.src = `${this.baseUrl}server/activationfile`
    },

    testServer (type) {
      this.UPDATE_LOADING_STATUS(true)
      let params = {}
      if (type === 'interface') {
        $.extend(true, params, this.form.interface, {method: 'http'})
      } else if (type === 'file') {
        params = $.extend(true, {}, this.form.file, {method: 'http'})
      } else if (type === 'messaged') {
        params = $.extend(true, {}, this.form.messaged, {method: 'tcp'})
      } else if (type === 'mqtt') {
        params = $.extend(true, {}, this.form.mqtt, {method: 'tcp'})
      }
      http.post('/server/test', params)
        .then(res => {
          if (res.data.success) {
            this.$notify({
              title: '成功',
              type: 'success',
              message: (type === 'interface' ? '接口' : type === 'messaged' ? '通讯' : type === 'file' ? '文件' : '消息') + '服务器已联通'
            })
          }
          this.UPDATE_LOADING_STATUS(false)
        })
        .catch(err => {
          console.log(err)
          this.UPDATE_LOADING_STATUS(false)
        })
    },

    openEditDialog () {
      this.showEditWindow = true
      this.newUser =  $.extend(true, {}, this.form.mqtt)
    },

    cancelEditDialog (formName) {
      this.showEditWindow = false
      this.$refs[formName].resetFields()
      this.newUser =  $.extend(true, {}, this.form.mqtt)
    },

    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.form.mqtt.username = this.newUser.username
          this.form.mqtt.password = this.newUser.password
          this.saveServerList()
          this.showEditWindow = false
        } else {
          return false
        }
      })
    }
  },

  mounted () {
    this.getServerList()
  },

  watch: {
    serverList: {
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
.templateContainer .el-form-item {
  width: 700px !important;
}

.special-width.el-form-item {
  width: 30% !important;
}
.el-form-item__content > div.line {
  text-align: right;
  width: 80px;
  display: inline-block;
  float: left;
}
.tabPane-txt {
  margin-left: 120px;
  margin: 20px 0 10px 10px;
  font-size: 14px;
  color: #606266;
}
.el-input-number--medium {
  width: 130px;
}
</style>
