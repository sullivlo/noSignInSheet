<template>
  <v-app>
    <v-toolbar app>

      
      <v-toolbar-title class="headline text-uppercase">
        <router-link to="/" tag="span" exact>
            <a style="text-decoration: none">No Sign-in Sheet</a>
        </router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <v-menu offset-y open-on-hover>
        <v-toolbar-side-icon slot="activator"></v-toolbar-side-icon>
        <v-list>
              <v-list-tile
                v-for="(item, i) in items"
                :key="i"
                @click="menuClicked(item)"
              >
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile>
            </v-list>
      </v-menu>
      
    </v-toolbar>

    <v-content>
      <router-view></router-view>
    </v-content>
    <v-footer>
      <v-flex
        primary
        lighten-2
        py-3
        text-xs-center
        white--text
        xs12
      >
        &copy;2018 — <strong>Louis Sullivan and Jake Walton</strong>
      </v-flex>
    </v-footer>
  </v-app>
</template>

<script>
import Home from "./views/Home";
export default {
  name: "App",
  components: {
    Home
  },
  data() {
    return {
      //
      items: [
        { title: "Settings", component: "settings" },
        { title: "Log Out", component: "logOut" }
      ]
    };
  },
  methods: {
    menuClicked(key) {
      console.log(key.title);
      this.$router.push({ name: key.component });
    }
  }
};
</script>
