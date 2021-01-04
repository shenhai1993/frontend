<template>
  <div>
    <el-form ref="formData" :rules="rules" :model="formData">
      <el-row>
        <el-col :span='20'>
          <el-form-item label="播出单" :label-width="formLabelWidth"
                        prop='name' class="formInput">
            <el-input v-model="formData.name" auto-complete="off"
                      placeholder="请输入播出单名称"></el-input>
          </el-form-item>

          <el-form-item label="播出类型" :label-width="formLabelWidth"
                        prop='type'>
            <el-radio-group v-model="formData.type">
              <el-radio label="0">主播</el-radio>
              <el-radio label="1">定时插播</el-radio>
              <el-radio label="2">垫片</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="起止日期" :label-width="formLabelWidth"
                        prop='date'>
            <el-date-picker v-model="formData.date"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="播出时间段" :label-width="formLabelWidth"
                        prop='time'>
            <el-time-picker is-range
                            v-model="formData.time"
                            range-separator="至"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            placeholder="选择时间范围"
                            format='HH:mm:ss'
                            value-format='HH:mm:ss'
                            :disabled="isallday">
            </el-time-picker>
            <div class="m-t-10">
              <el-checkbox  v-model="isallday">全天播放</el-checkbox>
            </div>
          </el-form-item>
          <el-form-item label="备注" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="formData.description"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  props: ['canNext', 'activeSteps'],

  watch: {
    formData: {
      handler: function (v, ov) {
        this.isbeingWrite = true
        this.putPublishFormData(this.formData)
        if (!this.isbeingWrite) return
        this.$refs.formData.validate((valid) => {
          if (valid) {
            this.$emit('update:canNext', true)
          } else {
            this.$emit('update:canNext', false)
            return false
          }
        })
      },
      deep: true
    },

    activeSteps (v, ov) {
      if (v === 2) {
        if (this.$route.params.id) {
          this.formData.name = this.editItem.name
          this.formData.date = [this.editItem.startdate, this.editItem.enddate]
          this.formData.time = [this.editItem.starttime, this.editItem.endtime]
          this.formData.type = this.editItem.type
        }
        let today = this.$moment().format('YYYY-MM-DD')
        // let tomorrow = this.$moment().add(1, 'days').format('YYYY-MM-DD')
        this.formData.date = [today, today]
        if (this.isallday) {
          this.formData.time = ['00:00:00', '23:59:59']
        } else {
          this.formData.time = ['8:00:00', '20:00:00']
        }
      }
    },

    isallday (v, ov) {
      if (v) {
        this.formData.time = ['00:00:00', '23:59:59']
      } else {
        this.formData.time = ['8:00:00', '20:00:00']
      }
    }
  },

  computed: {
    ...mapState({
      'editItem': state => state.playlist.editItem
    })
  },

  data () {
    return {
      isallday: false,
      formLabelWidth: '120px',
      formData: {
        date: [],
        time: [],
        name: '',
        type: '0'
      },

      isbeingWrite: false,

      rules: {
        name: [
          {required: true, message: '请输入播出单名称'}
        ],

        type: [
          {required: true, message: '请选择播出单类型'}
        ],

        date: [
          {required: true, message: '请选择起始日期'}
        ],

        time: [
          {required: true, message: '请选择起始时间'}
        ]
      }
    }
  },

  mounted () {
  },

  methods: {
    ...mapMutations({
      putPublishFormData: 'PUT_PUBLISH_FORMDATA'
    })
  }
}
</script>

<style lang="scss" scoped>
  .el-textarea {
    width: 350px;
  }
  .formInput {
    width: 470px;
  }
</style>
