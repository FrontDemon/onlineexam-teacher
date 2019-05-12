import Vue from 'vue'
import { getNumberPrefix } from '@/utils'
// import moment from 'moment'
import format from 'date-fns/format'
// 自定义过滤器
Vue.filter('date-format', function(value, formatStr = 'YYYY-MM-DD HH:mm:ss') {
  // return moment(value).format(formatStr)
  return format(value, formatStr)
})
// 自定义花费时间格式化
Vue.filter('timeUsed-format', function(value) {
  const hours = getNumberPrefix(parseInt(value / (1000 * 60 * 60) % 24, 10))
  const minutes = getNumberPrefix(parseInt(value / (1000 * 60) % 60, 10))
  const seconds = getNumberPrefix(parseInt(value / 1000 % 60, 10))
  return `${hours}:${minutes}:${seconds}`
})
