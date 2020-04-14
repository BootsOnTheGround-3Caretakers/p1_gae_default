/* eslint-disable */
import bi1_data_validation from '../../base_i1_datavalidation'
import { RC, CR, AJRS } from '../../base_i2_success_codes'
import base_i3_log from '../../base_i3_logging'
import { ajax } from 'noquery-ajax'

function createSkill(firebase_email, firebase_token, skill_name, skill_type, description=null, certifications_needed=null) {
  return new Promise(function (resolve, reject) {
    var return_msg = "";
    var debug_data = [];
    var call_result = {};
    var task_id = "p1s3t6CreateSkill";
    var response_data = {};

    ///// input validation
    call_result = bi1_data_validation.is_email_address(firebase_email);
    debug_data.push(call_result);
    call_result = bi1_data_validation.is_string(firebase_token);
    debug_data.push(call_result);
    call_result = bi1_data_validation.is_string(skill_name);
    debug_data.push(call_result);
    call_result = bi1_data_validation.is_string(skill_type);
    debug_data.push(call_result);

    if (certifications_needed !== null) {
      call_result = bi1_data_validation.is_string(certifications_needed);
      debug_data.push(call_result);
    }

    if (description !== null) {
      call_result = bi1_data_validation.is_string(description);
      debug_data.push(call_result);
    }

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
      url: 'https://p1s3-web-requests-dot-aqueous-choir-160420.appspot.com/p1s3t6-create-skill',
      method: 'POST',
      data: {
        'p1s3_firebase_email': firebase_email,
        'p1s3_token': firebase_token,
        'p1s3t6_skill_name': skill_name,
        'p1s3t6_skill_type': skill_type,
        'p1s3t6_description': description,
        'p1s3t6_certifications_needed': certifications_needed
      },
      success: function (result) {
        response_data = result;
        resolve({ success: RC.success, return_msg: return_msg, debug_data: debug_data, response_data: response_data});
      },
      error: function (result) {
        return_msg += "failed to create the skill, error data:" + JSON.stringify(result);
        base_i3_log(G_username, G_ip, G_page_id, task_id, RC.ajax_failure, return_msg, debug_data);
        reject({ success: RC.ajax_failure, return_msg: return_msg, debug_data: debug_data, response_data: response_data});
      }
    })
  });
};


export default createSkill