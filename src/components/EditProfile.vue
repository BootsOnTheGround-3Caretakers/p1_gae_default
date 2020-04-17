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
              <label>Phone 2</label>
              <input 
                type="text" 
                v-model="DV_profile.phone_2"
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
                v-model="DV_selectedCountry" 
                :options="C_countryList"  
                placeholder="Pick Your Country"
                @input="updateCountryUid"
              ></multiselect>
            </div>
          </div>
          <div class="row">
            <div class="col form-group">
              <label>Region</label>
              <multiselect 
                v-model="DV_selectedRegion" 
                :options="C_regionsList"
                :disabled="!DV_selectedCountry"
                @input="updateRegionUid"
                placeholder="Pick Your Region"
              ></multiselect>
              <small v-if="!DV_selectedCountry" class="text-info">Please select Country first</small>
            </div>
          </div>
          <div class="row">
            <div class="col form-group">
              <label>Area</label>
              <multiselect 
                v-model="DV_selectedArea" 
                :options="C_areasList" 
                @input="updateAreaUid"
                :disabled="!DV_selectedRegion"
                :placeholder="`Pick Your Area`"
              ></multiselect>
              <small v-if="!DV_selectedRegion" class="text-info">Please select Region first</small>
            </div>
          </div>
          <div class="row">
            <div class="col form-group">
              <label>Home Address</label>
              <input 
                type="text" 
                v-model="DV_profile.home_address"
                class="form-control">     
               </input>
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
              <input type="tel" v-model="DV_profile.location_cord_lat" class="form-control">
            </div> 
            <div class="col form-group">
              <label>Location Cord Long</label>
              <input type="tel" v-model="DV_profile.location_cord_long" class="form-control">
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
import Multiselect from 'vue-multiselect'
import modifyUserInformation from '../includes/json_tasks/p1s3/p1s3t4.js'
import AWN from "awesome-notifications";

export default {
  components: { Multiselect },
  data() {
    return {
      DV_userProfileInfoContainer: {},
      DV_profile: {},
      DV_locationLookupData: {},
      DV_loading: true,
      DV_selectedCountry: null,
      DV_selectedRegion: null,
      DV_selectedArea: null,
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
    this.updatedLocationNames();
  },
  computed: {
    C_countryList() {
      let countries = [];
      if (!this.DV_locationLookupData) {
        return countries;
      }
      for (let key in this.DV_locationLookupData) {
        let item = this.DV_locationLookupData[key];
        countries.push(item.name);
      }
      return countries;
    },
    C_regionsList() {
      let regions = [];
      let country_regions = [];
      if (!this.DV_profile.country_uid) {return regions;}

      try {
        country_regions = this.DV_locationLookupData[this.DV_profile.country_uid].regions;
      } catch(error) {
        country_regions = [];
      }

      for (let key in country_regions) {
        let item = country_regions[key];
        regions.push(item.name);
      }
      return regions;
    },
    C_areasList() {
      let areas = [];
      let region_areas = [];

      if (!this.DV_profile.country_uid || !this.DV_profile.region_uid) {
        return areas;
      }
      try {
        region_areas = this.DV_locationLookupData[this.DV_profile.country_uid]['regions'][this.DV_profile.region_uid].areas;
      } catch(error) {
        region_areas = [];
      }
      for (let key in region_areas) {
        let item = region_areas[key];
        areas.push(item.zip);
      }
      return areas;
    }
  },
  methods: {
    validateThenSave() {
      let profile_data = {
        user_uid: window.G_firebase_data.IV_user_info.user_uid,
        firebase_uid: window.G_firebase_auth.IV_uid,
        first_name: this.DV_profile.first_name,
        last_name: this.DV_profile.last_name,
        phone_number: this.DV_profile.phone_1,
        phone_texts: this.DV_profile.phone_texts,
        phone_2: this.DV_profile.phone_2,
        home_address: this.DV_profile.home_address,
        email_address: this.DV_profile.email_address,
        country_uid: this.DV_profile.country_uid,
        region_uid: this.DV_profile.region_uid,
        area_uid: this.DV_profile.area_uid,
        description: this.DV_profile.description,
        preferred_radius: this.DV_profile.preferred_radius,
        location_cord_lat: this.DV_profile.location_cord_lat,
        location_cord_long: this.DV_profile.location_cord_long
      }
      var popup_options = {
        labels: {
          async: "Updating your profile.",
        },
        position: "center",
        duration: 3000,
      };
      let notifier = new AWN(popup_options);

      var resp = modifyUserInformation(
        window.G_firebase_auth.IV_email_address,
        window.G_firebase_auth.IV_id_token,
        profile_data
      );

      notifier.async(resp,
        (res) => {
          notifier.success(`Your profile has been updated successfully.`);
        },
        (error) => {
          notifier.alert("There was an error updating your profile, Please try again later.");
        } 
      );
      this.showProfile();
    },
    showProfile() {
      this.$router.push({ path: '/profile' })
    },
    updatedLocationNames() {
      if (this.DV_profile.country_uid)  {
        let name = null;
        try {
          name = this.DV_locationLookupData[this.DV_profile.country_uid].name;
        } catch(error) { name = null;}

        this.DV_selectedCountry = name;
      }
      if (this.DV_profile.country_uid && this.DV_profile.region_uid) {
        let name = null;
        try {
          name = this.DV_locationLookupData[this.DV_profile.country_uid].regions[this.DV_profile.region_uid].name;
        } catch(error) { name = null;}

        this.DV_selectedRegion = name;
      }
      if (this.DV_profile.country_uid && this.DV_profile.region_uid && this.DV_profile.region_uid) {
        let name = null;
        try {
          name = this.DV_locationLookupData[this.DV_profile.country_uid].regions[this.DV_profile.region_uid].areas[this.DV_profile.area_uid].zip;
        } catch(error) { name = null;}

        this.DV_selectedArea = name;
      }
    },
    updateCountryUid(value) {
      for (let key in this.DV_locationLookupData) {
        let country = this.DV_locationLookupData[key];
        if (country.name === value) {
          this.DV_profile.country_uid = key;
          this.DV_profile.region_uid = "";
          this.DV_profile.area_uid = "";

          this.DV_selectedRegion = null;
          this.DV_selectedArea = null;
          break;
        }
      }
    },
    updateRegionUid(value) {
      if (!this.DV_profile.country_uid) {return;}

      let country_regions = this.DV_locationLookupData[this.DV_profile.country_uid].regions;

      for (let key in country_regions) {
        let region = country_regions[key];
        if (region.name === value) {
          this.DV_profile.region_uid = key;
          this.DV_profile.area_uid = "";

          this.DV_selectedArea = null;
          break;
        }
      }
    },
    updateAreaUid(value) {
      if (!this.DV_profile.country_uid || !this.DV_profile.region_uid) {return;}

      let region_areas = this.DV_locationLookupData[this.DV_profile.country_uid].regions[this.DV_profile.region_uid].areas;

      for (let key in region_areas) {
        let area = region_areas[key];
        if (area.zip === value) {
          this.DV_profile.area_uid = key;
          break;
        }
      }
    }
  },
  watch: {
    DV_userProfileInfoContainer: {
      handler: function (argument) {
        this.updatedLocationNames();
        if (argument['profile'] && argument['profile']['user']) {
          this.DV_profile = Object.assign({}, argument['profile']['user']);
          this.DV_loading = false
        }
      },
      deep: true
    },
    DV_locationLookupData: {
      handler: function (argument) {
        this.updatedLocationNames();
      },
      deep: true
    }
  }
}
</script>
