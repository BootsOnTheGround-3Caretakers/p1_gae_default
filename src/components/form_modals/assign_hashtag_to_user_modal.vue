<template>
  <modal name="assignHashtagModal" title="Alert Default" :height="'40%'">
    <template slot="default">
      <div class="p-5">
        <div class="h4 mb-3">Assign New Hashtag.</div>
        <form class="mt-3">
          <div class="form-group row">
            <label for="name" class="col-md-4 col-form-label text-md-right">Choose Hashtag</label>

            <div class="col-md-6">
              <multiselect 
                v-model="DV_selectedHashtag" 
                :options="C_hashtagsList"  
                placeholder="Pick a Hashtag"
                label="name"
              ></multiselect>
            </div>
          </div>
          
          <div class="form-group">
            <button class="btn btn-primary float-right mt-3" @click.prevent="assignHashtag">Save</button>
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
      DV_selectedHashtag: null,
      DV_hashtags: {},
      DV_totalCapacity: 0
    }
  },
  mounted() {
    this.DV_hashtags = window.vue_instance.$data.firebaseData.hashtagsMetaData;
  },
  computed: {
    C_hashtagsList() {
      let hashtags_list = [];

      if (this.DV_hashtags) {
        for (let key in this.DV_hashtags) {
          let hashtag = this.DV_hashtags[key];
          let data = {name: hashtag.name, uid: key};
          
          hashtags_list.push(data);
        }
      }

      return hashtags_list;
    }
  },
  methods: {
    open() {
      this.$modal.show('assignHashtagModal');
    },
    close() {
      this.clearForm();
      this.$modal.hide('assignHashtagModal');
    },
    clearForm() {
      this.DV_selectedHashtag = null;
      this.DV_specialNotes = "";
    },
    assignHashtag() {
      var data = {
        hashtag_uid: this.DV_selectedHashtag.uid
      }
      this.$emit("assign-hashtag", data);
      this.close()
    }
  }
}
  
</script>