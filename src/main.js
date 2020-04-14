// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import runFirst from './run_first'
import Vue from 'vue'
import App from './App'
import router from './router'
import VueAWN from "vue-awesome-notifications"
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import VModal from 'vue-js-modal'

Vue.use(VModal);

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
      isGuest: false
    },
    firebaseData: {
      needsLastUpdated: {},
      skillsLastUpdated: {},
      hashtagsLastUpdated: {},
      needsMetaData: {},
      skillsMetaData: {},
      hashtagsMetaData: {}
    }
  },
  router
});

//////// start reference assignments from website backend classes to vue
window.G_firebase_data.IV_needs_last_updated = window.vue_instance.$data.firebaseData.needsLastUpdated
window.G_firebase_data.IV_skills_last_updated = window.vue_instance.$data.firebaseData.skillsLastUpdated
window.G_firebase_data.IV_hashtags_last_updated = window.vue_instance.$data.firebaseData.hashtagsLastUpdated
window.G_firebase_data.IV_needs_meta_data = window.vue_instance.$data.firebaseData.needsMetaData
window.G_firebase_data.IV_skills_meta_data = window.vue_instance.$data.firebaseData.skillsMetaData
window.G_firebase_data.IV_hashtags_meta_data = window.vue_instance.$data.firebaseData.hashtagsMetaData

window.G_firebase_auth.bi5InitFirebase()
console.log('main.js ran')