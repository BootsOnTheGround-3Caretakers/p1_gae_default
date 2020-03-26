import Vue from 'vue'
import Router from 'vue-router'
import p1Home from '@/components/p1Home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'p1Home',
      component: p1Home
    }
  ]
})
