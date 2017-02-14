import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import HomeView from '../views/HomeView.vue'
import BucketView from '../views/BucketView.vue'
import CreateView from '../views/CreateView.vue'
import RegisterView from '../views/RegisterView.vue'
import LoginView from '../views/LoginView.vue'

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    { path: '/', component: LoginView },
    { path: '/login', component: LoginView },
    { path: '/buckets', component: HomeView },
    { path: '/register', component: RegisterView },
    { path: '/create', component: CreateView },
    { path: '/bucket/:key', component: BucketView },
  ]
})
