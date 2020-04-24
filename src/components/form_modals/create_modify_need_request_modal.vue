<template>
  <modal name="createNeedRequestModal" title="Alert Default">
    <template slot="default">
      <div class="p-5">
        <div class="h4 mb-3">Add new Need Request.</div>
        <form class="mt-3">

          <div class="form-group row">
            <label for="public_metadata" class="col-md-4 col-form-label text-md-right">Public Metadata</label>

            <div class="col-md-6">
              <input
                id="public_metadata"
                type="text"
                class="form-control"
                name="public_metadata"
                v-model="DV_publicMetadata"
                
                placeholder="Coming soon.."
              />
            </div>
          </div>

          <div class="form-group row">
            <label for="private_metadata" class="col-md-4 col-form-label text-md-right">Private Metadata</label>

            <div class="col-md-6">
              <input
                id="private_metadata"
                type="text"
                class="form-control"
                name="private_metadata"
                v-model="DV_privateMetadata"
                
                placeholder="Coming soon.."
              />
            </div>
          </div>
          
          <div class="form-group">
            <button class="btn btn-primary float-right mt-3" @click.prevent="assignNeed">Save</button>
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
  props: ['needRequest'],
  data() {
    return {
      DV_privateMetadata: "",
      DV_publicMetadata: ""
    }
  },
  methods: {
    open() {
      this.$modal.show('createNeedRequestModal');
    },
    close() {
      this.clearForm();
      this.$emit("edit-form-closed");
      this.$modal.hide('createNeedRequestModal');
    },
    clearForm() {
      this.DV_privateMetadata = "";
      this.DV_publicMetadata = "";
    },
    assignNeed() {
      var data = {
        public_metadata: this.DV_publicMetadata,
        private_metadata: this.DV_privateMetadata
      }
      this.$emit("create-need-request", data);
      this.close()
    }
  },
  watch: {
    needRequest() {
      if (this.needRequest) {
        this.DV_publicMetadata = this.needRequest.public_metadata;
        this.DV_privateMetadata = this.needRequest.private_metadata;
      }
    }
  }
}
  
</script>