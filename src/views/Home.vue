<template>
  <v-container grid-list-xs fluid class="home-page">
    <v-layout row wrap fill-height>
      <v-flex xs12 md4>

        <v-layout row wrap fill-height>
          <v-flex xs12>
            <v-card>
              <v-card-title primary-title>
                <div>
                  <h3 class="headline mb-0">Friend Search Here</h3>
                  <div>https://vuetifyjs.com/en/components/autocompletes#searching-an-api</div>
                </div>
              </v-card-title>
            </v-card>

          </v-flex>

          <v-flex xs12>
            <v-list three-line v-if="!!friends.length">
              <template v-for="(friend, index) in friends">
                <v-subheader v-if="friend.displayName" :key="friend.displayName">{{ friend.displayName }}</v-subheader>
                <v-divider v-else-if="friend.divider" :inset="friend.inset" :key="index"></v-divider>
                <v-list-tile avatar v-else :key="friend.title" @click="">
                  <v-list-tile-avatar>
                    <img v-if="!!friend.avatar" :src="friend.avatar">
                    <span v-if="!friend.avatar && !!friend.displayName">
                      {{ friend.displayName[0] }}
                    </span>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title v-html="friend.title"></v-list-tile-title>
                    <v-list-tile-sub-title v-html="friend.subtitle"></v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
            </v-list>
            <span v-if="!friends.length">No Firends</span>
          </v-flex>

        </v-layout>

      </v-flex>

      <v-flex xs12 md8>

        <v-layout align-space-between justify-center row fill-height>
          <v-flex xs12>
            Chat History
          </v-flex>
        </v-layout>

        <v-layout row grid bottom>
          <v-flex xs12>
            Text Input
          </v-flex>
        </v-layout>

      </v-flex>
    </v-layout>
  </v-container>
</template>

<style>
.home-page {
  height: calc(100vh - 56px)
}
</style>

<script>
  import { db, auth } from '@/db.js'

  export default {
    components: {
    },
    data () {
      return {
        friends: []
      }
    },
    beforeMount () {
      this.loginUser()
    },
     methods: {
      loginUser () {
        var uid = this.$store.state.activeUser.uid
        var displayName = this.$store.state.activeUser.displayName || this.$store.state.activeUser.email
        var email = this.$store.state.activeUser.email
        const usersRef = db.collection('users').doc(uid)

        usersRef.get()
          .then((docSnapShot) => {
            if (docSnapShot.exists) {
              usersRef.onSnapshot((doc) => {
                console.log(doc)
              })
            } else {
              usersRef.set({
                displayName: displayName,
                uid: uid,
                email: email
              })
            }
          })
      }
    },
    firestore () {
      return {
        friends: db.collection('users') // collection of users
      }
    },

  }
</script>
