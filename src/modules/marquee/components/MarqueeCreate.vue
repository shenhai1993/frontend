<template>
  <div class="marquee-create">
    <el-dialog :title="title" :visible="showEditWindow" width="500px" @close="cancel">
    <!-- 填写内容 -->
      <!-- <el-row type="flex" :gutter="30">
        <el-col :span=12> -->
          <el-form v-show="step === 1" label-width="120px" size="small" :model="formData" ref="marqueeForm" :rules="rules">
            <el-form-item prop="play_type" label="播出类型">
              <el-radio v-model="formData.play_type" :label="1" @change="resetForm">定时插播</el-radio>
              <el-radio v-model="formData.play_type" :label="2" @change="resetForm">按次插播</el-radio>
            </el-form-item>
            <el-form-item prop="startdate" label="播出开始日期">
              <el-date-picker type="date" v-model="formData.startdate"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptionsStart" :disabled="isPlayCount"></el-date-picker>
            </el-form-item>
            <el-form-item prop="enddate" label="播出结束日期">
              <el-date-picker type="date" v-model="formData.enddate"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptionsEnd" :disabled="isPlayCount"></el-date-picker>
            </el-form-item>
            <el-form-item prop="starttime" label="播出开始时间">
              <el-time-picker v-model="formData.starttime" format='HH:mm' value-format='HH:mm'
              :disabled="isPlayCount"
              :picker-options="{
                selectableRange:`00:00:00 -${formData.endtime ? formData.endtime + ':00' : '23:59:00'}`
              }"
              ></el-time-picker>
            </el-form-item>
            <el-form-item prop="endtime" label="播出结束时间">
              <el-time-picker v-model="formData.endtime" value-format="HH:mm" format="HH:mm"
              :disabled="isPlayCount"
              :picker-options="{
                selectableRange:`${formData.starttime ? formData.starttime + ':00' : '00:00:00'}-23:59:00`
              }"
              ></el-time-picker>
            </el-form-item>
            <!-- <el-form-item prop="playbackLength" label="播放时长(秒)">
              <el-input-number v-model="formData.playbackLength" controls-position="right" :min="1"></el-input-number>
            </el-form-item> -->
            <el-form-item label="播放次数">
              <el-input-number v-model="formData.play_count" controls-position="right" :min="1" :disabled="!isPlayCount"></el-input-number>
            </el-form-item>
            <el-form-item label="间隔时间(分钟)">
              <el-input-number v-model="formData.interval" controls-position="right" :min="0"></el-input-number>
            </el-form-item>
            <el-form-item label="跑马灯速度">
              <el-select v-model="formData.speed">
                <el-option v-for="item in speed" :key="item.val" :label="item.label" :value="item.val"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="底部距离">
              <el-input-number v-model="formData.bottom" controls-position="right" :min="0"></el-input-number>
            </el-form-item>
            <el-form-item label="播放语音">
              <el-switch v-model="formData.play_voice"></el-switch>
            </el-form-item>
            <el-form-item prop="content" label="跑马灯内容">
              <el-input :autosize="{minRows:4}" class="w300" v-model="formData.content" type="textarea" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-form>
        <!-- 播放分组 -->
        <el-row v-if="step === 2">
          <el-col :span="14" class="b-r-1">
            <keep-alive>
              <div class="tree-wrapper">
                <group-panel :cascader="true" :strictly="true" :defaultChecked="trees" gtype="trees" @oncheck="getGroups"  :showCheckbox="true"></group-panel>
              </div>
            </keep-alive>
          </el-col>
          <el-col :span="10">
            <tags :tagged="tagged" @changeTags="changeTags"></tags>
          </el-col>
        </el-row>
      <!-- footer -->
      <div class="dialog-footer" slot="footer">
        <el-button @click="cancel">取消</el-button>
        <el-button :disabled="step === 1" @click="prev">上一步</el-button>
        <el-button :disabled="step === 2" @click="next('marqueeForm')" >下一步</el-button>
        <el-button :disabled="!cantSave" @click="save('marqueeForm')" type="primary">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {mapState, mapMutations, mapActions} from 'vuex'
import GroupPanel from '@/modules/group/components/group'
import Tags from '@/modules/terminal/lib/tags'
import http from '@static/js/utils/http'

