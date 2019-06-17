<template>
  <v-toolbar
    color="primary"
    dark
    scroll-off-screen
    scroll-target="#scrolling-techniques"
  >
    <v-toolbar-side-icon></v-toolbar-side-icon>
    <v-toolbar-title v-if="isHome">Welcome, {{ this.displayName || this.$store.state.activeUser.email }}</v-toolbar-title>
    <v-toolbar-title v-else>Chat App</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn round color="secondary" dark @click="logOut">
        Log Out
    </v-btn>
  </v-toolbar>
</template>

<script>
import { auth, db } from '../db'

export default {
  name: 'navBar',
  data () {
    return {
      displayName: ""
    }
  },
  computed: {
    isHome () {
      if (this.$route.path === '/home') {
      return true
      }
      return false
    },
  },
  created () {
      var vm = this
      var userRef = db.collection('users').doc(vm.$store.state.activeUser.uid)

      userRef.get().then(function(doc) {
          if (doc.exists) {
              vm.displayName = doc.data().displayName
          } else {
              console.log("No such document!");
          }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });
  },
  methods: {
    logOut: function () {
      auth.logOut().then(() => {
        this.$store.dispatch('authLogOut')
        this.$router.replace('/login')
      })
    },
  }
}
</script>