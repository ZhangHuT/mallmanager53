// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
// 面包屑组件
import Myread from './components/crumb/myread.vue'
// element-ui的样式文件
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/reset.css'
import router from './router'
import MyServerHttp from '@/plugins/http.js'
import moment from 'moment'

Vue.use(ElementUI)
Vue.use(MyServerHttp)
Vue.config.productionTip = false

// 过滤器，进行日期格式-fmtdate
Vue.filter('fmtDate', (v) => {
  return moment(v).format('YYYY-MM-DD')
})

// 使用全局进行组件的设置，面包屑组件很多地方都进行使用
Vue.component(Myread.name, Myread)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
