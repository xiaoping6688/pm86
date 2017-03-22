import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import { sync } from 'vuex-router-sync'
import * as filters from './filters'
import ElementUI from 'element-ui'
import Vheader from './components/Vheader.vue'
sync(store, router)

Vue.use(ElementUI)
Vue.component(Vheader.name, Vheader)

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

const app = new Vue({
  router,
  store,
  ...App
})

export { app, router, store }
