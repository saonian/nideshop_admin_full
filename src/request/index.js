import axios from 'axios'
// import qs from 'qs'
import router from '../router'
import store from '../store'
import {Message} from 'element-ui'

axios.defaults.timeout = 15000

axios.interceptors.request.use(function (config) {
  // if (config.method === 'post' && config.data.constructor !== FormData) {
  //   config.data = qs.stringify(config.data)
  // }
  if (store.getters.token) {
    config.headers['token'] = store.getters.token
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

axios.interceptors.response.use(
  response => {
    if (response.data && response.data.errno === 401) {
      router.replace({
        path: '/login',
        query: {redirect: router.currentRoute.fullPath}
      })
      Message.error('登录过期，请重新登录')
      return
    }
    if (response.data && response.status === 200 && response.data.errno === 0) {
      return response.data
    } else {
      Message.error(response.data.errmsg)
      return response.data
    }
  },
  error => {
    if (error.response) {
      if (error.response.status === 401) {
        router.replace({
          path: '/login',
          query: {redirect: router.currentRoute.fullPath}
        })
        Message.error('登录过期，请重新登录')
      } else if (error.response.status === 500) {
        Message.error('服务端错误：' + error.response.data.message)
      } else if (error.response.status === 422) {
        Message.error(error.response.data.message)
      } else {
        Message.error(error.response.data.message)
      }
    }
    return Promise.reject(error.response.data)
  }
)

export default axios
