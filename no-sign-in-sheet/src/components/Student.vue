<template>
  <v-container>
    <v-layout row justify-center pb-4>
      <h1>Student View</h1>
    </v-layout>
    <v-layout row justify-center pb-4>
      <v-data-table :headers="this.headers" :items="classes" class="elevation-1">
        <template slot="items" slot-scope="props">
          <td>{{ props.item.className }}</td>
          <td>{{ props.item.teacher }}</td>
          <td>
            <v-btn @click="addStudent(props.item['.key'])">Add myself to class</v-btn>
          </td>
        </template>
      </v-data-table>
    </v-layout>
  </v-container>
</template>

<script>
import firebase from "firebase";

export default {
  data: () => ({
    headers: [
      { text: "Class", value: "class" },
      { text: "Teacher", value: "student" },
      { text: "Key", value: "key" }
    ],
    classes: []
  }),
  firebase() {
    return {
      classes: firebase.database().ref("classes")
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
    },
    addStudent(id) {
      console.log(id);
      var myTime = new Date().toLocaleString();
      firebase
        .database()
        .ref()
        .child("classes")
        .child(id)
        .child("students")
        .push()
        .set({
          email: this.$store.state.email,
          name: this.$store.state.uname
        });
    }
  },
  //life cycle diagram
  beforeMount() {}
};
</script>

