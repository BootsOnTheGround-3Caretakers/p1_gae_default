
/* eslint-disable */
import Bi5FirebaseAuth from './includes/base_i5_firebase_auth'
import Bi7WatchdogData from './includes/base_i7_watchdog_data'
import Bi8VueDataConnector from './includes/base_i8_vue_data_connectors'
// import Bi9CssLoader from './watchdog_includes/base_i9_branding_css'
window.G_dev_flag = 1;
// produtction versus dev stuff
// window.G_dev_live_flag_force = 0;
// if (window.location.hostname.toString().includes('dev') ||
//   window.location.hostname.toString().includes('localhost') || 
//   window.location.hostname.toString().includes('127.0.0.1')) {
//   // the domain to make ajax calls against, in production this should be empty
//     window.G_dev_flag = 1;
//     window.G_ajax_test_domain = 'https://dev-watchdog.dgnet.cloud';
//   } else {
//     window.G_dev_flag = 0;
//     window.G_ajax_test_domain = '';
//   }

//   if (window.G_dev_live_flag_force === 1) {
//     window.G_dev_flag = 0;
//     window.G_ajax_test_domain = 'https://watchdog.dgnet.cloud';
//   }

// window.less = {
//   env: 'development',
//   logLevel: 2,
//   async: false,
//   fileAsync: false,
//   poll: 2000,
//   functions: {},
//   dumpLineNumbers: 'comments',
//   relativeUrls: false,
//   globalVars: {
//     var1: '"quoted value"',
//     var2: 'regular value'
//   },
//   rootpath: ':/localhost/'
// }

// Bi8VueDataConnector.bi8LocalStorageVersionCheck('2020-03-16:08:03')
// load the branding based off the domain
// Bi9CssLoader.bi9LoadSiteCssFile()
// Bi9CssLoader.bi9LoadSiteTitle()
// Bi9CssLoader.bi9LoadSiteIcon()
// window.G_brand_id = Bi9CssLoader.getBrandId()
// window.G_brand_color = Bi9CssLoader.getBrandColor()
// window.G_redirectUrl = null
// window.G_less_include = require('less')
window.G_firebase_auth = new Bi5FirebaseAuth()
window.G_firebase_auth.setSignedInGlobalCallback(Bi8VueDataConnector.bi8SignInCallback)
window.G_firebase_auth.setSignedOutGlobalCallback(Bi8VueDataConnector.bi8SignOutCallback)
window.G_firebase_auth.bi5SetTokenUpdatedCallback(Bi8VueDataConnector.bi8FirebaseTokenUpdatedCallback)
window.G_username = ''
window.G_ip = ''
window.G_page_id = ''
window.G_watchdog_data = new Bi7WatchdogData()
window.G_watchdog_data.bi7setDataChangedCallback('IV_user_info', Bi8VueDataConnector.bi8SetVueUserInfoSuccess)

console.log('run_first ran')
