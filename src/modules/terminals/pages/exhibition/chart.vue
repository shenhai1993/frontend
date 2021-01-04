<template>
  <div class="chart">
    <p class="p-t-20 p-b-20">曲线图</p>

    <div class="m-b-20">
      <p class="p-t-10">开机率(七日)曲线图</p>
      <div id="bootRateWeek"></div>
    </div>

    <div class="m-b-20">
      <p class="p-t-10">开机率(年)曲线图</p>
      <div id="bootRateMonth"></div>
    </div>

  </div>
</template>

<script>
import { Chart } from 'g2'
import TerminalGroup from '../../static/js/TerminalGroup.js'

export default {
  async mounted () {
    let self = this
    let chartData = await TerminalGroup.bootrate()
    // console.log(chartData)
    if (chartData.status === 200) {
      self.echartMonth = chartData.data.echartMonth
      self.echartDate = chartData.data.echartDate
    }

    let chartMonth = new Chart({
      id: 'bootRateMonth',
      forceFit: true,
      height: 300
    })

    chartMonth.source(self.echartMonth, {
      'month': {
        type: 'cat',
        alias: '月份',
        range: [0, 1]
        // values: [
        //   '一月', '二月', '三月', '四月', '五月', '六月',
        //   '七月', '八月', '九月', '十月', '十一月', '十二月']
      },
      'bootrate': {
        alias: '开机率',
        formatter: function (val) {
          return (Number(val) * 100) + '%'
        }
      }
    })

    chartMonth.line().position('month*bootrate').size(2)
    chartMonth.render()

    let chartWeek = new Chart({
      id: 'bootRateWeek',
      forceFit: true,
      height: 300
    })

    chartWeek.source(self.echartDate, {
      date: {
        type: 'cat',
        range: [0, 1],
        alias: '近七日'
      },

      bootrate: {
        alias: '开机率',
        formatter: function (val) {
          return (Number(val) * 100) + '%'
        }
      }
    })

    chartWeek.line().position('date*bootrate').size(2)
    chartWeek.render()
  },

  data () {
    return {
      echartMonth: [],
      echartDate: []
    }
  }
}
</script>

<style lang="scss" scoped>
div.chart {
  > p {
    font-size: 16px;
  }
  > div {
    border: 1px solid #E6EBF5;
    p {
      font-size: 14px;
      text-align: center;
    }
  }
}
</style>




