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
          <li v-if="C_isGuestUser || C_notAuthenticated" class="nav-item">
            <a @click.stop="goToLogin" href="javascript:;" class="nav-link">Sign In</a>
          </li>
          <li v-if="C_isGuestUser || C_notAuthenticated" class="nav-item">
            <a @click.stop="goToRegister" href="javascript:;" class="nav-link">Register</a>
          </li> 
          <li v-if="!C_isGuestUser && !C_notAuthenticated" class="nav-item">
            <router-link to="#" class="nav-link">My Clusterd</router-link>
          </li> 
           <!-- Dropdown -->
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="javascript:;" id="navbardrop" data-toggle="dropdown">
              {{DV_userInfo.firstName}}
            </a>
            <div class="dropdown-menu">
              <a class="dropdown-item" href="javascript:;">Home</a>
              <a class="dropdown-item" href="javascript:;">My Clusters</a>
              <a v-if="!C_isGuestUser && !C_notAuthenticated" class="dropdown-item" href="javascript:;" @click.stop="signOut">Logout</a>
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
      },
      goToLogin() {
        localStorage.clear();
        localStorage.removeItem('vuex');
        location.assign(window.location.origin + '/login');
      },
      goToRegister() {
        localStorage.clear();
        localStorage.removeItem('vuex');
        location.assign(window.location.origin + '/register');
      }
    },
    computed: {
      C_isGuestUser() {
        return this.DV_userInfo.isGuest === true;
      },
      C_notAuthenticated() {
        return this.DV_userInfo.authenticated === false;
      }
    }
  }
  
</script>
