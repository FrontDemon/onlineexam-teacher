
const teacher = {
  state: {
    // 用户信息
    userInfo: {},
    // 学生成绩图表页面选中的paperId
    paperId: 1
  },
  mutations: {
    RECORD_USER_INFO: (state, { userInfo }) => {
      state.userInfo = userInfo
    },
    RESET_USER_INFO: (state) => {
      state.userInfo = {}
    },
    RECORD_PAPERID: (state, { paperId }) => {
      state.paperId = paperId
    },
    RESET_PAPERID: (state) => {
      state.paperId = 1
    }
  },
  actions: {
    // 同步记录用户信息
    recordUserInfo({ commit }, userInfo) {
      commit('RECORD_USER_INFO', { userInfo })
    },
    // 重置用户信息
    resetUserInfo({ commit }) {
      commit('RESET_USER_INFO')
    },
    // 同步记录学生成绩图表页面选中的paperId
    recordPaperId({ commit }, paperId) {
      commit('RECORD_PAPERID', { paperId })
    },
    // 重置学生成绩图表页面选中的paperId
    resetPaperId({ commit }) {
      commit('RESET_PAPERID')
    }
  }
}
export default teacher
