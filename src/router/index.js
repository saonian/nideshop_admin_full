import Vue from 'vue'
import VueRouter from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import routes from './routes'
import store from '../store'

Vue.use(NProgress)
Vue.use(VueRouter)

const router = new VueRouter({
  routes: routes
})

const {state} = store

router.beforeEach((route, redirect, next) => {
  NProgress.start()
  if (state.device.isMobile && state.sidebar.opened) {
    store.commit('TOGGLE_SIDEBAR', false)
  }
  if (!store.state.token && route.path !== '/login') {
    next({
      path: '/login',
      query: {redirect: route.fullPath}
    })
  } else {
    next()
  }
})

router.afterEach((route, redirect, next) => {
  NProgress.done()
  store.dispatch('changeCurrentMenu', route)
})

export default router
