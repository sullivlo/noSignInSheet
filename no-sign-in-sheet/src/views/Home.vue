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
export default {
  name: "App",
  created: function() {
    var user = firebase.auth().currentUser; 
    // notice that a Vuex mutation cannot contain more than 1 payload parameter.
    this.$store.commit('login', { name: user.displayName, email: user.email});
    console.log(this.$store.state.uname);
    console.log(this.$store.state.email);

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

