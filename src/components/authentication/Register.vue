<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">Register</div>
          <div class="card-body">
            <div v-if="error" class="alert alert-danger">{{error}}</div>
            <form action="#" @submit.prevent="submit">
              <div class="form-group row">
                <label for="name" class="col-md-4 col-form-label text-md-right">Name</label>

                <div class="col-md-6">
                  <input
                    id="name"
                    type="name"
                    class="form-control"
                    name="name"
                    value
                    required
                    autofocus
                    v-model="form.name"
                  />
                </div>
              </div>

              <div class="form-group row">
                <label for="email" class="col-md-4 col-form-label text-md-right">Email</label>

                <div class="col-md-6">
                  <input
                    id="email"
                    type="email"
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

export default {
  data() {
    return {
      form: {
        name: "",
        email: "",
        password: ""
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
      if (window.G_firebase_auth.IV_email_address !== "") {
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
      window.G_firebase_auth.bi5CreateUser(this.form.email, this.form.password)
        // .then(data => {
        //   data.user
        //     .updateProfile({
        //       displayName: this.form.name
        //     })
        //     .then(() => {});
        // })
        // .catch(err => {
        //   this.error = err.message;
        // });
    },
    signedInCallback: function() {
      this.$router.replace("/");
    },
    createUserFailed: function(error) {
      alert("create user failed with error:" + JSON.stringify(error))
    },
  }
};
</script>