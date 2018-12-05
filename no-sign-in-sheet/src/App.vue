<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" absolute temporary right touchless disable-resize-watcher>
      <v-list>
        <v-list-tile v-for="(item, i) in items" :key="i" @click="menuClicked(item)">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <router-link to="/" tag="span" exact>
          <a style="text-decoration: none">
            <img src="@/assets/logo.png" alt="logo" width="20" height="20"> No Sign-in Sheet
          </a>
        </router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <v-icon @click="goHome()">home</v-icon>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
    </v-toolbar>

    <v-content>
      <router-view></router-view>
    </v-content>
    <v-footer>
      <v-flex primary lighten-2 py-3 text-xs-center white--text xs12>
        &copy;2018 —
        <strong>Louis Sullivan and Jake Walton</strong>
      </v-flex>
    </v-footer>
  </v-app>
</template>

<script>
import firebase from "firebase";
export default {
  name: "App",
  created() {
    this.router = this.$router;
  },
  data() {
    return {
      //
      items: [
        { title: "Settings", component: "settings", icon: "settings" },
        { title: "Log Out", component: "logOut", icon: "exit_to_app" }
      ],
      drawer: null
    };
  },
  methods: {
    goHome() {
      this.$router.push({ name: "home" });
    },
    menuClicked(key) {
      console.log(key.title);
      if (key.component == "logOut") {
        firebase.auth().signOut();
        location.reload();
      } else {
        this.$router.push({ name: key.component });
      }
    }
  }
};
</script>
