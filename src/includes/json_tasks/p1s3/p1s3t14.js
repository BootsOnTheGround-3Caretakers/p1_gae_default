/* eslint-disable */
import bi1_data_validation from '../../base_i1_datavalidation'
import { RC, CR, AJRS } from '../../base_i2_success_codes'
import base_i3_log from '../../base_i3_logging'
import { ajax } from 'noquery-ajax'

function removeUserHashtag(firebase_email, firebase_token, user_uid, hashtag_uid) {
  return new Promise(function (resolve, reject) {
    var return_msg = "";
    var debug_data = [];
    var call_result = {};
    var task_id = "p1s3t14removeUserHashtag";
    var response_data = {};

    ///// input validation
    call_result = bi1_data_validation.is_email_address(firebase_email);
    debug_data.push(call_result);
    call_result = bi1_data_validation.is_string(firebase_token);
    debug_data.push(call_result);
    // call_result = bi1_data_validation.is_user_uid(user_uid);
    // debug_data.push(call_result);
    // call_result = bi1_data_validation.is_hashtag_uid(hashtag_uid);
    // debug_data.push(call_result);

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
    
    ajax({
      url: 'https://p1s3-web-requests-dot-aqueous-choir-160420.appspot.com/p1s3t14-remove-user-hashtag',
      method: 'POST',
      data: {
        'p1s3_firebase_email': firebase_email,
        'p1s3_token': firebase_token,
        'p1s3t14_user_uid': user_uid,
        'p1s3t14_hashtag_uid': hashtag_uid
      },
      success: function (result) {
        response_data = result;
        resolve({ success: RC.success, return_msg: return_msg, debug_data: debug_data, response_data: response_data});
      },
      error: function (result) {
        return_msg += "failed to remove hashtag from a user, error data:" + JSON.stringify(result);
        base_i3_log(G_username, G_ip, G_page_id, task_id, RC.ajax_failure, return_msg, debug_data);
        reject({ success: RC.ajax_failure, return_msg: return_msg, debug_data: debug_data, response_data: response_data});
      }
    })
  });
};


export default removeUserHashtag