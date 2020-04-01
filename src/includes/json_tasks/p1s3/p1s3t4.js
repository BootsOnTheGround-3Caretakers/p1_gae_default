/* eslint-disable */
import bi1_data_validation from '../../base_i1_datavalidation'
import { RC, CR, AJRS } from '../../base_i2_success_codes'
import base_i3_log from '../../base_i3_logging'
import { ajax } from 'noquery-ajax'


// user_information = {user_uid, first_name, last_name, phone_number, 
// phone_texts, phone_2, emergency_contact, home_address,
// email_address, p1s3t4_firebase_uid, country_uid, 
// region_uid, area_uid, description, preferred_radius,
// account_flags, location_cord_long, location_cord_lat}


function modifyUserInformation(user_information) {
  return new Promise(function (resolve, reject) {
    var return_msg = "";
    var debug_data = [];
    var call_result = {};
    var task_id = "p1s3t4ModifyUserInformation";
    var response_data = {};

    var optional_keys = [
      'first_name', 'last_name', 'phone_number', 'phone_texts', 'phone_2', 
      'emergency_contact', 'home_address', 'country_uid', 'region_uid', 
      'area_uid', 'description', 'preferred_radius',  'account_flags'
    ];

    ///// input validation
    call_result = bi1_data_validation.is_not_null(user_information);
    debug_data.push(call_result);
    call_result = bi1_data_validation.is_user_uid(user_information[user_uid]);
    debug_data.push(call_result);

    for (let index in optional_keys) {
      let key = optional_keys[index];

      if (key in user_information === true && user_information[key] !== undefined) {
        call_result = bi1_data_validation.is_string(user_information[key]);
        debug_data.push(call_result);
      } else {
        user_information[key] = null;
      }
    }

    ///// validation of semi-optional attributes
    if ('location_cord_lat' in user_information['location_cord_lat'] === true && user_information['location_cord_lat'] !== undefined) {
      call_result = bi1_data_validation.is_string_number(user_information['location_cord_lat']);
      debug_data.push(call_result);
    } else {
      user_information['location_cord_lat'] = null;
    }

    if ('location_cord_long' in user_information['location_cord_long'] === true && user_information['location_cord_long'] !== undefined) {
      call_result = bi1_data_validation.is_string_number(user_information['location_cord_long']);
      debug_data.push(call_result);
    } else {
      user_information['location_cord_long'] = null;
    }

    if ('firebase_uid' in user_information['firebase_uid'] === true && user_information['firebase_uid'] !== undefined) {
      call_result = bi1_data_validation.is_string(user_information['firebase_uid']);
      debug_data.push(call_result);
    } else {
      user_information['firebase_uid'] = null;
    }

    if ('email_address' in user_information['email_address'] === true && user_information['email_address'] !== undefined) {
      call_result = bi1_data_validation.is_email_address(user_information['email_address']);
      debug_data.push(call_result);
    } else {
      user_information['email_address'] = null;
    }
    /////</end> validation of semi-optional attributes

    var validation_failed_flag = false;
    for (var index in debug_data) {
      if (debug_data[index][CR.success] !== RC.success) {
        validation_failed_flag = true;
        break;
      }
    }

    if (validation_failed_flag === true) {
      return_msg += "input validation failed";
      base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
      reject({ success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data, response_data: response_data });
      return;
    }
    /////</end> input validation

    //// Generating data dictionary to send with JSON post request
    var data = {};
    data['p1s3t4_user_uid'] = user_information['user_uid'];

    for (let index in optional_keys) {
      let key = optional_keys[index];

      if (user_information[key] !== null) {
        data[`p1s3t4_${key}`] = user_information[key];
      }
    }
    
    // We need both arguments present, or We'll not send in data dictionary single of these
    if (user_information['location_cord_long'] !== null && user_information['location_cord_long'] !== undefined &&
        user_information['location_cord_lat'] !== null && user_information['location_cord_lat'] !== undefined) {
      data[`p1s3t4_location_cord_long`] = user_information['location_cord_long'];
      data[`p1s3t4_location_cord_lat`] = user_information['location_cord_lat'];
    }

    // We need both arguments present, or We'll not send in data dictionary single of these
    if (user_information['email_address'] !== null && user_information['email_address'] !== undefined &&
        user_information['firebase_uid'] !== null && user_information['firebase_uid'] !== undefined) {
      data[`p1s3t4_email_address`] = user_information['email_address'];
      data[`p1s3t4_firebase_uid`] = user_information['firebase_uid'];
    }
    ////</end Generating data dictionary to send with JSON post request

    ajax({
      url: window.G_ajax_test_domain + '/s3/p1s3t4-modify-user-information',
      method: 'POST',
      data: data,
      success: function (result) {
        response_data = result;
        resolve({ success: RC.success, return_msg: return_msg, debug_data: debug_data, response_data: response_data});
      },
      error: function (result) {
        return_msg += "failed to modify user information, error data:" + JSON.stringify(result);
        base_i3_log(G_username, G_ip, G_page_id, task_id, RC.ajax_failure, return_msg, debug_data);
        reject({ success: RC.ajax_failure, return_msg: return_msg, debug_data: debug_data, response_data: response_data});
      }
    })
  });
};

export default modifyUserInformation