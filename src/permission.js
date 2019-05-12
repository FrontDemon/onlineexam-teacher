import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { Message } from 'element-ui'
import { getStore } from '@/utils/mUtils'
// import { getToken } from '@/utils/auth' // getToken from cookie

NProgress.configure({ showSpinner: false })// NProgress configuration

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  const userInfo = getStore('teacherInfo')
  if (userInfo) {
    store.dispatch('recordUserInfo', JSON.parse(userInfo))
  }
  const paperId = getStore('paperId')
  if (paperId) {
    store.dispatch('recordPaperId', parseInt(paperId))
  }
  // console.log(JSON.stringify(store.state.admin.userInfo))
  if (JSON.stringify(store.state.teacher.userInfo) !== '{}') {
    // console.log('已登录')
    if (to.path === '/login') {
      // console.log('登录页面')
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      Message.error('请先登录系统')
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
