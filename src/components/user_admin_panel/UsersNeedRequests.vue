<template>
  <div class="container mt-3 text-left">
    <h2>Need Requests Management</h2>
    <div class="row mt-3">
      <div class="col-md-12">
        <div class="d-flex justify-content-between mb-3">
          <h4>Available need requests</h4>
          <button @click.stop="createNeedRequest" class="btn btn-primary">Create Need Request</button>
        </div>
        <div class="table-responsive">
          <table id="mytable" class="table table-bordred table-striped">
            <thead>
              <th>#</th>
              <th>Primary Need</th>
              <th>Cluster</th>
              <!-- <th>Edit</th> -->
              <!-- <th>Delete</th> -->
            </thead>
            <tbody>
              <tr v-for="(need, key, index) in DV_needRequests" :key="key">
                <td>{{index+1}}</td>
                <td>{{key}}</td>
                <td>Partial</td>
                <!-- <td>
                  <p data-placement="top" title="Edit">
                    <button class="btn btn-primary btn-xs" >
                      <span class="glyphicon glyphicon-pencil"></span>
                    </button>
                  </p>
                </td> -->
                <!-- <td>
                  <p data-placement="top" title="Delete">
                    <button @click.stop="deleteNeed" class="btn btn-danger btn-xs" >
                      <span class="glyphicon glyphicon-trash"></span>
                    </button>
                  </p>
                </td> -->
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import createNeederRequest from '../../includes/json_tasks/p1s3/p1s3t12'
import AWN from "awesome-notifications";

export default {
  props: ["users-needers"],
  data() {
    return {
      DV_needRequests: {},
    }
  },
  methods: {
    createNeedRequest() {
      var popup_options = {
        labels: {
          async: "Creating new need request.",
        },
        position: "center",
        duration: 3000,
      };
      let notifier = new AWN(popup_options);

      var resp = createNeederRequest(
        window.G_firebase_auth.IV_email_address,
        window.G_firebase_auth.IV_id_token,
        window.G_firebase_data.IV_user_info['user_uid']
      )
      vm = this;
      notifier.async(resp,
        (res) => {
          notifier.success(`New need request has been created successfully.`);
          vm.createNeed();
        },
        (error) => {
          notifier.alert("There was an error creating the need request, Please try again later.");
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