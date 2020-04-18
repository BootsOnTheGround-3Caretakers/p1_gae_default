<template>
  <div class="container mt-3 text-left">
    <h2>Skills Management</h2>
    <div class="row mt-3">
      <div class="col-md-12">
        <div class="d-flex justify-content-between mb-3">
          <h4>Available skills</h4>
          <button @click.stop="openAssignSkillModal" class="btn btn-primary">Assign new Skill</button>
        </div>
        <div class="table-responsive">
          <table id="mytable" class="table table-bordred table-striped">
            <thead>
              <th>#</th>
              <th>Name</th>
              <th>Description</th>
              <th>Type</th>
              <!-- <th>Edit</th> -->
              <th>Delete</th>
            </thead>
            <tbody>
              <tr v-for="(skill, key, index) in DV_usersSkills" :key="key">
                <td>{{index+1}}</td>
                <td>{{skill.name}}</td>
                <td>{{skill.description}}</td>
                <td>{{skill.skill_type}}</td>
                <!-- <td>
                  <p data-placement="top" title="Edit">
                    <button class="btn btn-primary btn-xs" >
                      <span class="glyphicon glyphicon-pencil"></span>
                    </button>
                  </p>
                </td> -->
                <td>
                  <p data-placement="top" title="Delete">
                    <button @click.stop="deleteSkill" class="btn btn-danger btn-xs" >
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
    <assign-skill-modal ref="assignSkillForm" @assign-skill="assignSkill"></assign-skill-modal>
  </div>
</template>

<script>
import AssignSkillModal from '../form_modals/assign_skill_modal'
import addSkillToUser from '../../includes/json_tasks/p1s3/p1s3t7.js'
import AWN from "awesome-notifications";

export default {
  props: ["usersSkills"],
  components: {AssignSkillModal},
  data() {
    return {
      DV_usersSkills: {}
    }
  },
  mounted() {

  },
  methods: {
    openAssignSkillModal() {
      this.$refs.assignSkillForm.open();
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
      debugger
      var resp = addSkillToUser(
        window.G_firebase_auth.IV_email_address,
        window.G_firebase_auth.IV_id_token,
        window.G_firebase_data.IV_user_info["user_uid"],
        skill_data.skill_uid,
        skill_data.special_notes
      );

      notifier.async(resp,
        (res) => {
          notifier.success(`Skill has been assigned successfully.`);
        },
        (error) => {
          notifier.alert("There was an error assigning the skill, Please try again later.");
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