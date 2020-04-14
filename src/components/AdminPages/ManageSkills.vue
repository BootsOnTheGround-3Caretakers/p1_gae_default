<template>
  <div class="container mt-3 text-left">
    <h2>Skills Management</h2>
    <div class="row mt-3">
      <div class="col-md-12">
        <div class="d-flex justify-content-between mb-3">
          <h4>Available skills</h4>
          <button @click.stop="addNewSkill" class="btn btn-primary">Add new Skill</button>
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
              <tr v-for="(skill, key, index) in DV_skills" :key="key">
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
    <create-skill-modal ref="skillForm" @save-skill="saveSkill"></create-skill-modal>
  </div>
</template>

<script>
import CreateSkillModal from '../form_modals/create_skill_modal'
import createSkill from '../../includes/json_tasks/p1s3/p1s3t6'
import AWN from "awesome-notifications";

export default {
  components: {CreateSkillModal},
  data() {
    return {
      DV_skills: {}
    }
  },
  mounted() {
    this.DV_skills = window.vue_instance.$data.firebaseData.skillsMetaData;
  },
  methods: {
    saveSkill(skill) {
      var popup_options = {
        labels: {
          async: "Saving the skill entry.",
        },
        position: "center",
        duration: 3000,
      };
      let notifier = new AWN(popup_options);

      var resp = createSkill(
        window.G_firebase_auth.IV_email_address,
        window.G_firebase_auth.IV_id_token,
        skill.name,
        skill.skill_type,
        skill.description
      );

      notifier.async(resp,
        (res) => {
          notifier.success(`New skill has been created successfully.`);
        },
        (error) => {
          notifier.alert("There was an error creating the skill, Please try again later.");
        } 
      );
    },
    addNewSkill() {
      this.$refs.skillForm.open();
    },
    deleteSkill(skill_uid) {
      let notifier = new AWN();
      let onOk = () => {
        alert("TODO, confirm if we want to give this option to user");
        // window.G_firebase_data.bi7DeleteSkill(skill_uid);
      };
      let onCancel = () => {};
      notifier.confirm(
        'You want to delete this skill',
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