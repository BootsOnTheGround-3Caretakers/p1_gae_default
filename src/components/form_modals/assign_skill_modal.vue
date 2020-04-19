<template>
  <modal name="assignSkillModal" title="Alert Default" :height="'40%'">
    <template slot="default">
      <div class="p-5">
        <div class="h4 mb-3">Assign New Skill.</div>
        <form class="mt-3">
          <div class="form-group row">
            <label for="name" class="col-md-4 col-form-label text-md-right">Choose Skill</label>

            <div class="col-md-6">
              <multiselect 
                v-model="DV_selectedSkill" 
                :options="C_skillsList"  
                placeholder="Pick a Skill"
                label="name"
              ></multiselect>
              <small class="text-danger">Selecting already selecting Skills will overwrite Notes and Capacity</small>
            </div>
          </div>
          
          <div class="form-group row">
            <label for="total_capacity" class="col-md-4 col-form-label text-md-right">Total capacity</label>

            <div class="col-md-6">
              <input
                id="total_capacity"
                type="number"
                class="form-control"
                name="total_capacity"
                v-model="DV_totalCapacity"
              />
            </div>
          </div>

          <div class="form-group row">
            <label for="special_notes" class="col-md-4 col-form-label text-md-right">Special Notes</label>

            <div class="col-md-6">
              <input
                id="special_notes"
                type="text"
                class="form-control"
                name="special_notes"
                v-model="DV_specialNotes"
              />
            </div>
          </div>
          
          <div class="form-group">
            <button class="btn btn-primary float-right mt-3" @click.prevent="assignSkill">Save</button>
            <button class="btn btn-primary float-right mt-3 mr-2" @click.prevent="close">Cancel</button>
          </div>
        </form>
      </div>
    </template>
  </modal>
</template>

<script>
import Multiselect from 'vue-multiselect'
import AWN from "awesome-notifications";

export default {
  components: {Multiselect},
  data() {
    return {
      DV_selectedSkill: null,
      DV_specialNotes: "",
      DV_skills: {},
      DV_totalCapacity: 0
    }
  },
  mounted() {
    this.DV_skills = window.vue_instance.$data.firebaseData.skillsMetaData;
  },
  computed: {
    C_skillsList() {
      let skills_list = [];

      if (this.DV_skills) {
        for (let key in this.DV_skills) {
          let skill = this.DV_skills[key];
          let data = {name: skill.name, uid: key};
          
          skills_list.push(data);
        }
      }

      return skills_list;
    }
  },
  methods: {
    open() {
      this.$modal.show('assignSkillModal');
    },
    close() {
      this.clearForm();
      this.$modal.hide('assignSkillModal');
    },
    clearForm() {
      this.DV_selectedSkill = null;
      this.DV_specialNotes = "";
    },
    assignSkill() {
      var data = {
        skill_uid: this.DV_selectedSkill.uid,
        special_notes: this.DV_specialNotes,
        total_capacity: this.DV_totalCapacity
      }
      this.$emit("assign-skill", data);
      this.close()
    }
  }
}
  
</script>