import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'

Vue.config.productionTip = false

// 创建 axios 实例
const api = axios.create({
  baseURL: '',
  timeout: 10000, // 超时时间
  headers: {
    'Content-Type': 'application/json'
  }
})
// 添加到 Vue 原型
Vue.prototype.$http = api

// 或者挂载到全局变量
window.axios = api

new Vue({
  render: h => h(App),
}).$mount('#app')
