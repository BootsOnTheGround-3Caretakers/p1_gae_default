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
    <button class="btn btn-primary mb-2 float-right">Edit</button>
    <div class="box_shadow box_inner p_3 radius_5 mh_vh_5 of_s">
      <div class="box_inner t_l">
        <div 
          v-for="(value, key, index) in DV_userProfile.user" 
          class="row"
          :key="index" 
        >
          <p class="text-muted col-6">
            {{key.labelize()}}:
          </p>
          <p class="mb-3 col-6">{{value}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        DV_userProfile: {}
      }
    },
    mounted() {
      this.DV_userProfile = window.vue_instance.$data.firebaseData.userProfileInfo['profile'];
    }
  }
  
</script>