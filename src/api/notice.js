import ajax from '@/config/ajax'
const BASE_URL = process.env.BASE_API

// 获取全部公告信息
export const reqGetNoticesList = () => ajax(BASE_URL + '/getNoticesList')
// 获取搜素公告信息
export const reqSearchNoticesList = (noticeContent, teaName) => ajax(BASE_URL + '/searchNoticesList', { noticeContent, teaName })
// 请求添加公告信息
export const reqInsertNoticeInfo = (temp) => ajax(BASE_URL + '/insertNoticeInfo', temp, 'POST')
// 请求更新公告内容
export const reqUpdateNoticeInfo = (row) => ajax(BASE_URL + '/updateNoticeInfo', row, 'POST')
// 请求删除公告
export const reqDeleteNotice = (noticeId) => ajax(BASE_URL + '/deleteNotice', { noticeId }, 'POST')
