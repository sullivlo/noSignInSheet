import Vue from "vue";
import Vuex from "vuex";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import firebase from "firebase";
import store from './store'
import 'es6-promise/auto'


Vue.config.productionTip = false;
Vue.use(Vuex);

new Vue({
  router,
  store,
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
