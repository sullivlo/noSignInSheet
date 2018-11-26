<template>
  <v-container>
    <v-layout row>
      <h1>Home</h1>
      <v-label>
        <p>{{ this.uname }}</p>
      </v-label>
    </v-layout>
  </v-container>
</template>


<script>
import firebase from "firebase";
import store from "../store.js";
export default {
  name: "App",
  created: function() {
    this.$store.commit('login', firebase.auth().currentUser.displayName, firebase.auth().currentUser.email);
    console.log(this.$store.uname);
  },
  data() {
    return {
      uname: ""
  };
  },
  methods: {
    
  }

}

</script>

