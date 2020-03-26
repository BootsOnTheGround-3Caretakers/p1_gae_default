/* eslint-disable */
import { CR, RC, AJRS } from './base_i2_success_codes'
import bi1_data_validation from './base_i1_datavalidation'
import base_i3_log from './base_i3_logging'
import { ajax } from 'noquery-ajax';
import bi6_misc from './base_i6_misc_functions'
import Vue from 'vue'
import moment from 'moment';

// CI == class instance
// IV == instance variable
"use strict";
class bi7_watchdog_firebase {
  constructor() {
    var CI = this;
    CI.IV_firebase_db_object = null;
    CI.IV_id_token_pointer = '';
    CI.IV_firebase_uid_pointer = '';
    CI.IV_firebase_guest_flag_pointer = true;
    CI.IV_firebase_email_pointer = '';
    CI.IV_instance_initialized = false;
    CI.IV_user_folder_path = ''
    CI.IV_data_change_callbacks = {'IV_user_info': null};
    CI.IV_users_contact_email = {};
    CI.IV_listener_user_info = {};
    CI.IV_user_info = { 'uid': 0, 'contact_email': '', 'first_name': '', 'last_name': '','web_uid' :'' };
    CI.IV_success_global_callbacks = {};
    CI.IV_failure_global_callbacks = {};
  }


  bi7SetFirebaseToken(firebase_token=null) {
    var debug_data = [];
    var call_result = {};
    var return_msg = "bi7_watchdog_firebase:bi7SetFirebaseToken ";
    var task_id = "bi7_watchdog_firebase:bi7SetFirebaseToken";

    ////// input validation
    call_result = bi1_data_validation.is_string(firebase_token);
    debug_data.push(call_result);

    if (call_result[CR.success] !== RC.success) {
      return_msg += "input validation failed";
      base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
      return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
    }
    //////</end> input validation
    var CI = this;
    CI.IV_id_token_pointer = firebase_token;
  }

  setFirebaseParams(firebase_db_object = null, firebase_token = '', firebase_uid = '',firebae_email = '',guest_flag=true) {
    var debug_data = [];
    var call_result = {};
    var return_msg = "bi7_watchdog_firebase:setFirebaseParams ";
    var task_id = "bi7_watchdog_firebase:setFirebaseParams";

    ////// input validation
    try {
      call_result = bi1_data_validation.is_string(firebase_db_object['app']['options_']['apiKey']);
      debug_data.push(call_result);
    } catch (err) {
      return_msg += "fire_base_db_object is not valid, errors:" + JSON.stringify(err.message);
      base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
      return { success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data };
    }

    call_result = bi1_data_validation.is_string(firebase_token);
    debug_data.push(call_result);
    call_result = bi1_data_validation.is_string(firebase_uid);
    debug_data.push(call_result);
    call_result = bi1_data_validation.is_email_address(firebae_email);
    debug_data.push(call_result);


    var validation_failed = false;

    for (var index in debug_data) {
      if (debug_data[index][CR.success] !== RC.success) {
        validation_failed = true;
      }
    }

    if (validation_failed === true) {
      return_msg += "input validation failed";
      base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
      return { success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data };
    }
    //////</end> input validation
    var CI = this;
    CI.IV_id_token_pointer = firebase_token;
    CI.IV_firebase_uid_pointer = firebase_uid;
    CI.IV_firebase_email_pointer = firebae_email;
    CI.IV_firebase_guest_flag_pointer = guest_flag;
    
    if (guest_flag === true) {
      CI.IV_user_folder_path = '/user/guest';
    } else {
      CI.IV_user_folder_path = '/user/' + firebase_uid;
    }

    CI.IV_firebase_db_object = firebase_db_object;
    CI.IV_instance_initialized = true;
  }

  callCallBackFunction(callback, args = null) {
    var call_result = {};
    var debug_data = [];
    var return_msg = "bi7_watchdog_firebase:callCallBackFunction";
    var task_id = "bi7_watchdog_firebase:callCallBackFunction";

    ////// input validation
    call_result = bi1_data_validation.is_function(callback)
    debug_data.push(call_result);
    if (call_result[CR.success] !== RC.success) {
      return_msg += "input validation failed";
      base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
      return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
    }
    //////</end> input validation

    try {
      if (Array.isArray(args) === true) {
        callback(args)
      } else {
        callback([args])
      }
    } catch (err) {
      return_msg += "callback execution failed with error:" + JSON.stringify(err);
      base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
      return { success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data };
    }
    return { success: RC.success, return_msg: return_msg, debug_data: debug_data };
  }

  setSuccessGlobalCallBack(function_name = '', callback = null) {
    var debug_data = [];
    var call_result = {};
    var return_msg = "bi7_watchdog_firebase:setSuccessCallBack ";
    var task_id = "bi7_watchdog_firebase:setSuccessCallBack";
    var CI = this;

    ///// input validation
    call_result = bi1_data_validation.is_function(callback);
    debug_data.push(call_result);
    if (call_result[CR.success] !== RC.success) {
      return_msg += "input validation failed";
      base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
      return { success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data };
    }
    
    call_result = bi1_data_validation.is_string(function_name);
    debug_data.push(call_result);
    if (call_result[CR.success] !== RC.success) {
      return_msg += "input validation failed";
      base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
      return { success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data };
    }
    /////</end> input validation

    CI.IV_success_global_callbacks[function_name] = callback;
    return { success: RC.success, return_msg: return_msg, debug_data: debug_data };
  }

