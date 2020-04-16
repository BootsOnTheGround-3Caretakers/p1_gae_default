/* eslint-disable */
import { CR, RC, AJRS } from './base_i2_success_codes'
import bi1_data_validation from './base_i1_datavalidation'
import base_i3_log from './base_i3_logging'
// import { ajax } from 'noquery-ajax';
// import bi6_misc from './base_i6_misc_functions'
import getUserProfile from './json_tasks/p1s5/p1s5t1'
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
    CI.IV_user_info = { 
      'user_uid': 0, 
      'email_address': '', 
      'first_name': '', 
      'last_name': '',
      'web_uid' : '',
      'last_updated': ''
    };

    // Global Callbacks Related IVs
    CI.IV_data_change_callbacks = {'IV_user_info': null};
    CI.IV_success_global_callbacks = {};
    CI.IV_failure_global_callbacks = {};

    // Listeners references IVs
    CI.IV_listener_needs_last_updated_global = null;
    CI.IV_listener_skills_last_updated_global = null;
    CI.IV_listener_hashtags_last_updated_global = null;
    CI.IV_listener_needs_skills_joins_global = null;
    CI.IV_listener_skills_needs_joins_global = null;
    CI.IV_listener_all_users_data_global = null;
    CI.IV_listener_location_lookup_data_global = null;
    CI.IV_listener_clusters_last_updated_global = null;

    // DataStructures IVs
    CI.IV_needs_last_updated = {};
    CI.IV_skills_last_updated = {};
    CI.IV_hashtags_last_updated = {};
    CI.IV_needs_meta_data = {};
    CI.IV_skills_meta_data = {};
    CI.IV_hashtags_meta_data = {};
    CI.IV_needs_skills_joins = {};
    CI.IV_skills_needs_joins = {};
    CI.IV_users_meta_data = {};
    CI.IV_location_lookup_data = {};
    CI.IV_clusters_last_updated = {};
    CI.IV_clusters_meta_data = {};
    CI.IV_user_profile = {'profile': {}};

    // Function calls needs to call on page load
    CI.bi7initNeedsLastUpdatedGlobalListener();
    CI.bi7initSkillsLastUpdatedGlobalListener();
    CI.bi7initHashtagsLastUpdatedGlobalListener();
    CI.bi7initNeedsSkillsJoinsGlobalListener();
    CI.bi7initSkillsNeedsJoinsGlobalListener();
    CI.bi7initAllUsersDataListener();
    CI.bi7initLocationLookupDataListener();
    CI.bi7initClustersLastUpdatedGlobalListener()
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
      CI.IV_user_folder_path = '/users/guest';
    } else {
      CI.IV_user_folder_path = '/users/' + firebase_uid;
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

    var listener_location = CI.IV_user_folder_path;
    CI.IV_listener_user_info['info'] = CI.IV_firebase_db_object.ref(listener_location);

    ///// removing invalid firebase listener key
    call_result = CI.validateFirebaseListener(CI.IV_listener_user_info['info']);
    debug_data.push(call_result)
    if (call_result[CR.success] !== RC.success) {
      delete CI.IV_listener_user_info['info'];
      return_msg += "failed to create listener for " + listener_location;
      base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
      return { 'success': RC.firebase_failure, 'return_msg': return_msg, 'debug_data': debug_data };
    }
    ///// </end> removing invalid firebase listener key

    CI.IV_listener_user_info['info'].on("value", CI.UserInfoListener.bind(CI),
    function (errorObject) {
      return_msg += "firebase read failed with error data:" + errorObject;
      base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
    }.bind(CI));

    return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
  }

  UserInfoListener(data) {
    var debug_data = [];
    var call_result = {};
    var return_msg = "bi7_watchdog_firebase:UserInfoListener ";
    var task_id = "bi7_watchdog_firebase:UserInfoListener";
    
    ////// input validation 
    if (data === null) {
      return_msg += "data argument is null";
      base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
      return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
    }
    //////</end> input validation 

    var CI = this;
    var firebase_data = data.val();

    for (var field in firebase_data) {
      if (field in CI.IV_user_info) {
        if (field === "user_uid") {
          CI.bi7getUsersProfileData(firebase_data[field]);
        }
        CI.IV_user_info[field] = firebase_data[field];
      }
    }

    CI.callCallBackFunction(CI.IV_data_change_callbacks['IV_user_info']);
    return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
  }

  bi7getUsersProfileData(user_uid) {
    var debug_data = [];
    var call_result = {};
    var return_msg = "bi7_watchdog_firebase:bi7getUsersProfileData ";
    var task_id = "bi7_watchdog_firebase:bi7getUsersProfileData";
    var CI = this;

    //// input validation 
    call_result = bi1_data_validation.is_string(user_uid);
    debug_data.push(call_result);
    if (call_result[CR.success] !== RC.success) {
      return_msg += "input validation failed";
      base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
      return { 'success': call_result[CR.success], 'return_msg': return_msg, 'debug_data': debug_data };
    }
    ////</end> input validation 

    getUserProfile(
      window.G_firebase_auth.IV_email_address,
      window.G_firebase_auth.IV_id_token,
      user_uid,
      user_uid
    ).then(function(response) {
      Vue.set(CI.IV_user_profile, 'profile', response.data);
    },
    function(error) {
      return_msg += "failed to fetch user's profile for user_uid" + user_uid;
      base_i3_log(G_username, G_ip, G_page_id, task_id, RC.ajax_failure, return_msg, debug_data);
      return { 'success': RC.ajax_failure, 'return_msg': return_msg, 'debug_data': debug_data };
    });

    return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
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

  bi7initNeedsSkillsJoinsGlobalListener() {
    var debug_data = [];
    var call_result = {};
    var return_msg = "bi7_watchdog_firebase:bi7initNeedsSkillsJoinsGlobalListener ";
    var task_id = "bi7_watchdog_firebase:bi7initNeedsSkillsJoinsGlobalListener";
    var CI = this;

    if (CI.IV_instance_initialized !== true) {
      setTimeout(CI.bi7initNeedsSkillsJoinsGlobalListener.bind(CI),500);
      return;
    }

    if (CI.IV_listener_needs_skills_joins_global !== null) { return; }

    var listener_location = 'needs_skills_joins';
    CI.IV_listener_needs_skills_joins_global = CI.IV_firebase_db_object.ref(listener_location);

    ///// removing invalid firebase listener key
    call_result = CI.validateFirebaseListener(CI.IV_listener_needs_skills_joins_global);
    debug_data.push(call_result)
    if (call_result[CR.success] !== RC.success) {
      delete CI.IV_listener_needs_skills_joins_global;
      return_msg += "failed to create listener for " + listener_location;
      base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
      return { 'success': RC.firebase_failure, 'return_msg': return_msg, 'debug_data': debug_data };
    }
    ///// </end> removing invalid firebase listener key

    CI.IV_listener_needs_skills_joins_global.on("value",
      function (a_data) { CI.bi7NeedsSkillsJoinsGlobalListenerCallback(a_data) }.bind(CI),
      function (errorObject) {
        return_msg += "firebase read failed with error data:" + errorObject;
        base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
      }.bind(CI)
    );

    return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
  }

  bi7NeedsSkillsJoinsGlobalListenerCallback(data) {
    var debug_data = [];
    var call_result = {};
    var return_msg = "bi7_watchdog_firebase:bi7NeedsSkillsJoinsGlobalListenerCallback ";
    var task_id = "bi7_watchdog_firebase:bi7NeedsSkillsJoinsGlobalListenerCallback";
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

      if (need_uid in CI.IV_needs_skills_joins === false) {
        Vue.set(CI.IV_needs_skills_joins, need_uid, {});
      }

      var need_joins_data = firebase_data[need_uid];

      /// only update need's data if firebase last_updated is greater than stored last_updated
      if ("last_updated" in CI.IV_needs_skills_joins[need_uid] === false) {
        Vue.set(CI.IV_needs_skills_joins[need_uid], "last_updated", 0);
      }

      if ("last_updated" in need_joins_data === true) {
        if (CI.IV_needs_skills_joins[need_uid]["last_updated"] < need_joins_data["last_updated"]) {
          Vue.set(CI.IV_needs_skills_joins[need_uid], "last_updated", need_joins_data["last_updated"]);
        } else {
          continue;
        }
      }
      ///</end> only update need's data if firebase last_updated is greater than stored last_updated

      if ("skills" in CI.IV_needs_skills_joins[need_uid] === false) {
        Vue.set(CI.IV_needs_skills_joins[need_uid], "skills", {});
      }

      let skill_uid = need_joins_data["skill_uid"];

      if (skill_uid !== null && skill_uid !== undefined) {
        if (skill_uid in CI.IV_needs_skills_joins[need_uid]["skills"] === false) {
          Vue.set(CI.IV_needs_skills_joins[need_uid]["skills"], skill_uid, skill_uid);
        }
      }
    }

    return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
  }

  bi7initSkillsNeedsJoinsGlobalListener() {
    var debug_data = [];
    var call_result = {};
    var return_msg = "bi7_watchdog_firebase:bi7initSkillsNeedsJoinsGlobalListener ";
    var task_id = "bi7_watchdog_firebase:bi7initSkillsNeedsJoinsGlobalListener";
    var CI = this;

    if (CI.IV_instance_initialized !== true) {
      setTimeout(CI.bi7initSkillsNeedsJoinsGlobalListener.bind(CI),500);
      return;
    }

    if (CI.IV_listener_skills_needs_joins_global !== null) { return; }

    var listener_location = 'skills_needs_joins';
    CI.IV_listener_skills_needs_joins_global = CI.IV_firebase_db_object.ref(listener_location);

    ///// removing invalid firebase listener key
    call_result = CI.validateFirebaseListener(CI.IV_listener_skills_needs_joins_global);
    debug_data.push(call_result)
    if (call_result[CR.success] !== RC.success) {
      delete CI.IV_listener_skills_needs_joins_global;
      return_msg += "failed to create listener for " + listener_location;
      base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
      return { 'success': RC.firebase_failure, 'return_msg': return_msg, 'debug_data': debug_data };
    }
    ///// </end> removing invalid firebase listener key

    CI.IV_listener_skills_needs_joins_global.on("value",
      function (a_data) { CI.bi7SkillsNeedsJoinsGlobalListenerCallback(a_data) }.bind(CI),
      function (errorObject) {
        return_msg += "firebase read failed with error data:" + errorObject;
        base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
      }.bind(CI)
    );

    return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
  }

  bi7SkillsNeedsJoinsGlobalListenerCallback(data) {
    var debug_data = [];
    var call_result = {};
    var return_msg = "bi7_watchdog_firebase:bi7SkillsNeedsJoinsGlobalListenerCallback ";
    var task_id = "bi7_watchdog_firebase:bi7SkillsNeedsJoinsGlobalListenerCallback";
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

      if (skill_uid in CI.IV_skills_needs_joins === false) {
        Vue.set(CI.IV_skills_needs_joins, skill_uid, {});
      }

      var skill_joins_data = firebase_data[skill_uid];

      /// only update skill's data if firebase last_updated is greater than stored last_updated
      if ("last_updated" in CI.IV_skills_needs_joins[skill_uid] === false) {
        Vue.set(CI.IV_skills_needs_joins[skill_uid], "last_updated", 0);
      }

      if ("last_updated" in skill_joins_data === true) {
        if (CI.IV_skills_needs_joins[skill_uid]["last_updated"] < skill_joins_data["last_updated"]) {
          Vue.set(CI.IV_skills_needs_joins[skill_uid], "last_updated", skill_joins_data["last_updated"]);
        } else {
          continue;
        }
      }
      ///</end> only update skill's data if firebase last_updated is greater than stored last_updated

      if ("needs" in CI.IV_skills_needs_joins[skill_uid] === false) {
        Vue.set(CI.IV_skills_needs_joins[skill_uid], "needs", {});
      }

      let need_uid = skill_joins_data["need_uid"];

      if (need_uid !== null && need_uid !== undefined) {
        if (need_uid in CI.IV_skills_needs_joins[skill_uid]["needs"] === false) {
          Vue.set(CI.IV_skills_needs_joins[skill_uid]["needs"], need_uid, need_uid);
        }
      }
    }

    return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
  }

  bi7initAllUsersDataListener() {
    var debug_data = [];
    var call_result = {};
    var return_msg = "bi7_watchdog_firebase:bi7initAllUsersDataListener ";
    var task_id = "bi7_watchdog_firebase:bi7initAllUsersDataListener";
    var CI = this;

    if (CI.IV_instance_initialized !== true) {
      setTimeout(CI.bi7initAllUsersDataListener.bind(CI),500);
      return;
    }

    if (CI.IV_listener_all_users_data_global !== null) { return; }

    var listener_location = 'users';
    CI.IV_listener_all_users_data_global = CI.IV_firebase_db_object.ref(listener_location);

    ///// removing invalid firebase listener key
    call_result = CI.validateFirebaseListener(CI.IV_listener_all_users_data_global);
    debug_data.push(call_result)
    if (call_result[CR.success] !== RC.success) {
      delete CI.IV_listener_all_users_data_global;
      return_msg += "failed to create listener for " + listener_location;
      base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
      return { 'success': RC.firebase_failure, 'return_msg': return_msg, 'debug_data': debug_data };
    }
    ///// </end> removing invalid firebase listener key

    CI.IV_listener_all_users_data_global.on("value",
      function (a_data) { CI.bi7allUsersDataListener(a_data) }.bind(CI),
      function (errorObject) {
        return_msg += "firebase read failed with error data:" + errorObject;
        base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
      }.bind(CI)
    );

    return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
  }

  bi7allUsersDataListener(data) {
    var debug_data = [];
    var call_result = {};
    var return_msg = "bi7_watchdog_firebase:bi7allUsersDataListener ";
    var task_id = "bi7_watchdog_firebase:bi7allUsersDataListener";
    var CI = this;

    ////// input validation
    if (data === null) {
      return_msg += "data argument is null";
      base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
      return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
    }
    //////</end> input validation

    var firebase_data = data.val();

    for (let user_uid in firebase_data) {
      if (user_uid === "deletion_prevention_key") {continue;}

      if (user_uid in CI.IV_users_meta_data === false) {
        Vue.set(CI.IV_users_meta_data, user_uid, {})
      }

      let firebase_user_data = firebase_data[user_uid];

      /// only update user's data if firebase last_updated is greater than stored last_updated
      if ("last_updated" in CI.IV_users_meta_data[user_uid] === false) {
        Vue.set(CI.IV_users_meta_data[user_uid], "last_updated", 0);
      }

      if ("last_updated" in firebase_user_data === true) {
        if (CI.IV_users_meta_data[user_uid]["last_updated"] < firebase_user_data["last_updated"]) {
          Vue.set(CI.IV_users_meta_data[user_uid], "last_updated", firebase_user_data["last_updated"]);
        } else {
          continue;
        }
      }
      ///</end> only update user's data if firebase last_updated is greater than stored last_updated

      for (let user_data_key in firebase_user_data) {
        if (user_data_key === "deletion_prevention_key") {continue;}
        if (user_data_key === "last_updated") {continue;}

        /// storing user's needers data
        if (user_data_key === "needers") {
          if ("needers" in CI.IV_users_meta_data[user_uid] === false) {
            Vue.set(CI.IV_users_meta_data[user_uid], "needers", {});
          }

          var needers_list = firebase_user_data[user_data_key];

          /// only update user's needers data if firebase last_updated is greater than stored last_updated
          if ("last_updated" in CI.IV_users_meta_data[user_uid]["needers"] === false) {
            Vue.set(CI.IV_users_meta_data[user_uid]["needers"], "last_updated", 0);
          }

          if ("last_updated" in needers_list === true) {
            if (CI.IV_users_meta_data[user_uid]["needers"]["last_updated"] < needers_list["last_updated"]) {
              Vue.set(CI.IV_users_meta_data[user_uid]["needers"], "last_updated", needers_list["last_updated"]);
            } else {
              continue;
            }
          }
          ///</end> only update user's needers data if firebase last_updated is greater than stored last_updated

          for (let need_key in needers_list) {
            if (need_key === "deletion_prevention_key") {continue;}
            if (need_key === "last_updated") {continue;}

            if (need_key in CI.IV_users_meta_data[user_uid]["needers"] === false) {
              Vue.set(CI.IV_users_meta_data[user_uid]["needers"], need_key, {});
            }

            let needer_data = needers_list[need_key];
            Vue.set(CI.IV_users_meta_data[user_uid]["needers"][need_key], "last_updated", needer_data["last_updated"]);
          }
        }
        ///</end? storing user's needers data

        /// storing user's skills data
        else if (user_data_key === "skills") {
          if ("skills" in CI.IV_users_meta_data[user_uid] === false) {
            Vue.set(CI.IV_users_meta_data[user_uid], "skills", {});
          }

          var skills_list = firebase_user_data[user_data_key];

          /// only update user's skills data if firebase last_updated is greater than stored last_updated
          if ("last_updated" in CI.IV_users_meta_data[user_uid]["skills"] === false) {
            Vue.set(CI.IV_users_meta_data[user_uid]["skills"], "last_updated", 0);
          }

          if ("last_updated" in skills_list === true) {
            if (CI.IV_users_meta_data[user_uid]["skills"]["last_updated"] < skills_list["last_updated"]) {
              Vue.set(CI.IV_users_meta_data[user_uid]["skills"], "last_updated", skills_list["last_updated"]);
            } else {
              continue;
            }
          }
          ///</end> only update user's skills data if firebase last_updated is greater than stored last_updated

          for (let skill_key in skills_list) {
            if (skill_key === "deletion_prevention_key") {continue;}
            if (skill_key === "last_updated") {continue;}

            if (skill_key in CI.IV_users_meta_data[user_uid]["skills"] === false) {
              Vue.set(CI.IV_users_meta_data[user_uid]["skills"], skill_key, {});
            }

            let skill_data = skills_list[skill_key];
            Vue.set(CI.IV_users_meta_data[user_uid]["skills"][skill_key], "last_updated", skill_data["last_updated"]);
          }
          continue;
        }
        ///</end? storing user's skills data

        /// storing user's clusters data
        else if (user_data_key === "clusters") {
          // TODO- Store user's clusters information
          continue;
        }
        ///</end? storing user's clusters data

        else {
          Vue.set(CI.IV_users_meta_data[user_uid], user_data_key, firebase_user_data[user_data_key])
        }
      }
    }
    return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
  }

  bi7initLocationLookupDataListener() {
    var debug_data = [];
    var call_result = {};
    var return_msg = "bi7_watchdog_firebase:bi7initLocationLookupDataListener ";
    var task_id = "bi7_watchdog_firebase:bi7initLocationLookupDataListener";
    var CI = this;

    if (CI.IV_instance_initialized !== true) {
      setTimeout(CI.bi7initLocationLookupDataListener.bind(CI),500);
      return;
    }

    if (CI.IV_listener_location_lookup_data_global !== null) { return; }

    var listener_location = 'location_lookup_data';
    CI.IV_listener_location_lookup_data_global = CI.IV_firebase_db_object.ref(listener_location);

    ///// removing invalid firebase listener key
    call_result = CI.validateFirebaseListener(CI.IV_listener_location_lookup_data_global);
    debug_data.push(call_result)
    if (call_result[CR.success] !== RC.success) {
      delete CI.IV_listener_location_lookup_data_global;
      return_msg += "failed to create listener for " + listener_location;
      base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
      return { 'success': RC.firebase_failure, 'return_msg': return_msg, 'debug_data': debug_data };
    }
    ///// </end> removing invalid firebase listener key

    CI.IV_listener_location_lookup_data_global.on("value",
      function (a_data) { CI.bi7LocationLookupDataListenerCallback(a_data) }.bind(CI),
      function (errorObject) {
        return_msg += "firebase read failed with error data:" + errorObject;
        base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
      }.bind(CI)
    );

    return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
  }

  bi7LocationLookupDataListenerCallback(data) {
    var debug_data = [];
    var call_result = {};
    var return_msg = "bi7_watchdog_firebase:bi7LocationLookupDataListenerCallback ";
    var task_id = "bi7_watchdog_firebase:bi7LocationLookupDataListenerCallback";
    var CI = this;

    ////// input validation
    if (data === null) {
      return_msg += "data argument is null";
      base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
      return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
    }
    //////</end> input validation

    var firebase_data = data.val();

    for (let country_uid in firebase_data) {
      if (country_uid === "deletion_prevention_key") {continue;}

      if (country_uid in CI.IV_location_lookup_data === false) {
        Vue.set(CI.IV_location_lookup_data, country_uid, {});
      }

      var country_region_keys = firebase_data[country_uid];

      //// only update data if last_updated on firebase is greater than already stored last_updated
      if ("last_updated" in CI.IV_location_lookup_data[country_uid] === false) {
        Vue.set(CI.IV_location_lookup_data[country_uid], "last_updated", 0);
      }

      if ("last_updated" in country_region_keys === true) {
        if (CI.IV_location_lookup_data[country_uid]["last_updated"] < country_region_keys["last_updated"]) {
          Vue.set(CI.IV_location_lookup_data[country_uid], "last_updated", country_region_keys["last_updated"]);
        } else {
          continue;
        }
      }
      ////</end> only update data if last_updated on firebase is greater than already stored last_updated

      /// Setting contry's name and short code only if updated
      if ("1" in country_region_keys === true &&
          "short_code" in CI.IV_location_lookup_data[country_uid] === false ||
          (CI.IV_location_lookup_data[country_uid]["short_code"] !== country_region_keys["1"])) {
        Vue.set(CI.IV_location_lookup_data[country_uid], "short_code", country_region_keys["1"]);
      }

      if ("2" in country_region_keys === true &&
          "name" in CI.IV_location_lookup_data[country_uid] === false ||
          (CI.IV_location_lookup_data[country_uid]["name"] !== country_region_keys["2"])) {
        Vue.set(CI.IV_location_lookup_data[country_uid], "name", country_region_keys["2"]);
      }
      ///</end> Setting contry's name and short code only if updated

      if ("regions" in CI.IV_location_lookup_data === false) {
        Vue.set(CI.IV_location_lookup_data[country_uid], "regions", {});
      }

      for (let region_key in country_region_keys) {
        if (region_key === "deletion_prevention_key") {continue;}
        if (region_key === "last_updated") {continue;}
        if (region_key === "1") {continue;}
        if (region_key === "2") {continue;}

        if (region_key in CI.IV_location_lookup_data[country_uid]["regions"] === false) {
          Vue.set(CI.IV_location_lookup_data[country_uid]["regions"], region_key, {});
        }

        var region_area_keys = country_region_keys[region_key];

        //// only update data if last_updated on firebase is greater than already stored last_updated
        if ("last_updated" in CI.IV_location_lookup_data[country_uid]["regions"][region_key] === false) {
          Vue.set(CI.IV_location_lookup_data[country_uid]["regions"][region_key], "last_updated", 0);
        }

        if ("last_updated" in region_area_keys === true) {
          if (CI.IV_location_lookup_data[country_uid]["regions"][region_key]["last_updated"] < region_area_keys["last_updated"]) {
            Vue.set(CI.IV_location_lookup_data[country_uid]["regions"][region_key], "last_updated", region_area_keys["last_updated"]);
          } else {
            continue;
          }
        }
        ////</end> only update data if last_updated on firebase is greater than already stored last_updated
        
        /// Setting region's name and short code only if updated
        if ("1" in region_area_keys === true &&
            "short_code" in CI.IV_location_lookup_data[country_uid]["regions"][region_key] === false ||
            (CI.IV_location_lookup_data[country_uid]["regions"][region_key]["short_code"] !== region_area_keys["1"])) {
          Vue.set(CI.IV_location_lookup_data[country_uid]["regions"][region_key], "short_code", region_area_keys["1"]);
        }

        if ("2" in region_area_keys === true &&
            "name" in CI.IV_location_lookup_data[country_uid]["regions"][region_key] === false ||
            (CI.IV_location_lookup_data[country_uid]["regions"][region_key]["name"] !== region_area_keys["2"])) {
          Vue.set(CI.IV_location_lookup_data[country_uid]["regions"][region_key], "name", region_area_keys["2"]);
        }
        ///</end> Setting region's name and short code only if updated

        if ("areas" in CI.IV_location_lookup_data === false) {
          Vue.set(CI.IV_location_lookup_data[country_uid]["regions"][region_key], "areas", {});
        }

        for (let area_key in region_area_keys) {
          if (area_key === "deletion_prevention_key") {continue;}
          if (area_key === "last_updated") {continue;}
          if (area_key === "1") {continue;}
          if (area_key === "2") {continue;}

          if (area_key in CI.IV_location_lookup_data[country_uid]["regions"][region_key]["areas"] === false) {
            Vue.set(CI.IV_location_lookup_data[country_uid]["regions"][region_key]["areas"], area_key, {});
          }

          var area_data = region_area_keys[area_key];
          Vue.set(CI.IV_location_lookup_data[country_uid]["regions"][region_key]["areas"][area_key], "zip", area_data["1"]);
          Vue.set(CI.IV_location_lookup_data[country_uid]["regions"][region_key]["areas"][area_key], "last_updated", area_data["last_updated"]);
        }

      }
    }

    return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
  }

  bi7initClustersLastUpdatedGlobalListener() {
    var debug_data = [];
    var call_result = {};
    var return_msg = "bi7_watchdog_firebase:bi7initClustersLastUpdatedGlobalListener ";
    var task_id = "bi7_watchdog_firebase:bi7initClustersLastUpdatedGlobalListener";
    var CI = this;

    if (CI.IV_instance_initialized !== true) {
      setTimeout(CI.bi7initClustersLastUpdatedGlobalListener.bind(CI),500);
      return;
    }

    if (CI.IV_listener_clusters_last_updated_global !== null) { return; }

    var listener_location = 'clusters_last_updated';
    CI.IV_listener_clusters_last_updated_global = CI.IV_firebase_db_object.ref(listener_location);

    ///// removing invalid firebase listener key
    call_result = CI.validateFirebaseListener(CI.IV_listener_clusters_last_updated_global);
    debug_data.push(call_result)
    if (call_result[CR.success] !== RC.success) {
      delete CI.IV_listener_clusters_last_updated_global;
      return_msg += "failed to create listener for " + listener_location;
      base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
      return { 'success': RC.firebase_failure, 'return_msg': return_msg, 'debug_data': debug_data };
    }
    ///// </end> removing invalid firebase listener key

    CI.IV_listener_clusters_last_updated_global.on("value",
      function (a_data) { CI.bi7ClustersLastUpdatedGlobalListenerCallback(a_data) }.bind(CI),
      function (errorObject) {
        return_msg += "firebase read failed with error data:" + errorObject;
        base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
      }.bind(CI)
    );

    return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
  }

  bi7ClustersLastUpdatedGlobalListenerCallback(data) {
    var debug_data = [];
    var call_result = {};
    var return_msg = "bi7_watchdog_firebase:bi7ClustersLastUpdatedGlobalListenerCallback ";
    var task_id = "bi7_watchdog_firebase:bi7ClustersLastUpdatedGlobalListenerCallback";
    var CI = this;

    ////// input validation
    if (data === null) {
      return_msg += "data argument is null";
      base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
      return { 'success': RC.input_validation_failed, 'return_msg': return_msg, 'debug_data': debug_data };
    }
    //////</end> input validation

    var firebase_data = data.val();

    for (let country_key in firebase_data) {
      if (country_key === "deletion_prevention_key") {continue;}
      if (country_key === "None") {continue;}

      if (country_key in CI.IV_clusters_last_updated === false) {
        Vue.set(CI.IV_clusters_last_updated, country_key, {});
      }

      var regions_wise_data = firebase_data[country_key];
      for (let region_key in regions_wise_data) {
        if (region_key === "deletion_prevention_key") {continue;}

        if (region_key in CI.IV_clusters_last_updated[country_key] === false) {
          Vue.set(CI.IV_clusters_last_updated[country_key], region_key, {});
        }

        var areas_wise_data = regions_wise_data[region_key];
        for (let area_key in areas_wise_data) {
          if (area_key === "deletion_prevention_key") {continue;}

          if (area_key in CI.IV_clusters_last_updated[country_key][region_key] === false) {
            Vue.set(CI.IV_clusters_last_updated[country_key][region_key], area_key, {});
          }

          var date_wise_data = areas_wise_data[area_key];
          for (let date_key in date_wise_data) {
            if (date_key === "deletion_prevention_key") {continue;}

            if (date_key in CI.IV_clusters_last_updated[country_key][region_key][area_key] === false) {
              Vue.set(CI.IV_clusters_last_updated[country_key][region_key][area_key], date_key, {});
            }

            var hours_wise_data = date_wise_data[date_key];
            for (let hour_key in hours_wise_data) {
              if (hour_key === "deletion_prevention_key") {continue;}

              if (hour_key in CI.IV_clusters_last_updated[country_key][region_key][area_key][date_key] === false) {
                Vue.set(CI.IV_clusters_last_updated[country_key][region_key][area_key][date_key], hour_key, {});
              }

              var cluster_uids_list = hours_wise_data[hour_key];
              for (let cluster_uid in cluster_uids_list) {
                if (cluster_uid === "deletion_prevention_key") {continue;}

                if (cluster_uid in CI.IV_clusters_last_updated[country_key][region_key][area_key][date_key][hour_key] === false) {
                  Vue.set(CI.IV_clusters_last_updated[country_key][region_key][area_key][date_key][hour_key], cluster_uid, {});
                }

                let firebase_last_updated = cluster_uids_list[cluster_uid]["last_updated"];
                if (firebase_last_updated === null || firebase_last_updated === undefined) {continue;}

                /// only updating and fetching metadata for clusters
                /// which last_updated_at is greater than already saved metadata
                if ('last_updated' in CI.IV_clusters_last_updated[country_key][region_key][area_key][date_key][hour_key][cluster_uid] === false || 
                    CI.IV_clusters_last_updated[country_key][region_key][area_key][date_key][hour_key][cluster_uid]['last_updated'] === null ||
                    CI.IV_clusters_last_updated[country_key][region_key][area_key][date_key][hour_key][cluster_uid]['last_updated'] === undefined) {
                  Vue.set(CI.IV_clusters_last_updated[country_key][region_key][area_key][date_key][hour_key][cluster_uid], 'last_updated', firebase_last_updated);
                  CI.bi7GetClusterMetaDataOnce(cluster_uid);
                } else if (CI.IV_clusters_last_updated[country_key][region_key][area_key][date_key][hour_key][cluster_uid]['last_updated'] < firebase_last_updated) {
                  Vue.set(CI.IV_clusters_last_updated[country_key][region_key][area_key][date_key][hour_key][cluster_uid], 'last_updated', firebase_last_updated);
                  CI.bi7GetClusterMetaDataOnce(cluster_uid);
                }
                ///</end> only updating and fetching metadata for clusters
                ///</end> which last_updated_at is greater than already saved metadata
              }
            }
          }
        }
      }
    }

    return { 'success': RC.success, 'return_msg': return_msg, 'debug_data': debug_data };
  }

  bi7GetClusterMetaDataOnce(cluster_uid) {
    var debug_data = [];
    var call_result = {};
    var return_msg = "bi7_watchdog_firebase:bi7GetClusterMetaDataOnce ";
    var task_id = "bi7_watchdog_firebase:bi7GetClusterMetaDataOnce";
    var CI = this;

    ////// input validation 

    // TODO!~ mu- confirm format and create validation function in base_i1
    // call_result = bi1_data_validation.is_cluster_uid(cluster_uid);
    // debug_data.push(call_result);
    // if (call_result[CR.success] !== RC.success) {
    //   return_msg += "input validation failed";
    //   base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
    //   return { 'success': call_result[CR.success], 'return_msg': return_msg, 'debug_data': debug_data };
    // }
    //////</end> input validation 

    var listener_location = `clusters/${cluster_uid}`;
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
      function (a_data) { CI.bi7ClusterMetaDataOnceCallback(cluster_uid, a_data) }.bind(CI),
      function (errorObject) {
        return_msg += "firebase read failed with error data:" + errorObject;
        base_i3_log(G_username, G_ip, G_page_id, task_id, RC.firebase_failure, return_msg, debug_data);
      }.bind(CI)
    );
  }

  bi7ClusterMetaDataOnceCallback(cluster_uid, data) {
    var debug_data = [];
    var call_result = {};
    var return_msg = "bi7_watchdog_firebase:bi7ClusterMetaDataOnceCallback ";
    var task_id = "bi7_watchdog_firebase:bi7ClusterMetaDataOnceCallback";
    var CI = this;

    ////// input validation 

    // TODO!~ mu- confirm format and create validation function in base_i1
    // call_result = bi1_data_validation.is_cluster_uid(cluster_uid);
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


    if (cluster_uid in CI.IV_clusters_meta_data === false) {
      Vue.set(CI.IV_clusters_meta_data, cluster_uid, {});
    }

    let cluster_data = {
      cluster_uid: firebase_data["cluster_uid"] ? firebase_data["cluster_uid"] : "",
      expiration_date: firebase_data["expiration_date"] ? firebase_data["expiration_date"] : "",
      last_updated: firebase_data["last_updated"] ? firebase_data["last_updated"] : "",
      location: firebase_data["location"] ? firebase_data["location"] : "",
      needer_uid: firebase_data["needer_uid"] ? firebase_data["needer_uid"] : "",
      users: {}
    }

    if ('users' in firebase_data === true) {

      for (let user_key in firebase_data['users']) {
        if (user_key === "deletion_prevention_key") {continue;}

        cluster_data["users"][user_key] = firebase_data['users'][user_key];
      }
    }

    Vue.set(CI.IV_clusters_meta_data, cluster_uid, cluster_data);

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
