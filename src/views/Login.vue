<template>
    <v-container fluid>
    <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
            <v-toolbar dark color="primary">
            <v-toolbar-title>Login form</v-toolbar-title>
            <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
            <v-form>
                <v-text-field
                prepend-icon="person"
                name="username"
                label="Username"
                type="text"
                v-model="username"
                ></v-text-field>
                <v-text-field
                id="password"
                prepend-icon="lock"
                name="password"
                label="Password"
                type="password"
                v-model="password"
                ></v-text-field>
            </v-form>
            </v-card-text>

            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="emailLogin">Login</v-btn>
            </v-card-actions>
        </v-card>
        </v-flex>
    </v-layout>
    </v-container>
</template>

<script>
import { auth } from '@/db.js'

export default {
  name: "login",
  data() {
    return {
      username: "",
      password: ""
    };
  },
  computed: {
    isAuth () {
      return this.$store.state.isAuth
    },
    activeUser () {
      return this.$store.state.activeUser
    }
  },
  methods: {
    emailLogin: function () {
      auth
        .emailLogIn(
          this.username,
          this.password
        )
        .then(
          user => {
            // Store result in vuex
            this.$store.dispatch('authLogIn', auth.currentUser())

            this.$router.push('/about')

            // reset
            this.username = ''
            this.password = ''
          },
          err => {
            alert(err.message)
          }
        )
    },
    logOut: function () {
      auth.logOut().then(() => {
        this.$store.dispatch('authLogOut')
      })
    },
  }
};
</script>
