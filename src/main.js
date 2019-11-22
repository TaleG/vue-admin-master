import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//import './assets/theme/theme-green/index.css'
import store from './vuex/store'
import Vuex from 'vuex'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import router from './routes'
import Mock from './mock'
Mock.bootstrap();
import 'font-awesome/css/font-awesome.min.css'

Vue.use(ElementUI)
Vue.use(Vuex)

router.beforeEach((to, from, next) => {
  //NProgress.start();
  if (to.path == '/login') {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo')
    next()
  }else {
    let user = JSON.parse(localStorage.getItem('userInfo'));
    console.log(user.userRole)
    next()
  }
})



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

