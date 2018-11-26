import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    uname: "",
    email: ""
  },
  mutations: {
    login(name, email) {
      this.state.uname = name;
      this.state.email = email;
    }
  },
  actions: {}
});
