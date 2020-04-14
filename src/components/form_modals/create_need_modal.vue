<template>
  <modal name="creatNeedModal" title="Alert Default">
    <template slot="default">
      <div class="p-5">
        <div class="h4 mb-3">Create New Need.</div>
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
                v-model="DV_need.name"
              />
            </div>
          </div>
          <div class="form-group row">
            <label for="requirements" class="col-md-4 col-form-label text-md-right">Requirements</label>

            <div class="col-md-6">
              <input
                id="requirements"
                type="requirements"
                class="form-control"
                name="requirements"
                value
                required
                autofocus
                v-model="DV_need.requirements"
              />
            </div>
          </div>
          <div class="form-group">
            <button class="btn btn-primary float-right mt-3" @click.prevent="saveNeed">Save</button>
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
      DV_need: {
        name: "",
        requirements: ""
      }
    }
  },
  methods: {
    open() {
      this.$modal.show('creatNeedModal');
    },
    close() {
      this.clearForm();
      this.$modal.hide('creatNeedModal');
    },
    clearForm() {
      this.DV_need = {
        name: "",
        requirements: ""
      }
    },
    saveNeed() {
      if (this.DV_need.name === "" || this.DV_need.name === null || this.DV_need.name === undefined) {
        this.$awn.warning("Name of the need cannot be empty, please enter a valid name");
        return;
      }
      if (this.DV_need.requirements === "" || this.DV_need.requirements === undefined) {
        this.DV_need.requirements = null;
      }

      this.$emit("save-need", this.DV_need);
      this.close()
    }
  }
};
</script>