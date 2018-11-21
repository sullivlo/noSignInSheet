import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import firebase from "firebase";
import config from "../vue.config.js";


Vue.config.productionTip = false;

new Vue({
  router,
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$router.push(config.baseUrl);
        this.$store.commit("SET_LOGIN_PROGRESS", true);
      } else {
        this.$router.push("/login");
      }
    });
  },
  el: "#app",
  render: h => h(App)
});
