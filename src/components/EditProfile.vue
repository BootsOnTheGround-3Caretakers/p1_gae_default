<template>
  <div class="w-75 ml_a mr_a box t_l">
    <div class="box_inner">
      <h3 class="float-left">Update Profile</h3>
      <p class="float-right pointer font-weight-bold" @click.stop="showProfile"> <-- Go Back to Profile</p>
    </div>
    <div class="row flex_full">
      <div class="col-md-6 offset-4">
        <form v-if="!DV_loading" @submit.prevent="validateThenSave" class="box_inner">
          <h5 class="mt_1 mt_2 font-weight-normal">Basic Details</h5>
          <hr class="mt-0">
          <div class="row">
            <div class="col form-group">
              <label>First Name</label>
              <input 
                type="text" 
                v-model="DV_profile.first_name"
                class="form-control" 
              >
            </div>
          </div>
          <div class="row">
            <div class="col form-group">
              <label>Last Name</label>
              <input 
                type="text" 
                v-model="DV_profile.last_name"
                class="form-control">     
               </input>
            </div>
          </div>
          <div class="row">
            <div class="col form-group">
              <label>Email Address</label>
              <input 
                type="text" 
                v-model="DV_profile.email_address"
                class="form-control">     
               </input>
            </div>
          </div>
          <div class="row">
            <div class="col form-group">
              <label>Phone 1</label>
              <input 
                type="text" 
                v-model="DV_profile.phone_1"
                class="form-control">     
               </input>
            </div>
          </div>
          <div class="row">
            <div class="col form-group">
              <label>Phone texts</label>
              <input 
                type="text" 
                v-model="DV_profile.phone_texts"
                class="form-control">     
               </input>
            </div>
          </div>

          <div class="row">
            <div class="col form-group">
              <label>Description</label>
              <textarea
                v-model="DV_profile.description"
                class="form-control"
              ></textarea>
            </div>
          </div>
          
          <div class="row">
            <div class="col form-group">
              <label>Account Flags</label>
              <input 
                type="text" 
                v-model="DV_profile.account_flags"
                class="form-control">     
               </input>
            </div>
          </div>

          <h5 class="mt_1 mt_2 font-weight-normal">Location Details</h5>
          <div class="row">
            <div class="col form-group">
              <label>Country</label>
              <multiselect 
                v-model="DV_profile.country_uid" 
                :options="C_countryList"  
                placeholder="Pick Your Country"
              ></multiselect>
            </div>
          </div>
          <div class="row">
            <div class="col form-group">
              <label>Region</label>
              <multiselect 
                v-model="DV_profile.region_uid" 
                :options="C_regionsList"  
                label="name" 
                track-by="id" 
                placeholder="Pick Your Region"
              ></multiselect>
            </div>
          </div>
          <div class="row">
            <div class="col form-group">
              <label>Area</label>
              <multiselect 
                v-model="DV_profile.area_uid" 
                :options="C_areasList" 
                label="name" 
                track-by="id" 
                :placeholder="`Pick Your Area`"
              ></multiselect>
            </div>
          </div>
          <div class="row">
            <div class="col form-group">
              <label>Preferred Radius</label>
              <input 
                type="text" 
                v-model="DV_profile.preferred_radius"
                class="form-control">     
               </input>
            </div>
          </div>
          <div class="row">
            <div class="col form-group">
              <label>Location Cord Lat</label>
              <input type="number" v-model="DV_profile.location_cord_lat" class="form-control">
            </div> 
            <div class="col form-group">
              <label>Location Cord Long</label>
              <input type="number" v-model="DV_profile.location_cord_long" class="form-control">
            </div> 
          </div>

          <div class="box_footer mt_3">
            <button 
              @click.stop.prevent="showProfile"
              class="btn btn-warning align-self-center float-right ml_1">
              Cancel
            </button>
            <button 
              type="submit" 
              class="btn btn-primary align-self-center float-right ml_1">
              Save Profile
            </button>
          </div>
        </form>
        <div v-else>
          <h5>Loading....</h5>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        DV_userProfileInfoContainer: {},
        DV_profile: {},
        DV_locationLookupData: {},
        DV_loading: true
      }
    },
    mounted() {
      this.DV_userProfileInfoContainer = window.vue_instance.$data.firebaseData.userProfileInfo;
      this.DV_locationLookupData = window.vue_instance.$data.firebaseData.locationLookupData;
      if (this.DV_userProfileInfoContainer['profile'] && 
          this.DV_userProfileInfoContainer['profile']['user']) {
        this.DV_profile = this.DV_userProfileInfoContainer['profile']['user']
        this.DV_loading = false
      }
    },
    computed: {
      C_countryList() {

      },
      C_regionsList() {

      },
      C_areasList() {

      }
    },
    methods: {
      validateThenSave() {

      },
      showProfile() {
        this.$router.push({ path: '/profile' })
      }
    },
    watch: {
      DV_userProfileInfoContainer: {
        handler: function (argument) {
          if (argument['profile'] && argument['profile']['user']) {
            this.DV_profile = argument['profile']['user']
            this.DV_loading = false
          }
        },
        deep: true
      }
    }
  }
</script>