import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
// import user from './modules/user'
import teacher from './modules/teacher'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    // user,
    teacher
  },
  getters
})

export default store
