<template>
  <v-container>
    <v-layout row>
      <v-layout column pb-4>
        <v-card dark>
          <v-card-title>
            <h2>Join a Class:</h2>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-divider dark/>
          <v-data-table
            :headers="this.headers"
            :items="this.notClasses"
            :search="search"
            class="elevation-1"
            dark
            :rows-per-page-items="[ 7, 10, 15, { text: 'All', value: -1 } ]"
            pagination.sync="{ rowsPerPage: 7 }"
          >
            <template slot="items" slot-scope="props">
              <td>{{ props.item.name }}</td>
              <td>{{ props.item.teacher }}</td>
              <td>
                <v-btn @click="addStudent(props.item['.key'])">Join Class</v-btn>
              </td>
            </template>
            <v-alert
              slot="no-results"
              :value="true"
              color="error"
              icon="warning"
            >Your search for "{{ search }}" found no results.</v-alert>
          </v-data-table>
        </v-card>
      </v-layout>
      <v-spacer vertical/>
      <v-layout column pb-4>
        <v-card dark>
          <v-card-title>
            <h2>My Classes:</h2>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-divider dark/>
          <v-data-table
            :headers="this.headers"
            :items="this.myClasses"
            :search="search"
            class="elevation-1"
            dark
            :rows-per-page-items="[ 7, 10, 15, { text: 'All', value: -1 } ]"
            pagination.sync="{ rowsPerPage: 7 }"
          >
            <template slot="items" slot-scope="props">
              <td>{{ props.item.name }}</td>
              <td>{{ props.item.teacher }}</td>
              <td>
                <v-btn @click="joinSession(props.item['.key'])">Join Session</v-btn>
              </td>
            </template>
            <v-alert
              slot="no-results"
              :value="true"
              color="error"
              icon="warning"
            >Your search for "{{ search }}" found no results.</v-alert>
          </v-data-table>
        </v-card>
      </v-layout>
    </v-layout>
  </v-container>
</template>

<script>
import firebase from "firebase";

export default {
  data: () => ({
    headers: [
      { text: "Class", value: "name" },
      { text: "Teacher", value: "student" },
      { text: "Key", value: "key" }
    ],
    myClasses: [],
    allClasses: [],
    notClasses: [],
    search: null
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
    joinSession(id) {
      var myTime = new Date().toLocaleString();
      const e = this.$store.state.email;
      const u = this.$store.state.uname;
      firebase
        .database()
        .ref()
        .child(`classes/${id}/sessions`)
        .orderByChild("date")
        .limitToLast(1)
        .once("child_added", function(snapshot) {
          console.log(snapshot.key);
          firebase
            .database()
            .ref()
            .child(`classes/${id}/sessions/${snapshot.key}/attendees`)
            .push()
            .set({
              email: e,
              name: u,
              present: true
            });
        });

      this.createClasses();
    },
    createClasses() {
      //find classes not currently entrolled
      //loop through all this.allCasses
      //  check if current user is in the student list

      // console.log("All Classes:");
      // console.log(this.allClasses);
      // console.log(typeof this.allClasses);

      var tmpMyClasses = [];
      var tmpNotMyClasses = [];

      // console.log("Before class loop");

      //loop thru classes
      for (var currClass in this.allClasses) {
        // console.log("In class loop");
        var studList = this.allClasses[currClass].students;
        var inClass = false;

        if (studList != null) {
          //console.log(studList);

          //loop thru student list
          for (var stud in studList) {
            var stuEmail = studList[stud].email;
            if (stuEmail == this.$store.state.email) {
              // console.log("I am in this class yee haw ");
              //console.log(this.allClasses[currClass]);
              //add classes to myClasses
              inClass = true;
              //tmpMyClasses.push(this.allClasses[currClass]);
            } else {
              // console.log("I am not in this class darn it  ");
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

      this.myClasses = tmpMyClasses;
      this.notClasses = tmpNotMyClasses;
      //return { myClasses: tmpMyClasses, notClasses: tmpNotMyClasses };
    }
  },
  //life cycle diagram
  beforeMount() {}
};
</script>

