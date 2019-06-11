import Vue from 'vue'
import Router from 'vue-router'
import store from './store'

Vue.use(Router)

const router =  new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/about',
      name: 'about',
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/home',
      name: 'home',
      component: () => import(/* webpackChunkName: "home" */ './views/Home.vue'),
      beforeEnter: (to, from, next) => {
        if (store.state.isAuth === false) {
          next('/404')
        } else {
          next()
        }
      }
    },
    {
      path: '/login',
      alias: '/',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ './views/Login.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import(/* webpackChunkName: "signup" */ './views/Signup.vue')
    },
    {
      path: '/404',
      alias: '*',
      name: 'notFound404',
      component: () => import(/* webpackChunkName: "signup" */ './views/error404.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (
    (
      to.fullPath.includes('admin') &&
      store.state.isAuth === false
    )
  ) {
    next('/404')
  } else {
    next()
  }
})

export { router as default }