const TYPE_CREATE = 1
export default {
  components: {
    GroupPanel, Tags
  },

  props: {
    title: {
      type: String,
      default: '创建跑马灯'
    },
    marquee: {
      type: Object
    },
    index: {
      type: Number
    },
    type: {
      type: Number,
      require: true
    }
  },

  data() {
    let validateTime = (rule, value, callback) => {
      if (this.formData.play_type == 1 && !value) {
        let err = '不能为空'
        if(rule.field == 'startdate') {
          err = '请选择开始日期'
        }
        if(rule.field == 'enddate') {
          err = '请选择结束日期'
        }
        if(rule.field == 'starttime') {
          err = '请选择播出开始时间'
        }
        if(rule.field == 'endtime') {
          err = '请选择播出结束时间'
        }
        callback(new Error(err))
      }
      callback()
    }

    return {
      step: 1,
      trees: [],
      cantSave: false,
      tagged: [],
      speed: [
        {label: '慢', val: 2},
        {label: '适中', val: 3},
        {label: '快', val: 4}
      ],
      formData: {
        play_type: 1,
        startdate: this.$moment().format('YYYY-MM-DD'),
        enddate: '',
        starttime: '8:00',
        endtime: '20:00',
        play_count: 1,
        interval: 10,
        speed: 3,
        content: '',
        trees: [],
        tags: [],
        play_voice: false,
        bottom: 0
      },
      pickerOptionsStart: {
        disabledDate: (time) => {
          //return Math.floor(( Date.now() - time.getTime()) / 86400000) > 0 || time.getTime() > new Date(this.formData.enddate)
          return Math.floor(( Date.now() - time.getTime()) / 86400000) > 0 || time.getTime() > new Date(this.formData.enddate + ' 00:00:00 GMT+0800').getTime()
        }
      },
      pickerOptionsEnd: {
        disabledDate: (time) => {
          //return time.getTime() < new Date(this.formData.startdate)
          // bug: 不能创建相同日期的跑马灯
          return time.getTime() < new Date(this.formData.startdate + ' 00:00:00 GMT+0800').getTime()
        }
      },

      rules: {
        startdate: [{ validator: validateTime, trigger: 'blur' }],
        enddate: [{ validator: validateTime, trigger: 'blur' }],
        starttime: [{ validator: validateTime, trigger: 'blur' }],
        endtime: [{ validator: validateTime, trigger: 'blur' }],
        content: [{required: true, message: '请录入跑马灯内容', trigger: 'blur'},
          {  max: 200, message: '长度在 200 个字符', trigger: 'blur' }
        ]
      }
    }
  },

  computed: {
    ...mapState({
      showEditWindow: state => state.marquee.showEditWindow
    }),
    isPlayCount() {
      return this.formData.play_type  == 2;
    }
  },

  methods: {
    ...mapMutations([
      'SHOW_MARQUEE_EDIT'
    ]),

    ...mapActions([
      'editMarquee', 'createMarquee'
    ]),

    date () {
      return this.formData.startdate
    },

    resetForm() {
      this.$refs.marqueeForm.clearValidate()
    },

    cancel () {
      this.$refs.marqueeForm.resetFields()
      this.step = 1
      this.SHOW_MARQUEE_EDIT(false)
    },

    async save (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.type === TYPE_CREATE) {
            this.createMarquee(this.formData).then(() => {
              this.cancel()
            })

          } else {
            this.editMarquee({marquee: this.formData, index: this.index}).then(() => {
              this.cancel()
            })
          }
        } else {
          return false
        }
      })
    },

    next (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.step = 2
          this._initTreesAndTags()
          this.canSave()
        }
      })
    },

    prev () {
      this.step = 1
      this.cantSave = false
    },

    getGroups (checked) {
      this.formData.trees = checked.checked.checkedKeys
      this.canSave()
    },

    canSave () {
      if (this.step === 1) {
        this.cantSave = false
        return
      }
      if (this.formData.trees && this.formData.trees.length > 0
          ||
          this.formData.tags && this.formData.tags.length > 0
        ) {
        this.cantSave = true
      } else {
        this.cantSave = false
      }
    },

    changeTags (tags) {
      this.formData.tags = tags
      this.canSave()
    },

    _initFormData () {
      this.$refs.marqueeForm.resetFields()
      this.formData.play_voice = false
      if (this.marquee) {
        this.formData = Object.assign({}, this.marquee)
        this.formData.play_voice = this.marquee.play_voice ? true : false
      }
      this.canSave()
    },

    _initTreesAndTags () {
      if (this.marquee) {
        let _trees = []
        console.log(this.marquee.trees)
        this.marquee.trees.forEach(tree => {
          _trees.push(tree.id)
        })
        this.trees = _trees
        let _tag = []
        console.log(_trees)
        this.marquee.tagged.forEach(tag => {
          _tag.push(tag.tag_name)
        })
        this.tagged = _tag
        this.formData.trees = this.trees
        this.formData.tags = this.tags
      }
      else { // 连续添加时如无marquee,要清空
        this.formData.trees = []
        this.formData.tags = []
      }
    }
  },

  watch: {
    showEditWindow () {
      this.$nextTick( () => {
        this._initFormData()
      })
    }
  }
}
</script>

<style lang="scss">
.marquee-create{
  .w100{
    width: 100px;
  }
  .w120{
    width: 120px;
  }
  .w300{
    width: 300px;
  }
  .b-r-1{
    border-right: 1px solid #d0d0d0;
  }
  .el-row {
    height: 100%;
    .el-col {
      height: 100%;
    }
  }
  .el-dialog {
    max-height: calc(100% - 15vh - 50px);
    .el-dialog__body {
      // height: calc(100% - 115px);
      overflow: hidden;
    }
  }
}
</style>
