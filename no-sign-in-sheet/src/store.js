import Vue from "vue";
import Vuex from "vuex";
import { Z_ASCII } from "zlib";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userName: null,
    loginInProgress: false,
    timeOfLogin: 0

  },
  mutations: {
    SET_LOGIN_PROGRESS(s, flag) {
      s.loginInProgress = flag;
    },
    DO_LOGIN(s, uname) {
      s.loginInProgress = false;
      s.userName = uname;
      s.timeOfLogin = Date.now();
    }
  },
  actions: {}
});
