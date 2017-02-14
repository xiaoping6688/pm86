import Vue from 'vue'
import Vuex from 'vuex'
import * as api from './api'
import * as $ from '../filters'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    buckets: [],
    isLogin: false,
    email: ''
  },

  actions: {
    ADD_BUCKET: ({ commit, dispatch, state }, formData) => {
      return api.addBucket(formData.form)
        .then(data => {
          // commit('SET_LOGIN', data.data)
          // commit('SET_EMAIL', formData.form.email)
          formData.callback(data.data)
        })
    },
    FETCH_BUCKETS: ({ commit, dispatch, state }) => {
      return api.fetchBuckets()
        .then(data => commit('SET_BUCKETS', data.data.buckets))
    },
    USER_LOGIN: ({ commit, dispatch, state }, formData) => {
      return api.login(formData.form)
        .then(data => {
          commit('SET_LOGIN', data.data.status)
          commit('SET_EMAIL', formData.form.email)
          formData.callback(data.data)
        })
    },
    USER_REGISTER: ({ commit, dispatch, state }, formData) => {
      return api.register(formData.form)
        .then(data => {
          commit('SET_LOGIN', data.data.status)
          commit('SET_EMAIL', formData.form.email)
          formData.callback(data.data)
        })
    },
  },

  mutations: {
    SET_BUCKETS: (state, buckets) => {
      state.buckets = buckets
    },
    SET_LOGIN: (state, data) => {
      state.isLogin = data === 0 ? true : false;
    },
    SET_EMAIL: (state, email) => {
      state.email = email
    },
  },

  getters: {
  }
})

export default store
