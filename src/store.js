import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isAuth: false,
    activeUser: null,
  },
  mutations: {
    authLogIn (state) {
      state.isAuth = true
    },
    authLogOut (state) {
      state.isAuth = false
    },
    setActiveUser (state, user) {
      state.activeUser = user
    },
  },
  actions: {
    authLogIn ({ commit, state }, user) {
      commit('authLogIn')
      commit('setActiveUser', user)
    },
    authLogOut ({ commit, state }) {
      commit('authLogOut', false)
      commit('setActiveUser', null)
    },
  }
})
