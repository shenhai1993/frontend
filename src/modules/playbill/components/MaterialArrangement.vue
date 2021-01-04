<template>
  <div class="material-arrangement">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-table :data="materialList" @row-dblclick="addSelected">
          <el-table-column label="名称" prop="name"></el-table-column>
          <el-table-column label="时长" prop="time"></el-table-column>
          <el-table-column label="次数" prop="times"></el-table-column>
        </el-table>
      </el-col>
      <el-col :span="12">
        <el-table :data="selectedList">
          <el-table-column type="index"></el-table-column>
          <el-table-column label="播放时间" prop="playtime"></el-table-column>
          <el-table-column label="结束时间" prop="endtime"></el-table-column>
          <el-table-column label="播出内容" prop="context"></el-table-column>
          <el-table-column label="时长" prop="time"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      materialList: [
        {
          name: 'a',
          time: '00:06:30',
          times: 0
        },
        {
          name: 'b',
          time: '00:03:13',
          times: 0
        },
        {
          name: 'c',
          time: '00:00:20',
          times: 0
        },
        {
          name: 'd',
          time: '00:05:34',
          times: 0
        }
      ],
      selectedList: [],
      lastTime: '',
      startTime: '07:00:00'
    }
  },

  // props: {
  //   startTime: {
  //     type: String,
  //     required: true
  //   }
  // },

  computed: {
  },

  methods: {
    addSelected (row) {
      console.log(`row:==>`)
      console.log(row)
      this._setPlayingtime(row)
      this.selectedList.push(row)
    },

    _setPlayingtime (row) {
      let time = row.time
      let reg = /\d{2}/g
      let formatTime = time.match(reg)
      console.log(`formatTime:==>`)
      console.log(formatTime)

    },

    _setClock (h, m, s) {
      let clock = this.lastTime
      let reg = /\d{2}/g
      let formatClock = time.match(reg)
      let _s = parseInt(s) + parseInt(formatClock[2])
      let _m = parseInt(m) + parseInt(formatClock[1])
      let _h = parseInt(h) + parseInt(formatClock[0])
      if (_s >= 60) {
        _m++
      }
      _s = _s % 60
      if (_m >= 60) {
        _h++
      }
      _m = _m % 60
      if (_h) {
        _h > 23
        _h = 0
      }

    }
  },

  watch: {
    startTime () {
      this.lastTime = this.startTime
    }
  }
}
</script>
