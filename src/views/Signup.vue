<template>
    <v-container fluid>
    <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
            <v-toolbar dark color="primary">
            <v-toolbar-title>Sign Up form</v-toolbar-title>
            <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
            <v-form>
                <v-text-field
                prepend-icon="edit"
                name="displayName"
                label="Display Name"
                type="text"
                v-model="displayName"
                ></v-text-field>
                <v-text-field
                prepend-icon="person"
                name="email"
                label="Email"
                type="text"
                v-model="email"
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
            <v-btn color="primary" @click="emailSignup">Sign Up</v-btn>
            </v-card-actions>
        </v-card>
        </v-flex>
    </v-layout>
    </v-container>
</template>

<script>
import { auth, db } from '@/db.js'

export default {
  name: "login",
  data() {
    return {
      email: "",
      password: "",
      displayName: ""
    };
  },
  computed: {
  },
  methods: {
    emailSignup: function () {
      auth
        .emailSignup(
          this.email,
          this.password
        )
        .then(
        (res) => {
          db.collection('users').doc(res.user.uid).set({
            displayName: this.displayName,
            uid: res.user.uid,
            email: this.email
          })

          this.$router.push('/login')
        },
        (err) => {
            alert('Oops. ' + err.message)
        });
    }
  }
};
</script>
