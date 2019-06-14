<template>
  <v-toolbar
    color="primary"
    dark
    scroll-off-screen
    scroll-target="#scrolling-techniques"
  >
    <v-toolbar-side-icon></v-toolbar-side-icon>
    <v-toolbar-title v-if="isHome">Welcome, {{ this.$store.state.activeUser.displayName || this.$store.state.activeUser.email }}</v-toolbar-title>
    <v-toolbar-title v-else>Chat App</v-toolbar-title>
    <v-spacer></v-spacer>
    <!-- <v-btn icon>
        <v-icon>search</v-icon>
    </v-btn>
    <v-btn icon>
        <v-icon>favorite</v-icon>
    </v-btn> -->
    <v-btn round color="secondary" dark @click="logOut">
        Log Out
    </v-btn>
  </v-toolbar>
</template>

<script>
import { auth } from '../db'

export default {
  name: 'navBar',
  data () {
    return {

    }
  },
  computed: {
    isHome () {
      if (this.$route.path === '/home') {
      return true
      }
      return false
    }
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