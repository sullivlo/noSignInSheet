<template>
  <v-container>
    <v-layout row pb-4>
      <v-label>
        <h1>History of {{ this.class.name }}</h1>
      </v-label>
    </v-layout>
    <v-layout row pb-4 justify-center>
      <v-card dark>
        <v-card-title>
          <h2>Select a Session:</h2>
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
          :items="this.sessions"
          :search="search"
          class="elevation-1"
          dark
          :rows-per-page-items="[ 7, 10, 15, { text: 'All', value: -1 } ]"
          pagination.sync="{ rowsPerPage: 7 }"
        >
          <template slot="items" slot-scope="props">
            <td>{{ days[new Date(props.item.date).getDay()] }}, {{ new Date(props.item.date).getDay() }}/{{ new Date(props.item.date).getMonth() }}/{{ new Date(props.item.date).getFullYear() }}</td>
            <td>
              <v-btn @click="showAttendees(props.item['.key'])">Show Attendees</v-btn>
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
    <v-layout row justify-center>
      <v-card dark>
        <v-card-title>
          <h2>Attendence on {{ this.date.getDay() }}/{{ this.date.getMonth() }}/{{ this.date.getFullYear() }}</h2>
          <v-spacer pl-8></v-spacer>
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
          :headers="this.attenHeaders"
          :items="this.attendees"
          :search="search"
          class="elevation-1"
          dark
          :rows-per-page-items="[ 7, 10, 15, { text: 'All', value: -1 } ]"
          pagination.sync="{ rowsPerPage: 7 }"
        >
          <template slot="items" slot-scope="props">
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.email }}</td>
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

//import { db, currentUser } from "../firebaseConfig";

export default {
  name: "App",
  created() {},
  props: ["id"],
  firebase() {
    return {
      class: {
        source: firebase.database().ref(`classes/${this.id}`),
        // optionally bind as an object
        asObject: true,
        // optionally provide the cancelCallback
        cancelCallback: function() {},
        // this is called once the data has been retrieved from firebase
        readyCallback: function() {}
      },
      sessions: {
        source: firebase.database().ref(`classes/${this.id}/sessions`),
        // optionally bind as an object
        asObject: false,
        // optionally provide the cancelCallback
        cancelCallback: function() {},
        // this is called once the data has been retrieved from firebase
        readyCallback: function() {}
      }
    };
  },
  data: () => {
    return {
      days: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ],

      class: null,
      classes: [],
      sessions: [],
      attendees: [],
      date: new Date(),
      search: null,
      headers: [
        { text: "Date", value: "name" },
        { text: "Show", value: "launch" }
      ],
      attenHeaders: [
        { text: "Name", value: "name" },
        { text: "Email", value: "email" }
      ]
    };
  },
  methods: {
    showAttendees(key) {
      //
      this.attendees = [];
      var date;
      firebase
        .database()
        .ref(`classes/${this.id}/sessions/${key}`)
        .once("value", snap => {
          date = snap.val().date;
        });
      this.date = new Date(date);
      firebase
        .database()
        .ref(`classes/${this.id}/sessions/${key}/attendees`)
        .on("child_added", snap => {
          //
          var stu = { name: snap.val().name, email: snap.val().email };
          this.attendees.push(stu);
        });
    }
  }
};
</script>
