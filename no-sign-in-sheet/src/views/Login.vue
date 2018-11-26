<template lang="html">
  <div id="firebaseui-auth-container"></div>
</template>

<script>
import firebase from "firebase";
import firebaseui from "firebaseui";
import { config } from "../firebaseConfig";
import base from "../../vue.config.js"

export default {
  name: "auth",
  mounted() {
    var uiConfig = {
      signInSuccessUrl: base.baseUrl,
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ]
    };
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start("#firebaseui-auth-container", uiConfig);
  }
};
</script>