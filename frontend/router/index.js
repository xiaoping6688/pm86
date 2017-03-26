import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import IndexView    from '../views/IndexView.vue'
import BucketView   from '../views/BucketView.vue'
import CreateView   from '../views/CreateView.vue'
import RegisterView from '../views/RegisterView.vue'
import LoginView    from '../views/LoginView.vue'
import VerifyView   from '../views/VerifyView.vue'
import ErrorView    from '../views/ErrorView.vue'
import ProfileView  from '../views/ProfileView.vue'


const base = 'PM86 - '
const inBrowser = typeof window !== 'undefined'

const router =  new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    { path: '/',
      component: IndexView,
      meta: {title: `${base}Buckets`}},
    { path: '/login',
      component: LoginView,
      meta: {title: `${base}Login`}},
    { path: '/buckets',
      component: IndexView,
      meta: {title: `${base}Buckets`}},
    { path: '/register',
      component: RegisterView,
      meta: {title: `${base}Register`}},
    { path: '/create',
      component: CreateView,
      meta: {title: `${base}Create`}},
    { path: '/profile',
      component: ProfileView,
      meta: {title: `${base}Profile`}},
    { path: '/bucket/:key',
      component: BucketView,
      meta: {title: `${base}Bucket`}},
    { path: '/verify/:email/:encode',
      component: VerifyView,
      meta: {title: `${base}Verify`}},
    { path: '*',
      component: ErrorView,
      meta: {title: `${base}404`}},
  ]
})



router.beforeEach((to, from, next) => {

  if (inBrowser) {
    // const email = localStorage.getItem('email')
    // if (email === 'null' && to.path !== '/login' && to.path !== '/register') {
    //   location.href='/login'
    //   return;
    // }
    document.title = to.meta.title
  }
  next()
})

export default router
