<template>
  <div class="container mt-4 text-left">
    <div class="d-flex justify-content-between mb-3">
      <h2>Skills Management</h2>
      <button @click.stop="openAssignSkillModal" class="btn btn-primary">Add new Skill</button>
    </div>
    <div class="row mt-3">
      <div class="col-md-12">
        <div class="table-responsive">
          <table id="mytable" class="table table-bordred table-striped">
            <thead>
              <th>#</th>
              <th>Name</th>
              <th>Description</th>
              <th>Notes</th>
              <!-- <th>Edit</th> -->
              <th>Delete</th>
            </thead>
            <tbody>
              <tr v-for="(skill, key, index) in usersSkills" :key="key">
                <td>{{index+1}}</td>
                <td>{{skill.name}}</td>
                <td>{{skill.description}}</td>
                <td>{{skill.notes}}</td>
                <!-- <td>
                  <p data-placement="top" title="Edit">
                    <button class="btn btn-primary btn-xs" >
                      <i class="fas fa-pencil"></i>
                    </button>
                  </p>
                </td> -->
                <td>
                  <p data-placement="top" title="Delete">
                    <button @click.stop="removeSkill" class="btn btn-danger btn-xs" >
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
    <add-skill-to-user-modal ref="addSkillToUserForm" @assign-skill="assignSkill"></add-skill-to-user-modal>
  </div>
</template>

<script>
import addSkillToUserModal from '../form_modals/assign_skill_modal'
import addSkillToUser from '../../includes/json_tasks/p1s3/p1s3t7.js'
import AWN from "awesome-notifications";

export default {
  props: ["usersSkills"],
  components: {addSkillToUserModal},
  methods: {
    openAssignSkillModal() {
      this.$refs.addSkillToUserForm.open();
    },
    assignSkill(skill_data) {
      var popup_options = {
        labels: {
          async: "Assigning the skill.",
        },
        position: "center",
        duration: 3000,
      };
      let notifier = new AWN(popup_options);

      var resp = addSkillToUser(
        window.G_firebase_auth.IV_email_address,
        window.G_firebase_auth.IV_id_token,
        window.G_firebase_data.IV_user_info["user_uid"],
        skill_data.skill_uid,
        skill_data.total_capacity,
        skill_data.special_notes
      );

      notifier.async(resp,
        (res) => {
          notifier.success(`Skill has been added successfully. Skill will be available in your list shortly`);

          // Adding 2s delay to wait for server updates data.
          setTimeout(function() { 
            window.G_firebase_data.bi7getUsersProfileData(window.G_firebase_data.IV_user_info["user_uid"]);
          }, 2000);
        },
        (error) => {
          notifier.alert("There was an error adding the skill, Please try again later.");
        } 
      );
    },
    removeSkill() {
      alert("TODO- in UserSkills:removeSkill")
    }
  }
}
</script>

<style scoped> 
  .table-responsive {
    height: 60vh;
  }
</style>