<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">Register</div>
          <div class="card-body">
            <div v-if="error" class="alert alert-danger">{{error}}</div>
            <form action="#" @submit.prevent="submit">
              <h6 class="text-danger">* All fields are required.</h6>
              <div class="form-group row">
                <label for="first_name" class="col-md-4 col-form-label text-md-right">First Name *</label>

                <div class="col-md-6">
                  <input
                    id="first_name"
                    type="text"
                    class="form-control"
                    name="first_name"
                    value
                    required
                    autofocus
                    v-model="form.first_name"
                  />
                </div>
              </div>

              <div class="form-group row">
                <label for="last_name" class="col-md-4 col-form-label text-md-right">Last Name *</label>

                <div class="col-md-6">
                  <input
                    id="last_name"
                    type="text"
                    class="form-control"
                    name="last_name"
                    value
                    required
                    autofocus
                    v-model="form.last_name"
                  />
                </div>
              </div>

              <div class="form-group row">
                <label for="email" class="col-md-4 col-form-label text-md-right">Email *</label>

                <div class="col-md-6">
                  <input
                    id="email"
                    type="text"
                    class="form-control"
                    name="email"
                    value
                    required
                    autofocus
                    v-model="form.email"
                  />
                </div>
              </div>

              <div class="form-group row">
                <label for="phone_number" class="col-md-4 col-form-label text-md-right">Phone Number *</label>

                <div class="col-md-6">
                  <input
                    id="phone_number"
                    type="text"
                    class="form-control"
                    name="phone_number"
                    value
                    required
                    autofocus
                    v-model="form.phone_number"
                  />
                </div>
              </div>

              <div class="form-group row">
                <label for="password" class="col-md-4 col-form-label text-md-right">Password</label>

                <div class="col-md-6">
                  <input
                    id="password"
                    type="password"
                    class="form-control"
                    name="password"
                    required
                    v-model="form.password"
                  />
                </div>
              </div>

              <div class="form-group row mb-0">
                <div class="col-md-8 offset-md-5">
                  <button type="submit" class="btn btn-primary">Register</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import firebase from "firebase";
import AWN from "awesome-notifications";

export default {
  data() {
    return {
      form: {
        first_name: "",
        first_last: "",
        email: "",
        password: "",
        phone_number: ""
      },
      error: null
    };
  },
  mounted() {
    this.$nextTick(function() {
      window.G_firebase_auth.bi5SetLoginPageCallbacks({
        signed_in: this.signedInCallback,
        create_user_failed: this.createUserFailed
      });
      //if the user is already signed in skip the login screen
      if (window.G_firebase_auth.IV_email_address !== "" && 
          window.G_firebase_auth.IV_is_guest !== false) {
        this.signedInCallback();
        return;
      }
      //if the user was signing out reset the signout requested flag
      if (window.G_firebase_auth.IV_signout_requested_flag === true) {
        window.G_firebase_auth.IV_signout_requested_flag = false;
      }
    })
  },
  methods: {
    submit() {
      if (!this.form.first_name || !this.form.last_name || 
          !this.form.email || !this.form.phone_number ) {
        this.$awn.warning("Please fill in the required information");
        return;
      }
      window.G_firebase_auth.bi5CreateUser(this.form)
    },
    signedInCallback: function() {
      if (window.G_firebase_auth.IV_is_guest === true) {return;}
      this.$router.replace("/");
    },
    createUserFailed: function(error) {
      this.$awn.warning("Sign up failed with error:" + JSON.stringify(error))
    },
  }
};
</script>