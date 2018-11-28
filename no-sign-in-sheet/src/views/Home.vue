<template>
  <v-container>
    <v-layout row>
      <v-label>
        <h1>{{ this.$store.state.uname }}'s Home</h1>
      </v-label>
    </v-layout>
    <v-tabs fixed-tabs>
      <v-tab>Teacher</v-tab>
      <v-tab>Student</v-tab>
      <v-tab-item>
        <teacher-v/>
      </v-tab-item>
      <v-tab-item>
        <student-v/>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>


<script>
import firebase from "firebase";
import teacher from "../components/Teacher";
import student from "../components/Student";

//import { db, currentUser } from "../firebaseConfig";

export default {
  name: "App",
  components: { "teacher-v": teacher, "student-v": student },
  created: function() {
    var user = firebase.auth().currentUser;
    // notice that a Vuex mutation cannot contain more than 1 payload parameter.
    this.$store.commit("login", {
      name: user.displayName,
      email: user.email
    });
    this.$store.commit("dbSetup", {
      root: firebase.database().ref(),
      class: firebase
        .database()
        .ref()
        .child("classes")
    });
    this.getLocation();
  },
  data() {
    return {
      uname: "",
      classes: [],
      cName: null,
      rootRef: null
    };
  },
  methods: {
    /*****
     *  get the gps location
     *
     *****/
    getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.showPosition);
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    },
    /*****
     *  record the gps location
     *****/
    showPosition(position) {
      var myLat = position.coords.latitude;
      var myLong = position.coords.longitude;
      this.$store.commit("location", { lat: myLat, long: myLong });
    }
  }
};
</script>

