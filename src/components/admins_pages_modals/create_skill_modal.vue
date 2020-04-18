<template>
  <modal name="creatSkillModal" title="Alert Default" :height="'40%'">
    <template slot="default">
      <div class="p-5">
        <div class="h4 mb-3">Create New Skill.</div>
        <form class="mt-3">
          <div class="form-group row">
            <label for="name" class="col-md-4 col-form-label text-md-right">Name</label>

            <div class="col-md-6">
              <input
                id="name"
                type="name"
                class="form-control"
                name="name"
                value
                required
                autofocus
                v-model="DV_skill.name"
              />
            </div>
          </div>
          <div class="form-group row">
            <label for="description" class="col-md-4 col-form-label text-md-right">Description</label>

            <div class="col-md-6">
              <input
                id="description"
                type="description"
                class="form-control"
                name="description"
                value
                required
                autofocus
                v-model="DV_skill.description"
              />
            </div>
          </div>
          <div class="form-group row">
            <label for="skill_type" class="col-md-4 col-form-label text-md-right">Skill Type</label>

            <div class="col-md-6">
              <input
                id="skill_type"
                type="skill_type"
                class="form-control"
                name="skill_type"
                value
                required
                autofocus
                v-model="DV_skill.skill_type"
              />
            </div>
          </div>
          <div class="form-group">
            <button class="btn btn-primary float-right mt-3" @click.prevent="saveSkill">Save</button>
            <button class="btn btn-primary float-right mt-3 mr-2" @click.prevent="close">Cancel</button>
          </div>
        </form>
      </div>
    </template>
  </modal>
</template>

<script>
import AWN from "awesome-notifications";

export default {
  data() {
    return {
      DV_skill: {
        name: "",
        description: "",
        skill_type: ""
      }
    }
  },
  methods: {
    open() {
      this.$modal.show('creatSkillModal');
    },
    close() {
      this.clearForm();
      this.$modal.hide('creatSkillModal');
    },
    clearForm() {
      this.DV_skill = {
        name: "",
        description: ""
      }
    },
    saveSkill() {
      if (this.DV_skill.name === "" || this.DV_skill.name === null || this.DV_skill.name === undefined) {
        this.$awn.warning("Name of the skill cannot be empty, please enter a valid name");
        return;
      }

      if (this.DV_skill.description === "" || this.DV_skill.description === undefined) {
        this.DV_skill.description = null;
      }

      if (this.DV_skill.skill_type === "" || this.DV_skill.skill_type === undefined) {
        this.DV_skill.skill_type = null;
      }

      this.$emit("save-skill", this.DV_skill);
      this.close()
    }
  }
};
</script>