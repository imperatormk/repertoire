import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'

import App from '@/App'
import router from '@/router'
import store from '@/store'

import '@/styles/common.scss'
import '@/styles/main.scss'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import Layout from '@/components/Layout'

Vue.use(BootstrapVue)
Vue.component('Layout', Layout)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')