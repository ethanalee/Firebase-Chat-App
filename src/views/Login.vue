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
export default {
  name: "home",
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    emailLogin: function() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.username, this.password)
        .then(
          user => {
            alert("Success!");
            this.$router.push("/");
          },
          err => {
            alert(err.message);
          }
        );
    }
  }
};
</script>
