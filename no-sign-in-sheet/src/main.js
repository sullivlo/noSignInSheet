import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import firebase from "firebase";


Vue.config.productionTip = false;

new Vue({
  router,
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$router.push("/logout-success");
      } else {
        this.$router.push("/auth");
      }
    });
  },
  el: "#app",
  render: h => h(App)
});
