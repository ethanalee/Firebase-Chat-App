import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const store = new Vuex.Store({
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
    authLogIn ({ commit }, user) {
      commit('authLogIn')
      commit('setActiveUser', user)
    },
    authLogOut ({ commit }) {
      commit('authLogOut', false)
      commit('setActiveUser', null)
    },
  },
  plugins: [
    createPersistedState()
  ]
})

export { store as default }
