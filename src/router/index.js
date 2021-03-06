import Vue from 'vue'
import Router from 'vue-router'
import p1Home from '@/components/p1Home'
import p3About from '@/components/p3About'
import UserAdminPage from '@/components/UserAdminPage'
import ShowProfile from '@/components/ShowProfile'
import EditProfile from '@/components/EditProfile'
import p5PeopleList from '@/components/p5PeopleList'
import Login from '@/components/authentication/Login'
import Register from '@/components/authentication/Register'

Vue.use(Router)

console.log('router/index.js')

export default new Router({
  mode: 'history',
  
  routes: [
    {
      path: '/about',
      name: 'about',
      component: p3About
    },
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
      path: '/user_admin',
      name: 'UserAdmin',
      component: UserAdminPage
    },
    {
      path: '/profile',
      name: 'ShowProfile',
      component: ShowProfile
    },
    {
      path: '/profile/edit',
      name: 'EditProfile',
      component: EditProfile
    },
    {
      path: '/',
      name: 'p1Home',
      component: p1Home
    },
    {
      path: '/people',
      name: 'p5PeopleList',
      component: p5PeopleList
    },
    {
      path: '*',
      redirect: '/login'
    },
  ]
})
