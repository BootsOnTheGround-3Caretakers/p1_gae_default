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

      <a class="sub_menu_item" href="javscript:;" 
          :class="{'router-link-exact-active' : activeSubpage == 'hashtags'}"
          @click.stop="setAtiveTab('hashtags')" >
        My Hashtags
      </a>
    </div>
    
    <div>
      <component 
        :is="currentTabComponent"
        :users-needers="DV_needers"
        :users-skills="DV_skills"
        :users-clusters="DV_clusters"
        :users-hashtags="DV_hashtags"
      ></component>
    </div>
  </div>
</template>

<script>
import UsersNeedRequests from './user_admin_panel/UsersNeedRequests.vue'
import UsersSkills from './user_admin_panel/UsersSkills.vue'
import UsersClusters from './user_admin_panel/UsersClusters.vue'
import UsersHashtags from './user_admin_panel/UsersHashtags.vue'

export default {
  name: 'AdminPage',
  components: {UsersNeedRequests, UsersSkills, UsersClusters, UsersHashtags},
  data () {
    return {
      activeSubpage: 'skills',
      DV_userMetaData: {},
      DV_needers: {},
      DV_skills: {},
      DV_clusters: {},
      DV_hashtags: {
        5143213941719040: {
          description: "Test-Hashtag-Description",
          name: "#Test-Hashtag2"
        },
        5630742793027584: {
          description: "#LGBTQ",
          name: "#LGBTQ"
        },
        5633226290757632: {
          description: "#PREGNANT",
          name: "#PREGNANT"
        },
        5635703144710144: {
          description: "#CHRISTIAN",
          name: "#CHRISTIAN"
        }
      }
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
        case 'hashtags':
          return 'UsersHashtags'
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
