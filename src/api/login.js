/*
  与后台交互模块 （依赖已封装的ajax函数）
 */
import ajax from '@/config/ajax'
const BASE_URL = process.env.BASE_API

// 获取胡老师账号密码
export const reqGetTeaHuPsw = (tno) => ajax(BASE_URL + '/getTeaHuPsw', { tno })
// 校验教师登录
export const reqLogin = (tno, teaPsw) => ajax(BASE_URL + '/teacherLogin', { tno, teaPsw }, 'POST')
// 请求退出登录
export const reqLogOut = () => ajax(BASE_URL + '/teacherLogOut')