  setFailureGlobalCallBack(function_name = '', callback = null) {
    var debug_data = [];
    var call_result = {};
    var return_msg = "bi7_watchdog_firebase:setFailureCallBack ";
    var task_id = "bi7_watchdog_firebase:setFailureCallBack";
    var CI = this;
    
    ///// input validation
    call_result = bi1_data_validation.is_function(callback);
    debug_data.push(call_result);
    if (call_result[CR.success] !== RC.success) {
      return_msg += "input validation failed";
      base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
      return { success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data };
    }
    
    call_result = bi1_data_validation.is_string(function_name);
    debug_data.push(call_result);
    if (call_result[CR.success] !== RC.success) {
      return_msg += "input validation failed";
      base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
      return { success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data };
    }
    /////</end> input validation

    CI.IV_failure_global_callbacks[function_name] = callback;
    return { success: RC.success, return_msg: return_msg, debug_data: debug_data };
  }

  bi7setDataChangedCallback(instance_variable, callback) {
    var debug_data = [];
    var call_result = {};
    var return_msg = "bi7_watchdog_firebase:bi7setDataChangedCallback ";
    var task_id = "bi7_watchdog_firebase:bi7setDataChangedCallback";
    var CI = this;
    call_result = bi1_data_validation.is_string(instance_variable);
    debug_data.push(call_result);
    call_result = bi1_data_validation.is_function(callback);
    debug_data.push(call_result);
    var validation_failed = false;
    for (var index in debug_data) {
      if (debug_data[index][CR.success] !== RC.success) {
        validation_failed = true;
      }
    }

    if (validation_failed === false && instance_variable in CI.IV_data_change_callbacks === false) {
      return_msg+= 'attempt to set a callback for an instance variable that is not the data change callbacks'
      validation_failed = true;
    }

    if (validation_failed === true) {
      return_msg += "input validation failed";
      base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
      return { success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data };
    }

    CI.IV_data_change_callbacks[instance_variable] = callback;
    return { success: RC.success, return_msg: return_msg, debug_data: debug_data };
    
  }

  bi7UnsubscribeAllListeners() {
    var debug_data = [];
    var call_result = {};
    var return_msg = "bi7_watchdog_firebase:bi7UnsubscribeAllListeners ";
    var task_id = "bi7_watchdog_firebase:bi7UnsubscribeAllListeners";
    var CI = this;

    var listener_dicts = []
    var failure_flag = false;
    for (var listener_list_index in listener_dicts) {
      for (var listener_key in listener_dicts[listener_list_index]) {
        try {
          listener_dicts[listener_list_index][listener_key].off();
          listener_dicts[listener_list_index][listener_key] = null;
          delete listener_dicts[listener_list_index][listener_key];
        } catch(error) {
          failure_flag = true;
          listener_dicts[listener_list_index][listener_key] = null;
          delete listener_dicts[listener_list_index][listener_key];
          debug_data.push(JSON.stringify(error))
        }
      }
    }

    if (failure_flag === true) {
      return_msg += "failed to turn some listeners off";
      base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
      return { 'success': RC.firebase_failure, 'return_msg': return_msg, 'debug_data': debug_data };
    }
    return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
  }

  validateFirebaseListener(listener_object) {
    var debug_data = [];
    var call_result = {};
    var return_msg = "bi7_watchdog_firebase:validateFirebaseListener ";
    var task_id = "bi7_watchdog_firebase:validateFirebaseListener";
    var CI = this;

    try {
      call_result = bi1_data_validation.is_string(listener_object['database']['app']['options_']['apiKey']);
      debug_data.push(call_result);
      call_result = bi1_data_validation.is_string(listener_object['key']);
      debug_data.push(call_result);
    } catch (err) {
      return_msg += "object is not a valid firebase listener, errors:" + JSON.stringify(err.message);
      base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
      return { success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data };
    }

    var validation_failed = false;
    for (var index in debug_data) {
      if (debug_data[index][CR.success] !== RC.success) {
        validation_failed = true;
      }
    }
    if (validation_failed === true) {
      return_msg += "object is not a valid firebase listener";
      base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
      return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
    }

    return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
  }

  bi7ExtractNumbers(string_value) {
    var debug_data = [];
    var call_result = {};
    var return_msg = "bi7_watchdog_firebase:bi7ExtractNumbers ";
    var task_id = "bi7_watchdog_firebase:bi7ExtractNumbers";
    let point = -1, extract = ''

    //// input validation 
    call_result = bi1_data_validation.is_string(string_value);
    debug_data.push(call_result);
    
    if (call_result[CR.success] !== RC.success) {
      return_msg += "input validation failed";
      base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
      return { 'success': call_result[CR.success], 'return_msg': return_msg, 'debug_data': debug_data };
    }
    ////</end> input validation


    const nums = '1234567890'.split('')
    let s = string_value;
    for (let i = 0; i < s.length; i++) {
      if (nums.indexOf(s[i]) !== -1) {
        extract += s[i]
      } else if (
        s[i] === '.' &&
        point === -1 &&
        i < s.length - 1 &&
        nums.indexOf(s[i - 1]) !== -1 &&
        nums.indexOf(s[i + 1]) !== -1
        ) {
        point = i
        extract += s[i]
      }
    }
    
    return (extract.length === 0) ? NaN : parseFloat(extract)
  }

}

  export default bi7_watchdog_firebase
//once the file is loaded put it in the list of loaded includes
if (typeof window.loaded_includes === "undefined") { window.loaded_includes = {} }
  window.loaded_includes['base_i7'] = true;
