<template>
  <div class="myChart" :id="id"  :style="{ width: stringWidth, height: stringHeight }"></div>
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'chart',
  data () {
    return {
      checkedList: []
    }
  },

  props: {
    id: {
      type: String,
      required: true
    },

    title: {
      type: String
    },

    color: {
      type: Array,
      default() {
        // 颜色
        return ['#3398DB']
      }
    },

    chartData: {
      type: Array,
      default () {
        // 图表数据
        return []
      }
    },

    xText: {
      type: String,
      default() {
        // 横轴文本
        return 'xText'
      }
    },

    yText: {
      type: String,
      default() {
        // 纵轴文本
        return 'yText'
      }
    },

    width: {
      type: Number,
      default: 600
    },

    height: {
      type: Number,
      default: 600
    }
  },

  computed: {
    stringWidth: function () {
      return this.width + 'px'
    },

    stringHeight: function () {
      return this.height + 'px'
    },

    xAxisData() {
      return this.chartData.map(function (item) {
        return item[0]
      })
    },

    yAxisData() {
      return this.chartData.map(function (item) {
        return item[1]
      })
    }
  },

  mounted () {
    this.drawChart()
  },

  methods: {
    drawChart () {
      let chart = echarts.init(document.getElementById(this.id))
      chart.setOption(this.getBarOptions())
    },

    getBarOptions () {
      let that = this
      return {
        title: {
          text: this.title ? this.title : '',
          x: "center"
        },
        tooltip : {
          trigger: 'axis'
        },
        color: this.color,
        xAxis: [
          {
            type: "category",
            data: this.xAxisData
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: this.yText,
            type: "bar",
            data: this.yAxisData,
            itemStyle: {
              normal: {
                  // 随机显示
                  //color:function(d){return "#"+Math.floor(Math.random()*(256*256*256-1)).toString(16);}

                  // 定制显示（按顺序）
                  color: function (params) {
                      var colorList = that.color
                      return colorList[params.dataIndex]
                  }
              }
            }
          }
        ]
      }
    }
  },

  watch: {
    chartData: {
      handler (n, o) {
        this.drawChart()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .myChart {
    text-align: center;
    margin: 0 auto;
  }
</style>
