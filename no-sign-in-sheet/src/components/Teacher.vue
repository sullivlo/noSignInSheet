<template>
  <v-container>
    <v-layout row justify-center pb-4>
      <v-card dark>
        <v-card-title>
          <h2>My Classes
            <v-dialog v-model="dialog" width="500">
              <v-icon slot="activator" @click="showAddClass()">add</v-icon>
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
          </h2>
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
          :rows-per-page-items="[ 7, 10, 15, { text: 'All', value: -1 } ]"
          pagination.sync="{ rowsPerPage: 7 }"
        >
          <template slot="items" slot-scope="props">
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.teacher }}</td>
            <td>
              <v-btn @click="launchSession(props.item['.key'])">New Session</v-btn>
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
      { text: "Key", value: "key" }
    ],
    classes: [],
    cName: null,
    dialog: null,
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
    showAddClass() {},
    launchSession(id) {
      console.log(id);
      var myTime = new Date().toLocaleString();
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
    }
  }
};
</script>

