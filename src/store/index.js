import Vue from 'vue'
import Vuex from 'vuex'
import { fetchItems, fetchIdsByType, fetchUser , fetchBuckets} from './api'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    buckets: []
  },

  actions: {
    FETCH_BUCKETS: ({ commit, dispatch, state }) => {
      return fetchBuckets()
        .then(data => commit('SET_BUCKETS', data.data.buckets))
    }
  },

  mutations: {
    SET_BUCKETS: (state, buckets) => {
      state.buckets = buckets
    },
  },

  getters: {
  }
})

export default store
