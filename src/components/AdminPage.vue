<template>
  <div class="container"> 
    <h3 class="text-left text-dark">Admin Panel</h3>
    <div class="tab_div_main">
      
      <a class="sub_menu_item" href="javscript:;" 
          :class="{'router-link-exact-active' : activeSubpage == 'needs'}"
          @click.stop="setAtiveTab('needs')" >
        Manage Needs
      </a>

      <a class="sub_menu_item" href="javscript:;" 
          :class="{'router-link-exact-active' : activeSubpage == 'skills'}"
          @click.stop="setAtiveTab('skills')" >
        Manage Skills
      </a>

      <a class="sub_menu_item" href="javscript:;" 
          :class="{'router-link-exact-active' : activeSubpage == 'clusters'}"
          @click.stop="setAtiveTab('clusters')" >
        Manage Clusters
      </a>
    </div>
    
    <div>
      <component 
        :is="currentTabComponent"
      ></component>
    </div>
  </div>
</template>

<script>
import ManageNeeds from './AdminPages/ManageNeeds.vue'
import ManageSkills from './AdminPages/ManageSkills.vue'
import ManageClusters from './AdminPages/ManageClusters.vue'

export default {
  name: 'AdminPage',
  components: {ManageNeeds, ManageSkills, ManageClusters},
  data () {
    return {
      activeSubpage: 'needs'
    }
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
          return 'ManageNeeds'
          break;
        case 'skills':
          return 'ManageSkills'
          break;
        case 'clusters':
          return 'ManageClusters'
          break;
      }
    }
  },
}
</script>
