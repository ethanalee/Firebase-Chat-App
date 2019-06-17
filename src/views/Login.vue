<template>
    <v-container fluid>
    <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
            <v-toolbar dark color="primary">
            <v-toolbar-title>Login form</v-toolbar-title>
            <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text
              align-center
            >
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
            <p>
              Sign in With Google <br>
              <button @click="socialLogin" class="social-button">
                <img alt="Google Logo" src="../assets/google-logo.png">
              </button>

            </p>
            </v-card-text>

            <v-card-actions>
            <v-btn to="signup" color="primary">Signup</v-btn>

            <v-btn block color="primary" @click="emailLogin">Login</v-btn>
            </v-card-actions>

        </v-card>

        </v-flex>
    </v-layout>
    </v-container>
</template>

<style scoped>
  button {
    margin-top: 20px;
    width: 10%;
    cursor: pointer;
    text-align: center;
  }
  p {
    text-align: center;
  }
  .social-button {
    width: 75px;
    background: white;
    padding: 10px;
    border-radius: 100%;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.2);
    outline: 0;
    border: 0;
  }
  .social-button:active {
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.1);
  }
  .social-button img {
    width: 100%;
    padding: 4px;
    margin-top: -1px;
    margin-bottom: -7px;
  }
</style>

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
          () => {
            // Store result in vuex
            this.$store.dispatch('authLogIn', auth.currentUser())

            this.$router.push('/home')

            // reset
            this.username = ''
            this.password = ''
          },
          err => {
            alert(err.message)
          }
        )
    },
    socialLogin () {
      auth
        .socialLogin()
        .then((res) => {
          const user = res.user;
          this.$store.dispatch('authLogIn', user)
          this.$router.push('/home')
        },
        (err) => {
          alert('Oops. ' + err.message)
        })
    },
    logOut: function () {
      auth.logOut().then(() => {
        this.$store.dispatch('authLogOut')
      })
    }
  }
};
</script>
