import Vue from 'vue'
import Vuex from 'vuex'
import * as api from 'api'
import {getCurrentMenu} from '../utils'
import http from '../request'
import menus from '../assets/menus'
// import {Message} from 'element-ui'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: true,

  state: {
    loading: false,
    menuList: {},
    sidebar: {
      collapsed: sessionStorage.getItem('state.sidebar.collapsed') === 'true',
      show: sessionStorage.getItem('state.sidebar.show') === 'true'
    },
    device: {
      isMobile: false
    },
    userInfo: localStorage.getItem('state.user.info') ? JSON.parse(localStorage.getItem('state.user.info')) : {name: '佚名'},
    currentMenus: [],
    token: localStorage.getItem('token')
  },

  getters: {
    loading: state => state.loading,
    menuList: state => state.menuList,
    sidebar: state => state.sidebar,
    userInfo: state => state.userInfo,
    device: state => state.device,
    currentMenus: state => state.currentMenus,
    token: state => state.token
  },

  mutations: {
    TOGGLE_DEVICE (state, isMobile) {
      state.device.isMobile = isMobile
    },
    TOGGLE_LOADING (state) {
      state.loading = !state.loading
    },
    LOAD_MENU (state, menu) {
      state.menuList = menu
    },
    LOAD_CURRENT_MENU (state, menu) {
      state.currentMenus = menu
    },
    SET_USER_INFO (state, info) {
      if (info) {
        state.userInfo = info
        localStorage.setItem('state.user.info', JSON.stringify(info))
      } else {
        state.userInfo = {name: '佚名'}
        localStorage.removeItem('state.user.info')
      }
    },
    TOGGLE_SIDEBAR (state, collapsed) {
      if (collapsed == null) {
        collapsed = !state.sidebar.collapsed
      }
      state.sidebar.collapsed = collapsed
      sessionStorage.setItem('state.sidebar.collapsed', collapsed)
    },
    TOGGLE_SIDEBAR_SHOW (state, show) {
      if (show == null) {
        state.sidebar.show = !state.sidebar.show
      } else {
        state.sidebar.show = show
      }
      sessionStorage.setItem('state.sidebar.show', state.sidebar.show)
    },
    SET_TOKEN: (state, token) => {
      if (token) {
        state.token = token
        localStorage.setItem('token', token)
      } else {
        state.token = null
        localStorage.removeItem('token')
      }
    }
  },

  actions: {
    toggleLoading: ({ commit }) => commit('TOGGLE_LOADING'),
    loadMenuList: ({ state, commit }) => {
      return new Promise((resolve, reject) => {
        commit('LOAD_MENU', menus)
      })
    },
    changeCurrentMenu: ({ state, commit }, { path, matched, fullPath }) => {
      const current = getCurrentMenu(path, menus)
      commit('LOAD_CURRENT_MENU', current.reverse())
    },
    login: ({ state, commit, dispatch }, params) => {
      return new Promise((resolve, reject) => {
        http.post(api.LOGIN, params).then(data => {
          commit('SET_TOKEN', data.data.token)
          commit('SET_USER_INFO', data.data.userInfo)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    logout: ({ state, commit, dispatch }) => {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', null)
        commit('SET_USER_INFO', null)
        resolve()
      })
    }
  }
})

export default store
