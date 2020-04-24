/* eslint-disable */
import bi1_data_validation from '../../base_i1_datavalidation'
import { RC, CR, AJRS } from '../../base_i2_success_codes'
import base_i3_log from '../../base_i3_logging'
import { ajax } from 'noquery-ajax'

function createModifyNeedeRequest(firebase_email, firebase_token, user_uid, public_metadata=null, private_metadata=null, needer_uid=null) {
  return new Promise(function (resolve, reject) {
    var return_msg = "";
    var debug_data = [];
    var call_result = {};
    var task_id = "p1s3t12CreateModifyNeedeRequest";
    var response_data = {};

    ///// input validation
    call_result = bi1_data_validation.is_email_address(firebase_email);
    debug_data.push(call_result);
    call_result = bi1_data_validation.is_string(firebase_token);
    debug_data.push(call_result);
    // call_result = bi1_data_validation.is_user_uid(user_uid);
    // debug_data.push(call_result);
    // call_result = bi1_data_validation.is_user_uid(needer_uid);
    // debug_data.push(call_result);

    if (public_metadata !== null) {
      call_result = bi1_data_validation.is_string(public_metadata);
      debug_data.push(call_result);
    }
    if (private_metadata !== null) {
      call_result = bi1_data_validation.is_string(private_metadata);
      debug_data.push(call_result);
    }


    if (call_result[CR.success] !== RC.success) {
      return_msg += "input validation failed";
      base_i3_log(G_username, G_ip, G_page_id, task_id, RC.input_validation_failed, return_msg, debug_data);
      reject({ success: RC.input_validation_failed, return_msg: return_msg, debug_data: debug_data, response_data: response_data });
      return;
    }
    /////</end> input validation

    ajax({
      url: 'https://p1s3-web-requests-dot-aqueous-choir-160420.appspot.com/p1s3t12-create-modify-needer-request',
      method: 'POST',
      data: {
        'p1s3_firebase_email': firebase_email,
        'p1s3_token': firebase_token,
        'p1s3t12_user_uid': user_uid,
        'p1s3t12_needer_uid': needer_uid,
        'p1s3t12_public_metadata': public_metadata,
        'p1s3t12_private_metadata': private_metadata
      },
      success: function (result) {
        response_data = result;
        resolve({ success: RC.success, return_msg: return_msg, debug_data: debug_data, response_data: response_data});
      },
      error: function (result) {
        return_msg += "failed to create needer request, error data:" + JSON.stringify(result);
        base_i3_log(G_username, G_ip, G_page_id, task_id, RC.ajax_failure, return_msg, debug_data);
        reject({ success: RC.ajax_failure, return_msg: return_msg, debug_data: debug_data, response_data: response_data});
      }
    })
  });
};


export default createModifyNeedeRequest