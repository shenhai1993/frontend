<template>
  <el-dialog
    @close="closeWeekTimeDialog"
    :visible="showWeekTimeDialog"
    title="生效时段设置"
    append-to-body
    width="500px"
    center>
    <el-form :model="{timeArr}" size="mini" label-width="123px">
      <el-form-item
        v-for="(item, index) in timeArr"
        prop="expiry_time"
        :label="'星期' + weekArr[index] + '：'"
        :key="index">
        <el-time-select
          style="width: 30%;"
          placeholder="开始时间"
          v-model="item.startTime"
          :picker-options="{
            start: '00:00',
            step: '00:30',
            end: '23:59',
            maxTime: item.endTime
          }"
          @change="timeChange"
          :clearable="false">
        </el-time-select>
        <el-time-select
          style="width: 30%;"
          placeholder="结束时间"
          v-model="item.endTime"
          :picker-options="{
            start: '00:00',
            step: '00:30',
            end: '23:59',
            minTime: item.startTime
          }"
          @change="timeChange"
          :clearable="false">
        </el-time-select>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="submitWeekTimeDialog" type="primary">确 定</el-button>
      <el-button @click="closeWeekTimeDialog">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      showWeekTimeDialog: this.show,
      timeArr: this.timeArray,
      weekArr: ['日', '一', '二', '三', '四', '五', '六']
    }
  },

  props: {
    show: {
      type: Boolean
    },

    timeArray: {
      type: Array
    }
  },

  created () {

  },

  methods: {
    submitWeekTimeDialog () {
      this.showWeekTimeDialog = false
      this.$emit('submitWeekTimeDialog', this.timeArr)
    },

    closeWeekTimeDialog () {
      this.showWeekTimeDialog = false
      this.$emit('cancelWeekTimeDialog')
    },

    timeChange () {

    }
  }
}
</script>

<style>
</style>
