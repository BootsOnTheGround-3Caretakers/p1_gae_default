/* eslint-disable */
import { CR, RC, AJRS } from './base_i2_success_codes'
import bi1_data_validation from './base_i1_datavalidation'
import base_i3_log from './base_i3_logging'
import checkIfUserExists from './json_tasks/p1s5/p1s5t3.js'
import createUser from './json_tasks/p1s3/p1s3t3.js'
import 'vue'

class bi8_vue_data_connectors {

  static bi8SetVueUserInfoSuccess() {
    window.vue_instance.$root.$data.userInfo.firstName = window.G_firebase_data.IV_user_info['first_name']
    window.vue_instance.$root.$data.userInfo.lastName = window.G_firebase_data.IV_user_info['last_name']
    window.vue_instance.$root.$data.userInfo.contactEmail =  window.G_firebase_data.IV_user_info['email_address']
    window.vue_instance.$root.$data.userInfo.uid = window.G_firebase_data.IV_user_info['user_uid']
    window.vue_instance.$root.$data.firebaseData.firebaseDbConnected = true;
  }

  static bi8SignInCallback() {
    if (window.G_firebase_auth.IV_token_received === false || typeof G_firebase_auth.IV_uid !== 'string' ||  G_firebase_auth.IV_uid.length < 5) {
      setTimeout(bi8_vue_data_connectors.bi8SignInCallback,300);
    }
    window.vue_instance.$root.$data.userInfo.isGuest = window.G_firebase_auth.IV_is_guest;
    window.vue_instance.$root.$data.userInfo.authenticated = window.G_firebase_auth.IV_token_received;

    window.G_firebase_data.setFirebaseParams(
      window.firebase.database(),
      window.G_firebase_auth.bi5TokenProperty,
      window.G_firebase_auth.bi5FirebaseUidProperty,
      window.G_firebase_auth.bi5FirebaseEmailAddressProperty,
      window.G_firebase_auth.bi5FirebaseGuestFlagProperty
    );
  }

  static bi8SignOutCallback() {
    location.assign(window.location.origin + '/');
  }

  static bi8FirebaseTokenUpdatedCallback() {
    window.G_firebase_data.bi7SetFirebaseToken(G_firebase_auth.bi5TokenProperty);
  }
}

export default bi8_vue_data_connectors
//once the file is loaded put it in the list of loaded includes
if (typeof window.loaded_includes === "undefined") { window.loaded_includes = {} }
window.loaded_includes['base_i8'] = true;
