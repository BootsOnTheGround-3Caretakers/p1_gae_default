// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import runFirst from './run_first'
import Vue from 'vue'
import App from './App'
import router from './router'
import VueAWN from "vue-awesome-notifications"
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

Vue.config.productionTip = false
let options = {maxNotifications: 1 ,position: 'top-right'}
Vue.use(VueAWN, options)


window.vue_instance = new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  data: {
    userInfo: {
      firstName: 'User',
      lastName: '',
      contactEmail: '',
      uid: 0,
      authenticated: false,
    }
  },
  router
});

window.G_firebase_auth.bi5InitFirebase()
console.log('main.js ran')