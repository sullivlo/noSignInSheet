import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    uname: null,
    email: null
  },
  mutations: {
    login(state, payload) {
      state.uname = payload.name;
      state.email = payload.email;
    }
  },
  actions: {}
});
