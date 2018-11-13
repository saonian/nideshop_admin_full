// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Element from 'element-ui'
import './styles/font-awesome.scss'
import './styles/style.scss'
import request from './request'
import router from './router'
import store from './store'
import {sync} from 'vuex-router-sync'
import 'font-awesome/css/font-awesome.css'
import 'animate.css'
import panel from './components/panel.vue'
import crudPanel from './components/crudPanel.vue'
import croppa from 'vue-croppa'
import 'vue-croppa/dist/vue-croppa.css'

Vue.component('main-panel', panel)
Vue.component('crud-panel', crudPanel)
Vue.config.productionTip = false
Vue.prototype.$http = request

Vue.use(Element)
Vue.use(croppa)
sync(store, router)

/* eslint-disable no-new */
export default new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
