<template>
  <div id="app" v-if="loading === false">
    <Header></Header>
    <router-view/>
    <!-- <Footer></Footer> -->
  </div>
</template>

<script>
/* eslint-disable */
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

export default {
  name: 'App',
  components: {Header, Footer},
  data() {
    return {
      loading: true
    }
  },
  mounted() {
    this.waitForVueInstanceToLoad();
  },
  methods: {
    waitForVueInstanceToLoad() {
      if (window.vue_instance === undefined) {
        setTimeout(this.waitForVueInstanceToLoad, 200);
        return;
      }
      this.loading = false;
    }
  }
}
</script>

<style>
  @import './assets/css/all.less';
  @import '../node_modules/vue-awesome-notifications/dist/styles/style.css';
</style>
