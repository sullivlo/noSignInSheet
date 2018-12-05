<template>
  <v-container>
    <v-layout pb-4 justify-center>
      <v-card dark>
        <v-card-title>
          <h2>My Classes:</h2>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search2"
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
          :search="search2"
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
    <v-layout pb-4 justify-center>
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
  </v-container>
</template>

<script>
import firebase from "firebase";

export default {
  data: () => ({
    headers: [
      { text: "Class", value: "name" },
      { text: "Teacher", value: "student" },
      { text: "Join", value: "join" }
    ],
    myClasses: [],
    allClasses: [],
    notClasses: [],
    search: null,
    search2: null
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
          this.createClasses();
        }
      }
    };
  },

  methods: {
    addStudent(id) {
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
      var CheckedInflag = false;

      const myLat = this.$store.state.myLat;
      const myLong = this.$store.state.myLong;

      var tmpSession = null;
      firebase
        .database()
        .ref()
        .child(`classes/${id}/sessions`)
        .once("value", snapshot => {
          tmpSession = snapshot.val();
        });

      if (tmpSession) {
        firebase
          .database()
          .ref()
          .child(`classes/${id}/sessions`)
          .orderByChild("date")
          .limitToLast(1)
          .once("child_added", function(snapshot) {
            var teacherDate = snapshot.val().date;
            var x = new Date(teacherDate);
            var y = new Date(myTime);
            //check to see if the current time is within an hour of session creation
            if (y.getTime() - x.getTime() < 3600000) {
              firebase
                .database()
                .ref()
                .child(`classes/${id}/sessions/${snapshot.key}/attendees`)
                .on("child_added", function(tmpAttends) {
                  if (tmpAttends.val().email == e) {
                    CheckedInflag = true;
                  }
                });

              if (!CheckedInflag) {
                var teacherLat = snapshot.val().lat;
                var teacherLong = snapshot.val().long;

                if (
                  (myLat - teacherLat < 0.000000001 ||
                    teacherLat - myLat < 0.000000001) &&
                  (myLong - teacherLong < 0.000000001 ||
                    teacherLong - myLong < 0.000000001)
                ) {
                  alert("Successfully Checked-in!");
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
                } else {
                  alert("GPS location does not match the teacher's.");
                }
              } else {
                alert("Already Checked-in.");
              }
            } else {
              alert("No active session available.");
            }
          });
      } else {
        alert("No active session available.");
      }

      this.createClasses();
    },
    createClasses() {
      //find classes not currently entrolled
      //loop through all this.allCasses
      //check if current user is in the student list

      var tmpMyClasses = [];
      var tmpNotMyClasses = [];

      //loop thru classes
      for (var currClass in this.allClasses) {
        var studList = this.allClasses[currClass].students;
        var inClass = false;

        if (studList != null) {
          //loop thru student list
          for (var stud in studList) {
            var stuEmail = studList[stud].email;
            if (stuEmail == this.$store.state.email) {
              //student is in this class
              inClass = true;
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
    }
  }
};
</script>

