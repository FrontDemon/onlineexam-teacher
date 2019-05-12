<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
import { mapGetters } from 'vuex'
import { reqGetChartData } from '@/api/student'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    }
  },
  data() {
    return {
      titleText: '学生成绩信息图表',
      chart: null,
      snoData: [],
      singleData: [],
      multipleData: [],
      judgeData: [],
      fillData: [],
      scoreData: [],
      timeUsedData: [],
      paperInfo: {}
    }
  },
  computed: {
    ...mapGetters([
      'paperId',
      'device'
    ])
  },
  watch: {
    paperId(newValue) {
      this.getChartData(() => {
        if (!this.snoData.length) {
          this.titleText = '该试卷暂无人参加考试'
        } else {
          this.titleText = `${this.paperInfo.paperName}(总分：${this.paperInfo.totalScore}分，考试时长：${this.paperInfo.paperDuration / 60}分钟，难度系数：${this.paperInfo.paperDifficulty})`
        }
        this.chart.clear()
        this.initChart()
      })
    }
  },
  mounted() {
    this.getChartData(() => {
      this.titleText = `${this.paperInfo.paperName}(总分：${this.paperInfo.totalScore}分，考试时长：${this.paperInfo.paperDuration / 60}分钟，难度系数：${this.paperInfo.paperDifficulty})`
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    async getChartData(callback) {
      const result = await reqGetChartData(this.paperId)
      if (result.statu === 0) {
        this.snoData = result.data.snoData
        this.singleData = result.data.singleData
        this.multipleData = result.data.multipleData
        this.judgeData = result.data.judgeData
        this.fillData = result.data.fillData
        this.scoreData = result.data.scoreData
        this.timeUsedData = result.data.timeUsedData
        this.paperInfo = result.data.paperInfo
        callback && callback()
      } else {
        this.$message({
          message: result.msg,
          type: 'error'
        })
      }
    },
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      this.chart.setOption({
        backgroundColor: '#344b58',
        title: {
          text: this.titleText,
          x: '20',
          top: '20',
          textStyle: {
            color: '#fff',
            fontSize: this.device === 'desktop' ? '22' : '9'
          },
          subtextStyle: {
            color: '#90979c',
            fontSize: '16'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            textStyle: {
              color: '#fff'
            }
          }
        },
        grid: {
          left: this.device === 'desktop' ? '5%' : '10%',
          right: '5%',
          borderWidth: 0,
          top: 150,
          bottom: 95,
          textStyle: {
            color: '#fff'
          }
        },
        legend: {
          x: '5%',
          top: '10%',
          textStyle: {
            color: '#90979c'
          },
          data: ['单选题得分', '多选题得分', '判断题得分', '填空题得分', '总分', '花费时间（秒）']
        },
        calculable: true,
        xAxis: [{
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitArea: {
            show: false
          },
          axisLabel: {
            interval: 0,
            rotate: this.device === 'desktop' ? -8 : -16 // 让坐标值旋转一定的角度
          },
          data: this.snoData
        }],
        yAxis: [{
          type: 'value',
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0
          },
          splitArea: {
            show: false
          }
        }],
        dataZoom: [{
          show: true,
          height: 30,
          xAxisIndex: [
            0
          ],
          bottom: 30,
          start: 10,
          end: 80,
          handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
          handleSize: '110%',
          handleStyle: {
            color: '#d3dee5'

          },
          textStyle: {
            color: '#fff' },
          borderColor: '#90979c'

        }, {
          type: 'inside',
          show: true,
          height: 15,
          start: 1,
          end: 35
        }],
        series: [
          {
            name: '单选题得分',
            type: 'bar',
            stack: 'total',
            barMaxWidth: 35,
            barGap: '10%',
            itemStyle: {
              normal: {
                color: 'rgba(255,144,128,1)',
                label: {
                  show: true,
                  textStyle: {
                    color: '#fff'
                  },
                  position: 'insideTop',
                  formatter(p) {
                    return p.value > 0 ? p.value : ''
                  }
                }
              }
            },
            data: this.singleData
          },

          {
            name: '多选题得分',
            type: 'bar',
            stack: 'total',
            itemStyle: {
              normal: {
                color: 'rgba(0,191,183,1)',
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: 'top',
                  formatter(p) {
                    return p.value > 0 ? p.value : ''
                  }
                }
              }
            },
            data: this.multipleData
          },

          {
            name: '判断题得分',
            type: 'bar',
            stack: 'total',
            itemStyle: {
              normal: {
                color: 'rgba(100,91,183,1)',
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: 'top',
                  formatter(p) {
                    return p.value > 0 ? p.value : ''
                  }
                }
              }
            },
            data: this.judgeData
          },

          {
            name: '填空题得分',
            type: 'bar',
            stack: 'total',
            itemStyle: {
              normal: {
                color: 'rgba(99, 194, 255, 1)',
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: 'top',
                  formatter(p) {
                    return p.value > 0 ? p.value : ''
                  }
                }
              }
            },
            data: this.fillData
          },

          {
            name: '总分',
            type: 'line',
            stack: 'total',
            symbolSize: 10,
            symbol: 'circle',
            itemStyle: {
              normal: {
                color: 'rgba(252,230,48,1)',
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: 'top',
                  formatter(p) {
                    return p.value > 0 ? p.value : ''
                  }
                }
              }
            },
            data: this.scoreData
          },

          {
            name: '花费时间（秒）',
            type: 'line',
            stack: 'total',
            symbolSize: 10,
            symbol: 'circle',
            itemStyle: {
              normal: {
                color: 'rgba(152,230,48,1)',
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: 'top',
                  formatter(p) {
                    return p.value > 0 ? p.value : ''
                  }
                }
              }
            },
            data: this.timeUsedData
          }
        ]
      })
    }
  }
}
</script>
