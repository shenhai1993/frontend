<template>
  <div class="playbill-create">
    <el-dialog :title="title" :visible="showPlaybillEdit" @close="cancel">
    <!-- 第一步 -->
      <el-form v-if="step === 1" :model="formData" ref="marqueeForm" :rules="rules">
        <el-form-item label="直播流名称">
          <el-input></el-input>
        </el-form-item>
        <el-form-item prop="date" label="开始日期">
          <el-date-picker type="date" v-model="formData.date" :disabled="setType"
          value-format="yyyy-mm-dd"></el-date-picker>
        </el-form-item>
        <el-form-item prop="playingTime" label="开始时间">
          <el-time-select v-model="formData.playingTime" :disabled="setType"   :picker-options="{
            start: '00:00',
            step: '00:15',
            end: '24:00'
          }"></el-time-select>
        </el-form-item>
        <el-form-item label="推流服务器">
          <el-select v-model="formData.speed">
            <el-option v-for="(item, index) in speed" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="formData.content" type="textarea" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <!-- 第二步 -->
      <material-arrangement v-if="step === 2"></material-arrangement>
      <!-- 按钮 -->
      <div class="dialog-footer" slot="footer">
        <el-button>上一步</el-button>
        <el-button>下一步</el-button>
        <el-button>保存</el-button>
        <el-button>取消</el-button>
      </div>


    </el-dialog>
  </div>
</template>

<script>
import DialogButton from '@/components/DialogButton'
import {mapState, mapMutations} from 'vuex'
// import GroupPanel from '@/modules/group/components/group'
import MaterialArrangement from './MaterialArrangement'

const TYPE_CREATE = 1
export default {
  components: {
    DialogButton, MaterialArrangement
  },

  props: {
    title: {
      type: String
    },
    playbill: {
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
    return {
      speed: ['慢', '适中', '快'],
      formData: {
        playType: '1',
        date: this.$moment().format('YYYY-MM-DD'),
        playingTime: '8:00',
        playbackLength: 1000,
        intervalTime: 10,
        speed: '适中'
      },
      rules: {
        date: [{require: true, message: '请录入日期'}],
        playingTime: [{require: true, message: '请录入播出时间'}],
        playbackLength: [{type: 'number', require: true, message: '请录入播放时长'}]
      },

      step: 2
    }
  },

  computed: {
    ...mapState({
      showPlaybillEdit: state => state.playbill.showPlaybillEdit
    }),

    setType () {
      return this.formData.playType !== "1"
    }
  },

  methods: {
    ...mapMutations([
      'SHOW_PLAYBILL_EDIT'
    ]),

    cancel () {
      this.SHOW_PLAYBILL_EDIT(false)
    },

    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.type === TYPE_CREATE) {
            this._createPlaybill()
          } else {
            this._editPlaybill()
          }
        } else {
          return false
        }
      })
    },

    getChecked (checked) {
      console.log(`checked:==>`)
      console.log(checked)
    },

    _initFormData () {
      console.log(`this.$refs.marqueeForm:==>`)
      console.log(this.$refs.marqueeForm)
      this.$refs.marqueeForm.resetFields()
      if (this.playbill) {
        this.formData.date = Object.assign({}, this.playbill.date)
      }
      console.log(`this.formData:==>`)
      console.log(this.formData)
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

<style lang="scss" scoped>

</style>
