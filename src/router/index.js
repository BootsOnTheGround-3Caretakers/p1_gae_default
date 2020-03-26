import Vue from 'vue'
import Router from 'vue-router'
import p1Home from '@/components/p1Home'
import Login from '@/components/authentication/Login'
import Register from '@/components/authentication/Register'

Vue.use(Router)

console.log('router/index.js')

export default new Router({
  mode: 'history',
  
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/',
      name: 'p1Home',
      component: p1Home
    },
    {
      path: '*',
      redirect: '/login'
    },
  ]
})
