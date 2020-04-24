<template>
  <div class="container mt-3 text-left">
    <div class="d-flex justify-content-between mb-3">
      <h2>Need Requests Management</h2>
      <button @click.stop="openCreateNeedRequestModal" class="btn btn-primary">Create Need Request</button>
    </div>
    <div class="row mt-3">
      <div class="col-md-12">
        <div class="table-responsive">
          <table class="table table-bordred table-striped">
            <thead>
              <th>#</th>
              <th>Primary Need</th>
              <th>Cluster</th>
              <th>Edit</th>
              <th>Delete</th>
            </thead>
            <tbody>
              <tr v-for="(need, key, index) in DV_needRequests" :key="key">
                <td>{{index+1}}</td>
                <td>
                  <h3 class="float-left" v-if="DV_selectedNeeder === key">{{neederDisplayName(key)}}</h3>
                  <span 
                    v-else
                    @click.stop="DV_selectedNeeder = key" 
                    class="pointer text-primary"
                  >{{neederDisplayName(key)}}</span>

                  <span class="float-right d-flex" v-if="DV_selectedNeeder === key">
                    <p class="mr-2" data-placement="top" title="Edit">
                      <button @click.stop="editNeedRequest(key)" class="btn btn-primary btn-xs" >
                        <i class="fas fa-pencil"></i>
                      </button>
                    </p>
                    <p data-placement="top" title="Delete">
                      <button class="btn btn-danger btn-xs" >
                        <i class="fas fa-trash"></i>
                      </button>
                    </p>
                  </span>
                  <div v-if="DV_selectedNeeder === key" class="row box clearfix position-relative">
                    <div class="col-10">
                      <table class="table table-bordred table-striped">
                        <thead>
                          <th>#</th>
                          <th>Need</th>
                          <th>Special Notes</th>
                          <th>Remove</th>
                        </thead>
                        <tbody>
                          <tr v-for="(need, index1) in DV_needRequests[key].needs">
                            <td>{{index1+1}}</td>
                            <td>{{need.name}}</td>
                            <td>{{need.special_notes}}</td>
                            <td>
                              <p data-placement="top" title="Remove">
                                <button @click.stop="deleteNeed" class="btn btn-danger btn-xs" >
                                  <i class="fas fa-trash"></i>
                                </button>
                              </p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div class="col-2 buttons-position">
                      <button @click.stop="openAddNeedModal" class="w_10 btn btn-primary mb-2">+ Need</button>
                      <button @click.stop="DV_selectedNeeder = ''" class="w_10 btn btn-danger">Close</button>
                    </div>
                  </div>
                </td>
                <td><span v-if="DV_selectedNeeder !== key">Partial</span></td>
                <td>
                  <p v-if="DV_selectedNeeder !== key" data-placement="top" title="Edit">
                    <button @click.stop="editNeedRequest(key)" class="btn btn-primary btn-xs" >
                      <i class="fas fa-pencil"></i>
                    </button>
                  </p>
                </td>
                <td>
                  <p v-if="DV_selectedNeeder !== key" data-placement="top" title="Remove">
                    <button @click.stop="deleteNeed" class="btn btn-danger btn-xs" >
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
    <create-modify-need-to-needer-modal 
      ref="addNeedtoNeedRequestForm" 
      @assign-need="addNeedToNeeder"
    ></create-modify-need-to-needer-modal>
    <create-modify-need-request-modal 
      ref="createNeedRequestModal" 
      :need-request="DV_needRequests[DV_editNeederUid]"
      @edit-form-closed="DV_editNeederUid=''"
      @create-need-request="saveNeedRequest"
    ></create-modify-need-request-modal>
  </div>
</template>

<script>
import createModifyNeedToNeederModal from '../form_modals/create_modify_need_to_needer_modal'
import createModifyNeedRequestModal from '../form_modals/create_modify_need_request_modal'
import createModifyNeedeRequest from '../../includes/json_tasks/p1s3/p1s3t12'
import assignNeedToNeeder from '../../includes/json_tasks/p1s3/p1s3t2'
import AWN from "awesome-notifications";

