<template>
  <div id="app">
    <Header></Header>
    <router-view/>
    <Footer></Footer>
  </div>
</template>

<script>
/* eslint-disable */
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

export default {
  name: 'App',
  components: {Header, Footer}
}
</script>

<style>
  @import './assets/css/all.less';
  @import '../node_modules/vue-awesome-notifications/dist/styles/style.css';
</style>
