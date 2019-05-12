import ajax from '@/config/ajax'
const BASE_URL = process.env.BASE_API

// 获取全部单选题信息
export const reqGetSingleList = () => ajax(BASE_URL + '/getSingleList')
// 获取搜素单选题信息
export const reqSearchSingleList = (content, langId, composeFlag) => ajax(BASE_URL + '/searchSingleList', { content, langId, composeFlag })
// 删除单选题
export const reqDeleteSingle = (singleId) => ajax(BASE_URL + '/deleteSingle', { singleId }, 'POST')
// 添加单选题题目
export const reqInsertSingleInfo = (temp) => ajax(BASE_URL + '/insertSingleInfo', temp, 'POST')
// 更新单选题题目
export const reqUpdateSingleInfo = (temp) => ajax(BASE_URL + '/updateSingleInfo', temp, 'POST')
// 添加导入单选题Excel文件
export const reqInsertSingleList = (singleList) => ajax(BASE_URL + '/insertSingleList', { singleList }, 'POST')
// ---------------------------------------------------------------------------------------------------------------
// 获取全部多选题信息
export const reqGetMultipleList = () => ajax(BASE_URL + '/getMultipleList')
// 获取搜素多选题信息
export const reqSearchMultipleList = (content, langId, composeFlag) => ajax(BASE_URL + '/searchMultipleList', { content, langId, composeFlag })
// 删除多选题
export const reqDeleteMultiple = (multipleId) => ajax(BASE_URL + '/deleteMultiple', { multipleId }, 'POST')
// 添加多选题题目
export const reqInsertMultipleInfo = (temp) => ajax(BASE_URL + '/insertMultipleInfo', temp, 'POST')
// 更新多选题题目
export const reqUpdateMultipleInfo = (temp) => ajax(BASE_URL + '/updateMultipleInfo', temp, 'POST')
// 添加导入多选题Excel文件
export const reqInsertMultipleList = (multipleList) => ajax(BASE_URL + '/insertMultipleList', { multipleList }, 'POST')
// ---------------------------------------------------------------------------------------------------------------
// 获取全部判断题信息
export const reqGetJudgeList = () => ajax(BASE_URL + '/getJudgeList')
// 获取搜素判断题信息
export const reqSearchJudgeList = (content, langId, composeFlag) => ajax(BASE_URL + '/searchJudgeList', { content, langId, composeFlag })
// 删除判断题
export const reqDeleteJudge = (judgeId) => ajax(BASE_URL + '/deleteJudge', { judgeId }, 'POST')
// 添加判断题题目
export const reqInsertJudgeInfo = (temp) => ajax(BASE_URL + '/insertJudgeInfo', temp, 'POST')
// 更新判断题题目
export const reqUpdateJudgeInfo = (temp) => ajax(BASE_URL + '/updateJudgeInfo', temp, 'POST')
// 添加导入判断题Excel文件
export const reqInsertJudgeList = (judgeList) => ajax(BASE_URL + '/insertJudgeList', { judgeList }, 'POST')
// ---------------------------------------------------------------------------------------------------------------
// 获取全部填空题信息
export const reqGetFillList = () => ajax(BASE_URL + '/getFillList')
// 获取搜素填空题信息
export const reqSearchFillList = (content, langId, composeFlag) => ajax(BASE_URL + '/searchFillList', { content, langId, composeFlag })
// 删除填空题
export const reqDeleteFill = (fillId) => ajax(BASE_URL + '/deleteFill', { fillId }, 'POST')
// 添加填空题题目
export const reqInsertFillInfo = (temp) => ajax(BASE_URL + '/insertFillInfo', temp, 'POST')
// 更新填空题题目
export const reqUpdateFillInfo = (temp) => ajax(BASE_URL + '/updateFillInfo', temp, 'POST')
// 添加导入填空题Excel文件
export const reqInsertFillList = (fillList) => ajax(BASE_URL + '/inserFillList', { fillList }, 'POST')
