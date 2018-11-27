import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    uname: null,
    email: null,
    rootRef: null,
    classRoot: null
  },
  mutations: {
    login(state, payload) {
      state.uname = payload.name;
      state.email = payload.email;
    },
    dbSetup(state, payload) {
      state.rootRef = payload.root;
      state.classRoot = payload.class;
    }
  },
  actions: {}
});
