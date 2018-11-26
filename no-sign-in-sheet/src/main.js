import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import firebase from "firebase";


Vue.config.productionTip = false;

new Vue({
  router,
  created() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$router.push({ name: 'home' });
      } else {
        this.$router.push({ name: 'login' });
      }
    });
  },
  el: "#app",
  render: h => h(App)
});
