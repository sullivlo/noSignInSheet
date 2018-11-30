<template>
  <v-container>
    <v-layout row justify-center pb-4>
      <h1>Student View</h1>
    </v-layout>
    <v-layout row justify-center pb-4>
      <v-data-table :headers="this.headers" :items="this.notClasses" class="elevation-1">
        <template slot="items" slot-scope="props">
          <td>{{ props.item.name }}</td>
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
    //this.createClasses();
  },
  firebase() {
    return {
      allClasses: {
        source: firebase
          .database()
          .ref()
          .child("classes"),
        // optionally bind as an object
        asObject: false,
        // optionally provide the cancelCallback
        cancelCallback: function() {},
        // this is called once the data has been retrieved from firebase
        readyCallback: function() {
          console.info("Info");
          this.createClasses();
        }
      }
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

      console.log("All Classes:");
      console.log(this.allClasses);
      console.log(typeof this.allClasses);

      var tmpMyClasses = [];
      var tmpNotMyClasses = [];

      console.log("Before class loop");

      //loop thru classes
      for (var currClass in this.allClasses) {
        console.log("In class loop");
        var studList = this.allClasses[currClass].students;
        var inClass = false;

        if (studList != null) {
          //console.log(studList);

          //loop thru student list
          for (var stud in studList) {
            var stuEmail = studList[stud].email;
            if (stuEmail == this.$store.state.email) {
              console.log("I am in this class yee haw ");
              //console.log(this.allClasses[currClass]);
              //add classes to myClasses
              inClass = true;
              //tmpMyClasses.push(this.allClasses[currClass]);
            } else {
              console.log("I am not in this class darn it  ");
              //console.log(this.allClasses[currClass]);
              //add classes to not myClasses
              //tmpNotMyClasses.push(this.allClasses[currClass]);
            }
          }
        }

        if (inClass) {
          tmpMyClasses.push(this.allClasses[currClass]);
        } else {
          tmpNotMyClasses.push(this.allClasses[currClass]);
        }
      }
      console.log(typeof tmpNotMyClasses);
      console.log(tmpNotMyClasses);

      console.log(typeof tmpMyClasses);
      console.log(tmpMyClasses);
      this.myClasses = tmpMyClasses;
      this.notClasses = tmpNotMyClasses;
      //return { myClasses: tmpMyClasses, notClasses: tmpNotMyClasses };
    }
  },
  //life cycle diagram
  beforeMount() {}
};
</script>

