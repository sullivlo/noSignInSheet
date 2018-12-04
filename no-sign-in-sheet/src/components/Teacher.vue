<template>
  <v-container>
    <v-layout row justify-center pb-4>
      <v-card dark>
        <v-card-title>
          <h2>My Classes</h2>
          <v-tooltip top>
            <v-icon slot="activator" @click="dialog = true">add</v-icon>
            <span>Add a class.</span>
          </v-tooltip>
          <v-dialog v-model="dialog" width="500">
            <v-card>
              <v-card-title class="headline grey lighten-2" primary-title>Create New Class</v-card-title>
              <v-card-text>Enter Name:
                <v-text-field v-model="cName" placeholder="Class Name"/>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" flat @click="dialog = false">Cancel</v-btn>
                <v-btn color="primary" flat @click="dialog = false, addClass(cName)">Create</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
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
          :items="classes"
          :search="search"
          class="elevation-1"
          dark
          :rows-per-page-items="[ 5, 7, 10, 15, { text: 'All', value: -1 } ]"
          pagination.sync="{ rowsPerPage: 7 }"
        >
          <template slot="items" slot-scope="props">
            <td>
              <v-tooltip top>
                <v-icon slot="activator" @click="dialog2 = true">remove_circle_outline</v-icon>
                <span>Delete this class.</span>
              </v-tooltip>
              {{ props.item.name }}
              <v-dialog v-model="dialog2" width="500">
                <v-card>
                  <v-card-title class="headline grey lighten-2" primary-title>Delete Class:</v-card-title>
                  <v-card-text>Are you sure you want to delete {{ props.item.name }}?</v-card-text>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click="dialog2 = false">Cancel</v-btn>
                    <v-btn
                      color="primary"
                      flat
                      @click="dialog2 = false, removeClass(props.item['.key'])"
                    >Remove</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </td>
            <td>{{ props.item.teacher }}</td>
            <td>
              <v-btn @click="launchSession(props.item['.key'])">New Session</v-btn>
            </td>
            <td>
              <v-btn @click="showHistory(props.item['.key'])">History</v-btn>
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
      { text: "Launch Session", value: "launch" },
      { text: "History", value: "history" }
    ],
    classes: [],
    cName: null,
    dialog: null,
    dialog2: null,
    search: ""
  }),
  firebase() {
    return {
      classes: firebase
        .database()
        .ref("classes")
        .orderByChild("email")
        .equalTo(this.$store.state.email)
    };
  },
  methods: {
    removeClass(key) {
      // Add a new document in collection "cities"
      firebase
        .database()
        .ref()
        .child(`classes/${key}`)
        .remove();
    },
    addClass(name) {
      // Add a new document in collection "cities"
      firebase
        .database()
        .ref()
        .child("classes")
        .push()
        .set({
          name: name,
          teacher: this.$store.state.uname,
          email: this.$store.state.email,
          sessions: [],
          students: []
        });
      this.cName = "";
    },
    showHistory(id) {
      //
      this.$router.push({ name: "history", params: { id: id } });
    },
    launchSession(id) {
      console.log(id);
      var myTime = new Date().toLocaleString();
      var active = false;

      firebase
        .database()
        .ref()
        .child(`classes/${id}/sessions`)
        .orderByChild("date")
        .limitToLast(1)
        .once("child_added", function(snapshot) {
          var teacherDate = snapshot.val().date;

          // var teacherDate = teacherDate.split(",");
          // var tmpTime = myTime.split(",");

          console.log(typeof teacherDate);
          console.log(typeof myTime);

          var x = new Date(teacherDate);
          var y = new Date(myTime);
          console.log(y - x);
          //check to see if the current time is within an hour of session creation
          if (y.getTime() - x.getTime() < 3600000) {
            //
            active = true;
          }
        });

      if (!active) {
        firebase
          .database()
          .ref()
          .child("classes")
          .child(id)
          .child("sessions")
          .push()
          .set({
            lat: this.$store.state.myLat,
            long: this.$store.state.myLong,
            totalAttendees: "0",
            date: myTime
          });
        alert("Session created!");
      } else {
        alert("There is already an active session!");
      }
    }
  }
};
</script>

