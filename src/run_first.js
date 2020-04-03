
/* eslint-disable */
import Bi5FirebaseAuth from './includes/base_i5_firebase_auth'
import Bi7WatchdogData from './includes/base_i7_firebase_data'
import Bi8VueDataConnector from './includes/base_i8_vue_data_connectors'

// produtction versus dev stuff

if (window.location.hostname.toString().includes('dev') ||
    window.location.hostname.toString().includes('localhost') || 
    window.location.hostname.toString().includes('127.0.0.1')) {
    
    // the domain to make ajax calls against, in production this should be empty
    window.G_dev_flag = 1;
    window.G_ajax_baby_api = 'he http://c29a9953.ngrok.io';
} else {
  window.G_dev_flag = 0;
  window.G_ajax_baby_api = '';
}
window.G_firebase_auth = new Bi5FirebaseAuth()
window.G_firebase_auth.setSignedInGlobalCallback(Bi8VueDataConnector.bi8SignInCallback)
window.G_firebase_auth.setSignedOutGlobalCallback(Bi8VueDataConnector.bi8SignOutCallback)
window.G_firebase_auth.bi5SetTokenUpdatedCallback(Bi8VueDataConnector.bi8FirebaseTokenUpdatedCallback)
window.G_username = ''
window.G_ip = ''
window.G_page_id = ''
window.G_firebase_data = new Bi7WatchdogData()
window.G_firebase_data.bi7setDataChangedCallback('IV_user_info', Bi8VueDataConnector.bi8SetVueUserInfoSuccess)

console.log('run_first ran')
