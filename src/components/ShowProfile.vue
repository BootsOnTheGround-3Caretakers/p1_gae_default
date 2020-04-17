<template>
  <div class="container pt-5">
    <h2 class="t_l ml-2">My Stats</h2>
    <div class="row box_shadow radius_5 ptb_2 flex_full text-center">
      <div class="col border-right">
        <p class="mb-0 font-weight-bold fs_20 f_smooth">My Clusters</p>
        <p class="mb-0 fs_35 ">5</p>
      </div>
      <div class="col border-right">
        <p class="mb-0 font-weight-bold fs_20 f_smooth">My Skills</p>
        <p class="mb-0 fs_35 ">10</p>
      </div>
      <div class="col border-right">
        <p class="mb-0 font-weight-bold fs_20 f_smooth">My Needs</p>
        <p class="mb-0 fs_35 ">2</p>
      </div>
      <div class="col">
        <p class="mb-0 font-weight-bold fs_20 f_smooth">My Hashtags</p>
        <p class="mb-0 fs_35 ">12</p>
      </div>
    </div>
    <hr>
    <h2 class="t_l ml-2 float-left">Profile Info</h2>
    <router-link to="/profile/edit" class="btn btn-primary mb-2 float-right">Edit</router-link>
    <div class="box_shadow box_inner p_3 radius_5 mh_vh_5 of_s">
      <div v-if="!DV_loading" class="box_inner t_l">
        <div 
          v-for="(value, key, index) in DV_profile" 
          class="row"
          :key="index" 
        >
          <p class="text-muted col-6">
            {{key.labelize().replace("Uid","")}}:
          </p>
          <p class="mb-3 col-6">{{getFormatedValue(key, value)}}</p>
        </div>
      </div>
      <div v-else>
        <p>Loading...</p>
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
    },
    methods: {
      getFormatedValue(key, value) {
        var ret = value;
        if (["country_uid", "region_uid", "area_uid"].includes(key)) {
          switch(key) {
            case "country_uid":
              if (value in this.DV_locationLookupData === true) {
                ret = this.DV_locationLookupData[value].name;
              }
              break;
            case "region_uid":
              try {
                if (value in this.DV_locationLookupData[this.DV_profile.country_uid].regions === true) {
                  ret = this.DV_locationLookupData[this.DV_profile.country_uid].regions[value].name;
                }
              } catch(error) {} 
              break;
            case "area_uid":
              try {
                if (value in this.DV_locationLookupData[this.DV_profile.country_uid].regions[this.DV_profile.region_uid].areas === true) {
                  ret = this.DV_locationLookupData[this.DV_profile.country_uid].regions[this.DV_profile.region_uid].areas[value].zip;
                }
              } catch(error) {} 
              break;
          }
        }
        return ret;
      }
    },
    watch: {
      DV_userProfileInfoContainer: {
        handler: function (argument) {
          if (argument['profile'] && argument['profile']['user']) {
            this.DV_profile = Object.assign({}, argument['profile']['user']);
            this.DV_loading = false
          }
        },
        deep: true
      }
    }
  }
  
</script>