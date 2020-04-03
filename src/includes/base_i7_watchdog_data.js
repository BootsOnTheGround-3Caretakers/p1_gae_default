/* eslint-disable */
import { CR, RC, AJRS } from './base_i2_success_codes'
import bi1_data_validation from './base_i1_datavalidation'
import base_i3_log from './base_i3_logging'
// import { ajax } from 'noquery-ajax';
// import bi6_misc from './base_i6_misc_functions'
import Vue from 'vue'
// import moment from 'moment';

// CI == class instance
// IV == instance variable
"use strict";
class bi7_watchdog_firebase {
  constructor() {
    var CI = this;
    
    // Firebase related IVs
    CI.IV_firebase_db_object = null;
    CI.IV_id_token_pointer = '';
    CI.IV_firebase_uid_pointer = '';
    CI.IV_firebase_guest_flag_pointer = true;
    CI.IV_firebase_email_pointer = '';
    CI.IV_instance_initialized = false;
    CI.IV_user_folder_path = ''
    
    // User INFO IVs
    CI.IV_users_contact_email = {};
    CI.IV_listener_user_info = {};
    CI.IV_user_info = { 'uid': 0, 'contact_email': '', 'first_name': '', 'last_name': '','web_uid' :'' };

    // Callbacks Related IVs
    CI.IV_data_change_callbacks = {'IV_user_info': null};
    CI.IV_success_global_callbacks = {};
    CI.IV_failure_global_callbacks = {};

    // Listeners references IVs
    CI.IV_listener_needs_last_updated_global = null;
    CI.IV_listener_skills_last_updated_global = null;
    CI.IV_listener_hashtags_last_updated_global = null;

    // DataStructures IVs
    CI.IV_needs_last_updated = {};
    CI.IV_skills_last_updated = {};
    CI.IV_hashtags_last_updated = {};
    CI.IV_needs_meta_data = {};
    CI.IV_skills_meta_data = {};
    CI.IV_hashtags_meta_data = {};

    // Global function calls needs to call on page load
    CI.bi7initNeedsLastUpdatedGlobalListener();
    CI.bi7initSkillsLastUpdatedGlobalListener();
    CI.bi7initHashtagsLastUpdatedGlobalListener();
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

  InitUserInfoListener() {
    var debug_data = [];
    var call_result = {};
    var return_msg = "bi7_watchdog_firebase:InitUserInfoListener ";
    var task_id = "bi7_watchdog_firebase:InitUserInfoListener";
    var CI = this;

    if (CI.IV_instance_initialized === false) {
      return_msg += 'instance is not initialized';
      base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
      return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
    }

    // TODO- Add here logic to fetch user's information

    CI.callCallBackFunction(CI.IV_data_change_callbacks['IV_user_info']);

  }

  bi7initNeedsLastUpdatedGlobalListener() {
    var debug_data = [];
    var call_result = {};
    var return_msg = "bi7_watchdog_firebase:bi7initNeedsLastUpdatedGlobalListener ";
    var task_id = "bi7_watchdog_firebase:bi7initNeedsLastUpdatedGlobalListener";
    var CI = this;

    if (CI.IV_instance_initialized !== true) {
      setTimeout(CI.bi7initNeedsLastUpdatedGlobalListener.bind(CI),500);
      return;
    }

    if (CI.IV_listener_needs_last_updated_global !== null) { return; }

    var listener_location = 'needs_last_updated';
    CI.IV_listener_needs_last_updated_global = CI.IV_firebase_db_object.ref(listener_location);

    ///// removing invalid firebase listener key
    call_result = CI.validateFirebaseListener(CI.IV_listener_needs_last_updated_global);
    debug_data.push(call_result)
    if (call_result[CR.success] !== RC.success) {
      delete CI.IV_listener_needs_last_updated_global;
      return_msg += "failed to create listener for " + listener_location;
      base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
      return { 'success': RC.firebase_failure, 'return_msg': return_msg, 'debug_data': debug_data };
    }
    ///// </end> removing invalid firebase listener key

    CI.IV_listener_needs_last_updated_global.on("value",
      function (a_data) { CI.bi7NeedsLastUpdatedGlobalListener(a_data) }.bind(CI),
      function (errorObject) {
        return_msg += "firebase read failed with error data:" + errorObject;
        base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
      }.bind(CI)
    );

    return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
  }

  bi7NeedsLastUpdatedGlobalListener(data) {
    var debug_data = [];
    var call_result = {};
    var return_msg = "bi7_watchdog_firebase:bi7NeedsLastUpdatedGlobalListener ";
    var task_id = "bi7_watchdog_firebase:bi7NeedsLastUpdatedGlobalListener";
    var CI = this;

    ////// input validation
    if (data === null) {
      return_msg += "data argument is null";
      base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
      return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
    }
    //////</end> input validation

    var firebase_data = data.val();

    for (let need_uid in firebase_data) {
      if (need_uid === "deletion_prevention_key") {continue;}

      if (need_uid in CI.IV_needs_last_updated === false) {
        Vue.set(CI.IV_needs_last_updated, need_uid, {});
      }

      if ('last_updated' in CI.IV_needs_last_updated[need_uid] === false || 
          CI.IV_needs_last_updated[need_uid]['last_updated'] === null ||
          CI.IV_needs_last_updated[need_uid]['last_updated'] === undefined) {
        Vue.set(CI.IV_needs_last_updated[need_uid], 'last_updated', firebase_data[need_uid]['last_updated']);
        CI.bi7GetNeedMetaDataOnce(need_uid);
      } else if (CI.IV_needs_last_updated[need_uid]['last_updated'] < firebase_data[need_uid]['last_updated']) {
        Vue.set(CI.IV_needs_last_updated[need_uid], 'last_updated', firebase_data[need_uid]['last_updated']);
        CI.bi7GetNeedMetaDataOnce(need_uid);
      }
    }

    return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
  }

  bi7GetNeedMetaDataOnce(need_uid) {
    var debug_data = [];
    var call_result = {};
    var return_msg = "bi7_watchdog_firebase:bi7GetNeedMetaDataOnce ";
    var task_id = "bi7_watchdog_firebase:bi7GetNeedMetaDataOnce";
    var CI = this;

    ////// input validation 

    // TODO!~ mu- confirm format and create validation function in base_i1
    // call_result = bi1_data_validation.is_need_uid(need_uid);
    // debug_data.push(call_result);
    // if (call_result[CR.success] !== RC.success) {
    //   return_msg += "input validation failed";
    //   base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
    //   return { 'success': call_result[CR.success], 'return_msg': return_msg, 'debug_data': debug_data };
    // }
    //////</end> input validation 

    var listener_location = `needs_meta_data/${need_uid}`;
    var location_ref = CI.IV_firebase_db_object.ref(listener_location);

    ///// removing invalid firebase listener key
    call_result = CI.validateFirebaseListener(location_ref);
    debug_data.push(call_result)
    if (call_result[CR.success] !== RC.success) {
      return_msg += "failed to create listener for " + listener_location;
      base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
      return { 'success': RC.firebase_failure, 'return_msg': return_msg, 'debug_data': debug_data };
    }
    ///// </end> removing invalid firebase listener key

    location_ref.once("value",
      function (a_data) { CI.bi7NeedMetaDataOnceCallback(need_uid, a_data) }.bind(CI),
      function (errorObject) {
        return_msg += "firebase read failed with error data:" + errorObject;
        base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
      }.bind(CI)
    );
  }

  bi7NeedMetaDataOnceCallback(need_uid, data) {
    var debug_data = [];
    var call_result = {};
    var return_msg = "bi7_watchdog_firebase:bi7NeedMetaDataOnceCallback ";
    var task_id = "bi7_watchdog_firebase:bi7NeedMetaDataOnceCallback";
    var CI = this;

    ////// input validation 

    // TODO!~ mu- confirm format and create validation function in base_i1
    // call_result = bi1_data_validation.is_need_uid(need_uid);
    // debug_data.push(call_result);
    // if (call_result[CR.success] !== RC.success) {
    //   return_msg += "input validation failed";
    //   base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
    //   return { 'success': call_result[CR.success], 'return_msg': return_msg, 'debug_data': debug_data };
    // }

    if (data === null) {
      return_msg += "data argument is null";
      base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
      return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
    }
    //////</end> input validation 

    var firebase_data = data.val();


    if (need_uid in CI.IV_needs_meta_data === false) {
      Vue.set(CI.IV_needs_meta_data, need_uid, {});
    }

    if ('name' in firebase_data === true && typeof (firebase_data['name']) === "string") {
      Vue.set(CI.IV_needs_meta_data[need_uid], 'name', firebase_data['name']);
    }

    if ('requirements' in firebase_data === true && typeof (firebase_data['requirements']) === "string") {
      Vue.set(CI.IV_needs_meta_data[need_uid], 'requirements', firebase_data['requirements']);
    }

    return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
  }

  bi7initSkillsLastUpdatedGlobalListener() {
    var debug_data = [];
    var call_result = {};
    var return_msg = "bi7_watchdog_firebase:bi7initSkillsLastUpdatedGlobalListener ";
    var task_id = "bi7_watchdog_firebase:bi7initSkillsLastUpdatedGlobalListener";
    var CI = this;

    if (CI.IV_instance_initialized !== true) {
      setTimeout(CI.bi7initSkillsLastUpdatedGlobalListener.bind(CI),500);
      return;
    }

    if (CI.IV_listener_skills_last_updated_global !== null) { return; }

    var listener_location = 'skills_last_updated';
    CI.IV_listener_skills_last_updated_global = CI.IV_firebase_db_object.ref(listener_location);

    ///// removing invalid firebase listener key
    call_result = CI.validateFirebaseListener(CI.IV_listener_skills_last_updated_global);
    debug_data.push(call_result)
    if (call_result[CR.success] !== RC.success) {
      delete CI.IV_listener_skills_last_updated_global;
      return_msg += "failed to create listener for " + listener_location;
      base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
      return { 'success': RC.firebase_failure, 'return_msg': return_msg, 'debug_data': debug_data };
    }
    ///// </end> removing invalid firebase listener key

    CI.IV_listener_skills_last_updated_global.on("value",
      function (a_data) { CI.bi7SkillsLastUpdatedGlobalListener(a_data) }.bind(CI),
      function (errorObject) {
        return_msg += "firebase read failed with error data:" + errorObject;
        base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
      }.bind(CI)
    );

    return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
  }

  bi7SkillsLastUpdatedGlobalListener(data) {
    var debug_data = [];
    var call_result = {};
    var return_msg = "bi7_watchdog_firebase:bi7SkillsLastUpdatedGlobalListener ";
    var task_id = "bi7_watchdog_firebase:bi7SkillsLastUpdatedGlobalListener";
    var CI = this;

    ////// input validation
    if (data === null) {
      return_msg += "data argument is null";
      base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
      return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
    }
    //////</end> input validation

    var firebase_data = data.val();

    for (let skill_uid in firebase_data) {
      if (skill_uid === "deletion_prevention_key") {continue;}

      if (skill_uid in CI.IV_skills_last_updated === false) {
        Vue.set(CI.IV_skills_last_updated, skill_uid, {});
      }

      if ('last_updated' in CI.IV_skills_last_updated[skill_uid] === false ||
          CI.IV_skills_last_updated[skill_uid]['last_updated'] === null ||
          CI.IV_skills_last_updated[skill_uid]['last_updated'] === undefined) {
        Vue.set(CI.IV_skills_last_updated[skill_uid], 'last_updated', firebase_data[skill_uid]['last_updated']);
        CI.bi7GetSkillMetaDataOnce(skill_uid);
      } else if (CI.IV_skills_last_updated[skill_uid]['last_updated'] < firebase_data[skill_uid]['last_updated']) {
        Vue.set(CI.IV_skills_last_updated[skill_uid], 'last_updated', firebase_data[skill_uid]['last_updated']);
        CI.bi7GetSkillMetaDataOnce(skill_uid);
      }
    }

    return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
  }

  bi7GetSkillMetaDataOnce(skill_uid) {
    var debug_data = [];
    var call_result = {};
    var return_msg = "bi7_watchdog_firebase:bi7GetSkillMetaDataOnce ";
    var task_id = "bi7_watchdog_firebase:bi7GetSkillMetaDataOnce";
    var CI = this;

    ////// input validation 

    // TODO!~ mu- confirm format and create validation function in base_i1
    // call_result = bi1_data_validation.is_skill_uid(skill_uid);
    // debug_data.push(call_result);
    // if (call_result[CR.success] !== RC.success) {
    //   return_msg += "input validation failed";
    //   base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
    //   return { 'success': call_result[CR.success], 'return_msg': return_msg, 'debug_data': debug_data };
    // }
    //////</end> input validation 

    var listener_location = `skills_meta_data/${skill_uid}`;
    var location_ref = CI.IV_firebase_db_object.ref(listener_location);

    ///// removing invalid firebase listener key
    call_result = CI.validateFirebaseListener(location_ref);
    debug_data.push(call_result)
    if (call_result[CR.success] !== RC.success) {
      return_msg += "failed to create listener for " + listener_location;
      base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
      return { 'success': RC.firebase_failure, 'return_msg': return_msg, 'debug_data': debug_data };
    }
    ///// </end> removing invalid firebase listener key

    location_ref.once("value",
      function (a_data) { CI.bi7SkillMetaDataOnceCallback(skill_uid, a_data) }.bind(CI),
      function (errorObject) {
        return_msg += "firebase read failed with error data:" + errorObject;
        base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
      }.bind(CI)
    );
  }

  bi7SkillMetaDataOnceCallback(skill_uid, data) {
    var debug_data = [];
    var call_result = {};
    var return_msg = "bi7_watchdog_firebase:bi7SkillMetaDataOnceCallback ";
    var task_id = "bi7_watchdog_firebase:bi7SkillMetaDataOnceCallback";
    var CI = this;

    ////// input validation 

    // TODO!~ mu- confirm format and create validation function in base_i1
    // call_result = bi1_data_validation.is_skill_uid(skill_uid);
    // debug_data.push(call_result);
    // if (call_result[CR.success] !== RC.success) {
    //   return_msg += "input validation failed";
    //   base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
    //   return { 'success': call_result[CR.success], 'return_msg': return_msg, 'debug_data': debug_data };
    // }

    if (data === null) {
      return_msg += "data argument is null";
      base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
      return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
    }
    //////</end> input validation 

    var firebase_data = data.val();


    if (skill_uid in CI.IV_skills_meta_data === false) {
      Vue.set(CI.IV_skills_meta_data, skill_uid, {});
    }

    if ('name' in firebase_data === true && typeof (firebase_data['name']) === "string") {
      Vue.set(CI.IV_skills_meta_data[skill_uid], 'name', firebase_data['name']);
    }

    if ('description' in firebase_data === true && typeof (firebase_data['description']) === "string") {
      Vue.set(CI.IV_skills_meta_data[skill_uid], 'description', firebase_data['description']);
    }

    if ('skill_type' in firebase_data === true && typeof (firebase_data['skill_type']) === "string") {
      Vue.set(CI.IV_skills_meta_data[skill_uid], 'skill_type', firebase_data['skill_type']);
    }

    return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
  }


  bi7initHashtagsLastUpdatedGlobalListener() {
    var debug_data = [];
    var call_result = {};
    var return_msg = "bi7_watchdog_firebase:bi7initHashtagsLastUpdatedGlobalListener ";
    var task_id = "bi7_watchdog_firebase:bi7initHashtagsLastUpdatedGlobalListener";
    var CI = this;

    if (CI.IV_instance_initialized !== true) {
      setTimeout(CI.bi7initHashtagsLastUpdatedGlobalListener.bind(CI),500);
      return;
    }

    if (CI.IV_listener_hashtags_last_updated_global !== null) { return; }

    var listener_location = 'hashtags_last_updated';
    CI.IV_listener_hashtags_last_updated_global = CI.IV_firebase_db_object.ref(listener_location);

    ///// removing invalid firebase listener key
    call_result = CI.validateFirebaseListener(CI.IV_listener_hashtags_last_updated_global);
    debug_data.push(call_result)
    if (call_result[CR.success] !== RC.success) {
      delete CI.IV_listener_hashtags_last_updated_global;
      return_msg += "failed to create listener for " + listener_location;
      base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
      return { 'success': RC.firebase_failure, 'return_msg': return_msg, 'debug_data': debug_data };
    }
    ///// </end> removing invalid firebase listener key

    CI.IV_listener_hashtags_last_updated_global.on("value",
      function (a_data) { CI.bi7HashtagsLastUpdatedGlobalListener(a_data) }.bind(CI),
      function (errorObject) {
        return_msg += "firebase read failed with error data:" + errorObject;
        base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
      }.bind(CI)
    );

    return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
  }

  bi7HashtagsLastUpdatedGlobalListener(data) {
    var debug_data = [];
    var call_result = {};
    var return_msg = "bi7_watchdog_firebase:bi7HashtagsLastUpdatedGlobalListener ";
    var task_id = "bi7_watchdog_firebase:bi7HashtagsLastUpdatedGlobalListener";
    var CI = this;

    ////// input validation
    if (data === null) {
      return_msg += "data argument is null";
      base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
      return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
    }
    //////</end> input validation

    var firebase_data = data.val();

    for (let hashtag_uid in firebase_data) {
      if (hashtag_uid === "deletion_prevention_key") {continue;}

      if (hashtag_uid in CI.IV_hashtags_last_updated === false) {
        Vue.set(CI.IV_hashtags_last_updated, hashtag_uid, {});
      }

      if ('last_updated' in CI.IV_hashtags_last_updated[hashtag_uid] === false ||
          CI.IV_hashtags_last_updated[hashtag_uid]['last_updated'] === null ||
          CI.IV_hashtags_last_updated[hashtag_uid]['last_updated'] === undefined) {
        Vue.set(CI.IV_hashtags_last_updated[hashtag_uid], 'last_updated', firebase_data[hashtag_uid]);
        CI.bi7GetHashTagMetaDataOnce(hashtag_uid);
      } else if (CI.IV_hashtags_last_updated[hashtag_uid]['last_updated'] < firebase_data[hashtag_uid]) {
        Vue.set(CI.IV_hashtags_last_updated[hashtag_uid], 'last_updated', firebase_data[hashtag_uid]);
        CI.bi7GetHashTagMetaDataOnce(hashtag_uid);
      }
    }

    return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
  }

  bi7GetHashTagMetaDataOnce(hashtag_uid) {
    var debug_data = [];
    var call_result = {};
    var return_msg = "bi7_watchdog_firebase:bi7GetHashTagMetaDataOnce ";
    var task_id = "bi7_watchdog_firebase:bi7GetHashTagMetaDataOnce";
    var CI = this;

    ////// input validation 

    // TODO!~ mu- confirm format and create validation function in base_i1
    // call_result = bi1_data_validation.is_hashtag_uid(hashtag_uid);
    // debug_data.push(call_result);
    // if (call_result[CR.success] !== RC.success) {
    //   return_msg += "input validation failed";
    //   base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
    //   return { 'success': call_result[CR.success], 'return_msg': return_msg, 'debug_data': debug_data };
    // }
    //////</end> input validation 

    var listener_location = `hashtags/${hashtag_uid}`;
    var location_ref = CI.IV_firebase_db_object.ref(listener_location);

    ///// removing invalid firebase listener key
    call_result = CI.validateFirebaseListener(location_ref);
    debug_data.push(call_result)
    if (call_result[CR.success] !== RC.success) {
      return_msg += "failed to create listener for " + listener_location;
      base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
      return { 'success': RC.firebase_failure, 'return_msg': return_msg, 'debug_data': debug_data };
    }
    ///// </end> removing invalid firebase listener key

    location_ref.once("value",
      function (a_data) { CI.bi7HashtagMetaDataOnceCallback(hashtag_uid, a_data) }.bind(CI),
      function (errorObject) {
        return_msg += "firebase read failed with error data:" + errorObject;
        base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
      }.bind(CI)
    );
  }

  bi7HashtagMetaDataOnceCallback(hashtag_uid, data) {
    var debug_data = [];
    var call_result = {};
    var return_msg = "bi7_watchdog_firebase:bi7HashtagMetaDataOnceCallback ";
    var task_id = "bi7_watchdog_firebase:bi7HashtagMetaDataOnceCallback";
    var CI = this;

    ////// input validation 

    // TODO!~ mu- confirm format and create validation function in base_i1
    // call_result = bi1_data_validation.is_hashtag_uid(hashtag_uid);
    // debug_data.push(call_result);
    // if (call_result[CR.success] !== RC.success) {
    //   return_msg += "input validation failed";
    //   base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
    //   return { 'success': call_result[CR.success], 'return_msg': return_msg, 'debug_data': debug_data };
    // }

    if (data === null) {
      return_msg += "data argument is null";
      base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
      return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
    }
    //////</end> input validation 

    var firebase_data = data.val();


    if (hashtag_uid in CI.IV_hashtags_meta_data === false) {
      Vue.set(CI.IV_hashtags_meta_data, hashtag_uid, {});
    }

    if ('name' in firebase_data === true && typeof (firebase_data['name']) === "string") {
      Vue.set(CI.IV_hashtags_meta_data[hashtag_uid], 'name', firebase_data['name']);
    }

    if ('description' in firebase_data === true && typeof (firebase_data['description']) === "string") {
      Vue.set(CI.IV_hashtags_meta_data[hashtag_uid], 'description', firebase_data['description']);
    }

    return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
  }

  bi7UnsubscribeAllListeners() {
    var debug_data = [];
    var call_result = {};
    var return_msg = "bi7_watchdog_firebase:bi7UnsubscribeAllListeners ";
    var task_id = "bi7_watchdog_firebase:bi7UnsubscribeAllListeners";
    var CI = this;

    /// TODO- mu update listeners array.
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

}

  export default bi7_watchdog_firebase
//once the file is loaded put it in the list of loaded includes
if (typeof window.loaded_includes === "undefined") { window.loaded_includes = {} }
  window.loaded_includes['base_i7'] = true;
