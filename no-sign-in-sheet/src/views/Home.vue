<template>
  <v-container>
    <v-layout row>
      <v-label>
        <h1>{{ this.$store.state.uname }}'s Home</h1>
      </v-label>
    </v-layout>
    <v-layout row>
      <v-data-table :headers="this.headers" :items="classes" class="elevation-1">
        <template slot="items" slot-scope="props">
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.teacher }}</td>
          <td>
            <v-btn>Launch Session</v-btn>
          </td>
        </template>
      </v-data-table>
    </v-layout>
    <v-layout row>
      <v-flex>
        <form @submit="addClass(cName)">
          <input v-model="cName" placeholder="Class Name">
          <button type="submit">Create New Class</button>
        </form>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
import firebase from "firebase";
//import { db, currentUser } from "../firebaseConfig";

export default {
  name: "App",
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
  },
  data() {
    return {
      headers: [
        { text: "Class", value: "class" },
        { text: "Teacher", value: "student" },
        { text: "Key", value: "key" }
      ],
      uname: "",
      classes: [],
      cName: null,
      rootRef: null
    };
  },
  firestore() {
    return {
      classes: firebase.firestore().collection("classes")
    };
  },
  methods: {
    addClass(name) {
      // Add a new document in collection "cities"
      firebase
        .firestore()
        .collection("classes")
        .doc()
        .set({
          name: name,
          teacher: this.$store.state.uname,
          email: this.$store.state.email
        })
        .then(function() {
          console.log("Document successfully written!");
        })
        .catch(function(error) {
          console.error("Error writing document: ", error);
        });
    }
  }
};
</script>

