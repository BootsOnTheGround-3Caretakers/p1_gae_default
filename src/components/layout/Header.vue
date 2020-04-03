<template>
  <nav class="navbar navbar-expand-md navbar-dark fixed-top" id="banner">
    <div class="container">
      <!-- Brand -->
      <a class="navbar-brand" href="#"><span>Logo</span> Here</a>

      <!-- Toggler/collapsibe Button -->
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navbar links -->
      <div class="collapse navbar-collapse" id="collapsibleNavbar">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <router-link to="/" class="nav-link">Home</router-link>
          </li>
          <li v-if="C_userNotLoggedIn" class="nav-item">
            <router-link to="/login" class="nav-link">Sign In</router-link>
          </li>
          <li v-if="C_userNotLoggedIn" class="nav-item">
            <router-link to="/register" class="nav-link">Register</router-link>
          </li> 
          <li v-if="!C_userNotLoggedIn" class="nav-item">
            <router-link to="#" class="nav-link">My Clusterd</router-link>
          </li> 
           <!-- Dropdown -->
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="javascript:;" id="navbardrop" data-toggle="dropdown">
              User
            </a>
            <div class="dropdown-menu">
              <a class="dropdown-item" href="javascript:;">Home</a>
              <a class="dropdown-item" href="javascript:;">My Clusters</a>
              <a class="dropdown-item" href="javascript:;" @click.stop="signOut">Logout</a>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>

  export default {
    name: "Header",
    data() {
      return {
        DV_userInfo: this.$root.$data.userInfo
      }
    },
    methods: {
      signOut() {
        window.G_firebase_auth.bi5SignOut();
      }
    },
    computed: {
      C_userNotLoggedIn() {
        return this.DV_userInfo.uid === "" || this.DV_userInfo.uid === 0;
      }
    }
  }
  
</script>
