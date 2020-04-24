<template>
  <modal name="assignNeedModal" title="Alert Default" :height="'50%'">
    <template slot="default">
      <div class="p-5">
        <div class="h4 mb-3">Add New Need to Need Request.</div>
        <form class="mt-3">

          <div class="form-group row">
            <label for="name" class="col-md-4 col-form-label text-md-right">Choose Need</label>

            <div class="col-md-6">
              <multiselect 
                v-model="DV_selectedNeed" 
                :options="C_needsList"  
                placeholder="Pick a Need"
                label="name"
              ></multiselect>
              <small class="text-danger">Selecting already selected needs will overwrite special requests</small>
            </div>
          </div>

          <div class="form-group row">
            <label for="special_requests" class="col-md-4 col-form-label text-md-right">Special requests</label>

            <div class="col-md-6">
              <input
                id="special_requests"
                type="text"
                class="form-control"
                name="special_requests"
                v-model="DV_specialRequests"
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
import Multiselect from 'vue-multiselect'
import AWN from "awesome-notifications";

export default {
  components: {Multiselect},
  data() {
    return {
      DV_selectedNeed: null,
      DV_specialRequests: "",
      DV_needs: {}

    }
  },
  mounted() {
    this.DV_needs = window.vue_instance.$data.firebaseData.needsMetaData;
  },
  computed: {
    C_needsList() {
      let need_list = [];

      if (this.DV_needs) {
        for (let key in this.DV_needs) {
          let need = this.DV_needs[key];
          let data = {name: need.name, uid: key};

          need_list.push(data);
        }
      }

      return need_list;
    }
  },
  methods: {
    open() {
      this.$modal.show('assignNeedModal');
    },
    close() {
      this.clearForm();
      this.$modal.hide('assignNeedModal');
    },
    clearForm() {
      this.DV_selectedNeed = null;
      this.DV_specialRequests = "";
    },
    assignNeed() {
      var data = {
        need_uid: this.DV_selectedNeed.uid,
        special_requests: this.DV_specialRequests
      }
      this.$emit("assign-need", data);
      this.close()
    }
  }
}
  
</script>