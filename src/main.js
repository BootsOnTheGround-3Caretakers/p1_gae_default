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
let options = {maxNotifications:1 ,position: 'top-right'}
Vue.use(VueAWN, options)

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

window.G_firebase_auth.bi5InitFirebase()
console.log('main.js ran')