<template>
  <div class="container mt-4 text-left">
    <div class="d-flex justify-content-between mb-3">
      <h2>Hashtags Management</h2>
      <button @click.stop="openAssignHashtagModal" class="btn btn-primary">Add new Hashtag</button>
    </div>
    <div class="row mt-3">
      <div class="col-md-12">
        <div class="table-responsive">
          <table id="mytable" class="table table-bordred table-striped">
            <thead>
              <th>#</th>
              <th>Name</th>
              <th>Description</th>
              <th>Remove</th>
            </thead>
            <tbody>
              <tr v-for="(hashtag, key, index) in usersHashtags" :key="key">
                <td>{{index+1}}</td>
                <td>{{hashtag.name}}</td>
                <td>{{hashtag.description}}</td>
                <td>
                  <p data-placement="top" title="Delete">
                    <button @click.stop="removeHashtagConfirm(key)" class="btn btn-danger btn-xs" >
                      <i class="fas fa-trash"></i>
                    </button>
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <assign-hashtag-to-user-modal ref="addHashtagToUserForm" @assign-hashtag="assignHashtag"></assign-hashtag-to-user-modal>
  </div>
</template>

<script>
import assignHashtagToUserModal from '../form_modals/assign_hashtag_to_user_modal'
import assignUserHashtag from '../../includes/json_tasks/p1s3/p1s3t13.js'
import removeUserHashtag from '../../includes/json_tasks/p1s3/p1s3t14.js'
import AWN from "awesome-notifications";

export default {
  props: ["usersHashtags"],
  components: {assignHashtagToUserModal},
  methods: {
    openAssignHashtagModal() {
      this.$refs.addHashtagToUserForm.open();
    },
    assignHashtag(hashtag_data) {
      var popup_options = {
        labels: {
          async: "Assigning the Hashtag.",
        },
        position: "center",
        duration: 3000,
      };
      let notifier = new AWN(popup_options);

      var resp = assignUserHashtag(
        window.G_firebase_auth.IV_email_address,
        window.G_firebase_auth.IV_id_token,
        window.G_firebase_data.IV_user_info["user_uid"],
        hashtag_data.hashtag_uid
      );

      notifier.async(resp,
        (res) => {
          notifier.success(`Hashtag has been added successfully. Hashtag will be available in your list shortly`);

          // Adding 2s delay to wait for server updates data.
          setTimeout(function() { 
            window.G_firebase_data.bi7getUsersProfileData(window.G_firebase_data.IV_user_info["user_uid"]);
          }, 2000);
        },
        (error) => {
          notifier.alert("There was an error adding the Hashtag, Please try again later.");
        } 
      );
    },
    removeHashtagConfirm(key) {
      let notifier = new AWN();
      var vm = this;
      let onOk = () => {
        vm.removeHashtag(key);
      };
      let onCancel = () => {};
      notifier.confirm(
        'You want to remove/unassign this hashtag',
        onOk,
        onCancel,
        {
          labels: {
            confirm: 'Are you sure?'
          }
        }
      )
    },
    removeHashtag(key) {
      var popup_options = {
        labels: {
          async: "Removing the hashtag from your list.",
        },
        position: "center",
        duration: 3000,
      };
      let notifier = new AWN(popup_options);

      var resp = removeUserHashtag(
        window.G_firebase_auth.IV_email_address,
        window.G_firebase_auth.IV_id_token,
        window.G_firebase_data.IV_user_info["user_uid"],
        key
      );

      notifier.async(resp,
        (res) => {
          notifier.success(`Hashtag been removed successfully.`);
        },
        (error) => {
          notifier.alert("There was an error removing the hashtag, Please try again later.");
        } 
      );
    }
  }
}
</script>

<style scoped> 
  .table-responsive {
    height: 60vh;
  }
</style>