<template>
  <v-container>
    <v-layout row>
      <v-label>
        <h1>{{ this.$store.state.uname }}'s Home</h1>
        <v-data-table :headers="headers" :items="classes" class="elevation-1">
          <template slot="classTable" slot-scope="props">
            <td>{{ props.item.name }}</td>
            <td class="text-xs-right">{{ props.item.className }}</td>
            <td class="text-xs-right">{{ props.item.teacher }}</td>
            <td class="text-xs-right">{{ props.item.key }}</td>
          </template>
        </v-data-table>
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
    this.$store.commit("login", { name: user.displayName, email: user.email });
    console.log(this.$store.state.uname);
    console.log(this.$store.state.email);
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
        { text: "Student", value: "student" },
        { text: "Key", value: "key" }
      ],
      uname: "",
      classes: firebase.database().ref("classes"),
      rootRef: null
    };
  },
  methods: {}
};
</script>