export default {
  props: ["usersNeeders"],
  components: {createModifyNeedToNeederModal, createModifyNeedRequestModal},
  data() {
    return {
      DV_selectedNeeder: "",
      DV_editNeederUid: "",

      // TODO- Using temp data for now, We'll get real needers data from prop usersNeeders
      DV_needRequests: {
        "5709989402378240" : {
          "public_metadata": "Sample Public Metadata",
          "private_metadata": "Sample Private Metadata",
          "needs": [
            {
              "need_uid" : "5713573250596864",
              "special_notes" : "special requests 5713573250596864",
              "description": "Test description",
              "name": "Grocery need"
            },
            {
              "need_uid" : "5713573250596865",
              "special_notes" : "special requests 5713573250596865",
              "description": "Description 2",
              "name": "Delivery need"
            },
            {
              "need_uid" : "5713573250596866",
              "special_notes" : "special requests 5713573250596866",
              "description": "Test description 3",
              "name": "Water need"
            },
            {
              "need_uid" : "5713573250596864",
              "special_notes" : "special requests 5713573250596864",
              "description": "Test description",
              "name": "Grocery need"
            },
            {
              "need_uid" : "5713573250596865",
              "special_notes" : "special requests 5713573250596865",
              "description": "Description 2",
              "name": "Delivery need"
            },
            {
              "need_uid" : "5713573250596866",
              "special_notes" : "special requests 5713573250596866",
              "description": "Test description 3",
              "name": "Water need"
            }
          ]
        },
        "5709989402378241" : {
          "public_metadata": "Sample Public Metadata",
          "private_metadata": "Sample Private Metadata",
          "needs": [
            {
              "need_uid" : "5713573250596867",
              "special_notes" : "special requests 5713573250596867",
              "description": "Test description",
              "name": "Delivery need"
            },
            {
              "need_uid" : "5713573250596868",
              "special_notes" : "special requests 5713573250596868",
              "description": "Description 2",
              "name": "Grocery need"
            },
            {
              "need_uid" : "5713573250596869",
              "special_notes" : "special requests 5713573250596869",
              "description": "Test description 3",
              "name": "Water need"
            }
          ]
        }
      }
    }
  },
  methods: {
    neederDisplayName(key) {
      let needer = this.DV_needRequests[key];
      if (needer.length > 0) {
        if (needer[0].name) {
          return needer[0].name;
        }
      }
      return key;
    },
    saveNeedRequest(data) {
      var popup_options = {
        labels: {
          async: "Creating new need request.",
        },
        position: "center",
        duration: 3000,
      };
      let notifier = new AWN(popup_options);

      var resp = createModifyNeedeRequest(
        window.G_firebase_auth.IV_email_address,
        window.G_firebase_auth.IV_id_token,
        window.G_firebase_data.IV_user_info['user_uid'],
        data.public_metadata,
        data.private_metadata,
        this.DV_editNeederUid
      )

      notifier.async(resp,
        (res) => {
          notifier.success(`New need request has been created successfully.`);
        },
        (error) => {
          notifier.alert("There was an error creating the need request, Please try again later.");
        } 
      );
    },
    openCreateNeedRequestModal() {
      this.$refs.createNeedRequestModal.open();      
    },
    openAddNeedModal() {
      if (this.DV_selectedNeeder === "") {return;}

      this.$refs.addNeedtoNeedRequestForm.open();
    },
    addNeedToNeeder(need_data) {
      var popup_options = {
        labels: {
          async: "Adding the need to Need Request.",
        },
        position: "center",
        duration: 3000,
      };
      let notifier = new AWN(popup_options);

      var resp = assignNeedToNeeder(
        window.G_firebase_auth.IV_email_address,
        window.G_firebase_auth.IV_id_token,
        window.G_firebase_data.IV_user_info['user_uid'],
        this.DV_selectedNeeder,
        need_data.need_uid,
        need_data.special_requests
      );

      notifier.async(resp,
        (res) => {
          notifier.success(`Need has been added to Need Request successfully.`);

          // Adding 2s delay to wait for server updates data.
          setTimeout(function() { 
            window.G_firebase_data.bi7getUsersProfileData(window.G_firebase_data.IV_user_info["user_uid"]);
          }, 2000);
        },
        (error) => {
          notifier.alert("There was an error adding the need to need request, Please try again later.");
        } 
      );
    },
    deleteNeed() {
      alert("TODO- in UserNeedRequests:deleteNeed")
    },
    editNeedRequest(needer_uid) {
      this.DV_editNeederUid = needer_uid;
      this.openCreateNeedRequestModal()
    }
  }
}
</script>

<style scoped> 
  .table-responsive {
    height: 60vh;
  }
  .clearfix {
    clear: both;
  }
  .buttons-position {
    position: absolute;
    top: 50px;
    right: 0;
  }
</style>