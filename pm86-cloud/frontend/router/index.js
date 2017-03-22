import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import HomeView from '../views/HomeView.vue'
import BucketView from '../views/BucketView.vue'
import CreateView from '../views/CreateView.vue'
import RegisterView from '../views/RegisterView.vue'
import LoginView from '../views/LoginView.vue'


const base = 'PM86 - '
const inBrowser = typeof window !== 'undefined'

const router =  new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    { path: '/',
      component: HomeView,
      meta: {title: `${base}Buckets`}},
    { path: '/login',
      component: LoginView,
      meta: {title: `${base}Login`}},
    { path: '/buckets',
      component: HomeView,
      meta: {title: `${base}Buckets`}},
    { path: '/register',
      component: RegisterView,
      meta: {title: `${base}Register`}},
    { path: '/create',
      component: CreateView,
      meta: {title: `${base}Create`}},
    { path: '/bucket/:key',
      component: BucketView,
      meta: {title: `${base}Bucket`}},
  ]
})

router.beforeEach((to, from, next) => {
  if (inBrowser) {
    document.title = to.meta.title
  }
  next()
})

export default router
