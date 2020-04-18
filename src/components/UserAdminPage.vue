<template>
  <div class="container"> 
    <h3 class="text-left text-dark">User Admin Panel</h3>
    <div class="tab_div_main">
      
      <a class="sub_menu_item" href="javscript:;" 
          :class="{'router-link-exact-active' : activeSubpage == 'skills'}"
          @click.stop="setAtiveTab('skills')" >
        My Skills
      </a>
      
      <a class="sub_menu_item" href="javscript:;" 
          :class="{'router-link-exact-active' : activeSubpage == 'needs'}"
          @click.stop="setAtiveTab('needs')" >
        Need Requests
      </a>

      <a class="sub_menu_item" href="javscript:;" 
          :class="{'router-link-exact-active' : activeSubpage == 'clusters'}"
          @click.stop="setAtiveTab('clusters')" >
        My Clusters
      </a>
    </div>
    
    <div>
      <component 
        :is="currentTabComponent"
        :users-needers="DV_needers"
        :users-skills="DV_skills"
        :users-clusters="DV_clusters"
      ></component>
    </div>
  </div>
</template>

<script>
import UsersNeedRequests from './user_admin_panel/UsersNeedRequests.vue'
import UsersSkills from './user_admin_panel/UsersSkills.vue'
import UsersClusters from './user_admin_panel/UsersClusters.vue'

export default {
  name: 'AdminPage',
  components: {UsersNeedRequests, UsersSkills, UsersClusters},
  data () {
    return {
      activeSubpage: 'skills',
      DV_userMetaData: {},
      DV_needers: {},
      DV_skills: {},
      DV_clusters: {}
    }
  },
  mounted() {
    this.DV_userMetaData = window.vue_instance.$data.firebaseData.userProfileInfo;
  },
  methods: {
    setAtiveTab(tab) {
      this.activeSubpage = tab;
    }
  },
  computed: {
    currentTabComponent() {
      switch(this.activeSubpage) {
        case 'needs':
          return 'UsersNeedRequests'
          break;
        case 'skills':
          return 'UsersSkills'
          break;
        case 'clusters':
          return 'UsersClusters'
          break;
      }
    }
  },
  watch: {
    DV_userMetaData: {
      handler: function(updatedProfile) {
        if (updatedProfile['profile']) {
          if (updatedProfile['profile']["needers"]) {
            this.DV_needers = Object.assign({}, updatedProfile['profile']['needers']);
          }
          if (updatedProfile['profile']["skills"]) {
            this.DV_skills = Object.assign({}, updatedProfile['profile']['skills']);
          }
          if (updatedProfile['profile']["clusters"]) {
            this.DV_clusters = Object.assign({}, updatedProfile['profile']['clusters']);
          }
        }
      },
      deep: true
    }
  }
}
</script>
