<template>
  <div>
    <el-table class="filelist-table"
      height="260px"
      ref="datatable"
      :data="tableData"
      >
      <el-table-column class-name="pointer" type="index" width="40"></el-table-column>
      <el-table-column class-name="pointer" label="文件名" width="106" :show-overflow-tooltip= "true">
        <template slot-scope="scope">
          <div v-if="scope.row.content">{{scope.row.content}}</div>
          <div v-else-if="scope.row.name">{{scope.row.name}}</div>
          <div v-else>{{scope.row.text}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="time"
        label="时长"
        width="80"
      >
        <template slot-scope="scope">
          <el-input :disabled="scope.row.type === 'video' || scope.row.type === 'tv' || showMode != 0" class="p10-lr" size="small" @blur="updateDuration(scope)" v-model.number="scope.row.seconds" oninput = "value=value.replace(/[^\d]/g,'')"></el-input>
        </template>
      </el-table-column>
      <el-table-column width="72">
        <template slot-scope="scope">
          <el-button class="remove-btn"
          :disabled="showMode == 0"
           @click="setContent(scope.$index)"
           v-if="activeRegionType=='image'"
           type="primary" size="mini" icon="el-icon-edit" circle></el-button>
          <el-button class="remove-btn" @click="removeFile(scope.$index)" type="danger" size="mini" icon="el-icon-delete" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 内容设置弹框 -->
    <el-dialog @close="closeSetContent" :visible="showSetContent" width="490px" title="内容设置">
      <el-form ref="form" :rules="rules" :model="form" label-width="100px">
        <el-form-item prop="contentType" label="选项">
          <el-radio-group v-model="form.contentType" @change="changeContentType">
            <el-radio :label="0">无响应</el-radio>
            <el-radio :label="1">指向内容</el-radio>
            <el-radio :label="2">激活APK</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="hoverShow" label="悬浮显示">
          <el-radio-group v-model="form.hoverShow" :disabled="!(showMode == 1 && (form.contentType == 1 || form.contentType == 2))">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="contentId" label="指向内容">
          <el-select v-model="form.contentId" filterable placeholder="请选择" :disabled = "form.contentType != 1">
            <el-option
              v-for="content in filterAllContents"
              :key="content.id"
              :label="content.name"
              :value="content.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="apk" label="APK">
          <el-input v-model="form.apk" placeholder="请输入APK激活包名" :disabled = "form.contentType != 2"></el-input>
        </el-form-item>
        <el-form-item prop="voiceKey" label="语音关键词">
          <!-- <el-input v-model="form.voiceKey" placeholder="请输入语音关键词" :disabled = "form.contentType == 0"></el-input> -->
          <el-select
            style="width:350px;"
            v-model="form.voiceKey"
            multiple
            filterable
            allow-create
            :disabled = "form.contentType == 0"
            default-first-option
            clearable
            placeholder="请输入语音关键词">
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <dialog-button @clickConfirm="saveContentSet" @clickCancel="closeSetContent" confirmText="保存"></dialog-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Sortable from 'sortablejs'
import http from '@static/js/utils/http'
import DialogButton from '@/components/DialogButton'

export default {
  components: {
    DialogButton
  },

  props:{
    tableData: {
      type: Array,
      default () {
        return []
      }
    },
    columns: {
      type: Array,
      default () {
        return []
      }
    },
    showheader: {
      type: Boolean,
      default: true
    },
    showMode: {
      type: Number,
      default: 1
    },
    activeRegionType: {
      type: String,
      required: true
    }
  },

  data () {
    let validateContentId = (rule, value, callback) => {
      if (this.form.contentType == 1 && value === null) {
        callback(new Error('必须选择一个内容'))
      } else {
        callback()
      }
    }
    let validateApk = (rule, value, callback) => {
      if (this.form.contentType == 2 && value === '') {
        callback(new Error('APK激活包名不能为空'))
      } else {
        callback()
      }
    }
    return {
      allContents: [], // 所有内容列表
      showSetContent: false,
      form: {
        contentType: 0,
        contentId: null,
        apk: '',
        voiceKey: [],
        hoverShow: 0,
      },
      currentId: 0, // 记录当前打开的素材索引
      rules: {
        contentId: [{validator: validateContentId, trigger: ['blur', 'change']}],
        apk: [{validator: validateApk, trigger: 'blur'}],
      }
    }
  },

  computed: {
    data () {
      return this.tableData
    },
    ...mapState({
      selectedTpl: state => state.drugs.selectedTpl
    }),
    filterAllContents() {
        if(this.selectedTpl[0] != undefined) {
          let direction = this.selectedTpl[0].direction
          let ret = this.allContents.filter(c => {
            return c.direction == direction
          })
          return ret
        }
        return []
    }
  },

  methods: {
    removeFile (index) {
      this.$emit('removeFile', index)
    },

    setContent (index) {
      this.showSetContent = true
      let item = this.tableData[index]
      this.currentId = index
      if(item.contentType === undefined) {
        this.form =  {
          contentType: 0,
          contentId: null,
          apk: '',
          voiceKey: [],
          hoverShow: 0,
        }
      }
      else {
        this.form.contentType = item.contentType
        this.form.contentId = item.contentId
        this.form.apk = item.apk
        this.form.voiceKey = item.voiceKey
        this.form.hoverShow = item.hoverShow
      }
    },

    closeSetContent () {
      this.$refs.form.resetFields()
      this.showSetContent = false
    },

    changeContentType (val) {
      this.$refs.form.clearValidate()
    },

    saveContentSet () {
      this.form.apk = this.form.apk ? this.form.apk.trim() : this.form.apk
      this.$refs.form.validate(valid => {
        if (valid) {
          this.tableData[this.currentId].contentType = this.form.contentType
          this.tableData[this.currentId].contentId = this.form.contentId
          this.tableData[this.currentId].apk = this.form.apk
          this.tableData[this.currentId].voiceKey = this.form.voiceKey
          this.tableData[this.currentId].hoverShow = this.form.hoverShow
          this.$emit('sortFiles', this.tableData)
          setTimeout(() => {
            this.showSetContent = false
            this.$notify({
              title: '消息',
              type: 'info',
              message: '设置成功！'
            })
          }, 200);
        }
      })
    },

    updateDuration (scope) {
      this.$emit('updateFiles', scope.row.seconds, scope.$index)
      // this.tableData[scope.$index]
    }

    // timeToSecond (time) {
    //   let reg = /\d{2}/g
    //   let _time = time.match(reg)
    //   _time.reverse()
    //   let seconds = 0
    //   _time.forEach((item, index) => {
    //     seconds += item * Math.pow(60, index)
    //   });
    //   console.log(`seconds:==>`)
    //   console.log(seconds)
    // }
  },

  mounted () {
    let el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
    let sortable = Sortable.create(el, {
      animation: 150,
      delay: 0,
      setData: function (dataTransfer) {
        dataTransfer.setData('Text', '')
        // to avoid Firefox bug
        // Detail see : https://github.com/RubaXa/Sortable/issues/1012
      },
      onEnd: e => {
        const item = this.tableData[e.oldIndex]
        this.tableData.splice(e.oldIndex, 1)
        this.tableData.splice(e.newIndex, 0, item)
        this.$emit('sortFiles', this.tableData)
      }
    })
    http.get('/contents/all')
      .then(res => {
        this.allContents = res.data.message
      })
      .catch(err => {
        console.log(err)
      })
  }
}
</script>

<style lang="scss">
.filelist-table{
  .pointer{
    cursor: pointer;
  }
  .remove-btn{
    padding: 4px;
    margin-left:0px;
  }
  .p10-lr{
    .el-input__inner{
      padding: 0 6px;
      font-size: 12px;
    }
  }
}
</style>
