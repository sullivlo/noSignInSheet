<template>
  <v-container>
    <v-layout row justify-center pb-4>
      <h1>Student View</h1>
    </v-layout>
    <v-layout row justify-center pb-4>
      <v-data-table :headers="this.headers" :items="myClasses" class="elevation-1">
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
    myClasses: [],
    allClasses: [],
    notClasses: []
  }),
  created() {
    // create a method to find the difference between myClass and All Classes
    this.createClasses();
  },
  firebase() {
    return {
      allClasses: firebase
        .database()
        .ref()
        .child("classes")
    };
  },

  methods: {
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
      this.createClasses();
    },
    createClasses() {
      //find classes not currently entrolled
      //loop through all this.allCasses
      //  check if current user is in the student list

      console.log(this.allClasses);
      console.log(typeof this.allClasses);

      var tmpMyClasses = [];

      for (var numClass in this.allClasses) {
        var currStudent = this.allClasses[numClass].students;

        if (currStudent != null) {
          //console.log(currStudent);
          for (var numStud in currStudent) {
            var strEmail = currStudent[numStud].email;
            if (strEmail == this.$store.state.email) {
              console.log("I am in in this class yee haw ");
              console.log(this.allClasses[numClass]);
              //add classes to myClasses
              tmpMyClasses.push(this.allClasses[numClass]);
            }
          }
        }
      }

      console.log(typeof tmpMyClasses);
      console.log(tmpMyClasses);
      return { myClasses: tmpMyClasses };
    }
  },
  //life cycle diagram
  beforeMount() {}
};
</script>

