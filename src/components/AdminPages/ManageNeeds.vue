<template>
  <div class="container mt-3 text-left">
    <h2>Needs Management</h2>
    <div class="row mt-3">
      <div class="col-md-12">
        <div class="d-flex justify-content-between mb-3">
          <h4>Available needs</h4>
          <button @click.stop="addNewNeed" class="btn btn-primary">Add new Need</button>
        </div>
        <div class="table-responsive">
          <table id="mytable" class="table table-bordred table-striped">
            <thead>
              <th>#</th>
              <th>Name</th>
              <th>Requirement</th>
              <!-- <th>Edit</th> -->
              <th>Delete</th>
            </thead>
            <tbody>
              <tr v-for="(need, key, index) in DV_needs" :key="key">
                <td>{{index+1}}</td>
                <td>{{need.name}}</td>
                <td>{{need.requirements}}</td>
                <!-- <td>
                  <p data-placement="top" title="Edit">
                    <button class="btn btn-primary btn-xs" >
                      <span class="glyphicon glyphicon-pencil"></span>
                    </button>
                  </p>
                </td> -->
                <td>
                  <p data-placement="top" title="Delete">
                    <button @click.stop="deleteNeed" class="btn btn-danger btn-xs" >
                      <span class="glyphicon glyphicon-trash"></span>
                    </button>
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <create-need-modal ref="needForm" @save-need="saveNeed"></create-need-modal>
  </div>
</template>

<script>
import CreateNeedModal from '../form_modals/create_need_modal'
import createNeed from '../../includes/json_tasks/p1s3/p1s3t1'
import AWN from "awesome-notifications";

export default {
  components: {CreateNeedModal},
  data() {
    return {
      DV_needs: {}
    }
  },
  mounted() {
    this.DV_needs = window.vue_instance.$data.firebaseData.needsMetaData;
  },
  methods: {
    saveNeed(need) {
      var popup_options = {
        labels: {
          async: "Saving the need entry.",
        },
        position: "center",
        duration: 3000,
      };
      let notifier = new AWN(popup_options);

      var resp = createNeed(
        window.G_firebase_auth.IV_email_address,
        window.G_firebase_auth.IV_id_token,
        need.name,
        need.requirements
      );

      notifier.async(resp,
        (res) => {
          notifier.success(`New need has been created successfully.`);
        },
        (error) => {
          notifier.alert("There was an error creating the need, Please try again later.");
        } 
      );
    },
    addNewNeed() {
      this.$refs.needForm.open();
    },
    deleteNeed(need_uid) {
      let notifier = new AWN();
      let onOk = () => {
        alert("TODO, confirm if we want to give this option to user");
        // window.G_firebase_data.bi7DeleteNeed(need_uid);
      };
      let onCancel = () => {};
      notifier.confirm(
        'You want to delete this need',
        onOk,
        onCancel,
        {
          labels: {
            confirm: 'Are you sure?'
          }
        }
      )
    }
  }
}
</script>

<style scoped> 
  .table-responsive {
    height: 60vh;
  }
</style>