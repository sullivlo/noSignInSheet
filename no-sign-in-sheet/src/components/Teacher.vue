<template>
  <v-container>
    <v-layout row justify-center pb-4>
      <v-card>
        <v-card-title>
          <h2>My Classes</h2>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>

        <v-data-table
          :headers="this.headers"
          :items="classes"
          :search="search"
          class="elevation-1"
          dark
          :rows-per-page-items="[ 7, 10, 15, { text: 'All', value: -1 } ]"
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
    <v-layout row justify-center>
      <form @submit="addClass(cName)">
        <v-text-field v-model="cName" placeholder="Class Name"/>
        <v-btn type="submit">Create New Class</v-btn>
      </form>
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
    },
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

