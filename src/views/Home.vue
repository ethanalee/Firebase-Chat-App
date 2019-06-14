<template>
  <v-container grid-list-xs fluid class="home-page">
    <v-layout row wrap fill-height>
      <v-flex xs12 md4>

        <v-layout row wrap fill-height>
          <v-flex xs12>
            <v-card>
              <v-card-title primary-title>
                <div>
                  <h3 class="headline mb-0">Friend Search</h3>
                  <div>
                    <v-form
                      ref="form"
                      v-model="valid"
                      lazy-validation
                    >
                    <v-autocomplete
                        v-model="friendsAdded"
                        :items="items"
                        :loading="isLoading"
                        :search-input.sync="search"
                        color="white"
                        hide-no-data
                        hide-selected
                        item-text="displayName"
                        item-value="uid"
                        placeholder="Start typing to Search"
                        prepend-icon="mdi-database-search"
                        return-object
                        required
                      ></v-autocomplete>
                      
                    </v-form>
                  </div>
                </div>
              </v-card-title>
              <v-card-actions>
                <v-btn
                        :disabled="!valid"
                        color="success"
                        @click="validate"
                      >
                        Add Friend
                      </v-btn>
              </v-card-actions>
            </v-card>

          </v-flex>
          <v-flex fluid fill-height="">
              <v-card xs12>
              <!-- <v-toolbar color="indigo" dark>
                <v-toolbar-side-icon></v-toolbar-side-icon>
      
                <v-toolbar-title>Friends</v-toolbar-title>
      
                <v-spacer></v-spacer>
              </v-toolbar> -->
              <v-list three-line v-if="!!friendsDisplayed.length">
                <v-list-tile
                  v-for="friend in friendsDisplayed"
                  :key="friend.uid"
                  avatar
                  ripple
                  @click="print"
                >
                  <v-list-tile-action>
                    <v-icon v-if="friend.icon" color="pink">star</v-icon>
                  </v-list-tile-action>
      
                  <v-list-tile-content>
                    <v-list-tile-title v-text="friend.members[0].displayName" v-if="activeUser !== friend.members[0].uid"></v-list-tile-title>
                    <v-list-tile-title v-text="friend.members[1].displayName" v-else></v-list-tile-title>
                  </v-list-tile-content>
      
                  <v-list-tile-avatar>
                    <img :src="friend.avatar">
                  </v-list-tile-avatar>
                </v-list-tile>
              </v-list>
            </v-card>
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

.v-btn {
  .button {
    margin-bottom: 10px;
  }
}
button {
  margin-bottom: 10px;
}
</style>

<script>
  import { db, auth } from '@/db.js'

  export default {
    components: {
    },
    data () {
      return {
        friends: [],
        friendsAdded: [],
        friendsDisplayed: [],
        user: null,
        isLoading: false,
        search: null,
        valid: true,
      }
    },
    computed: {
      items () {
      return this.friends.map(friend => {
        const displayName = friend.displayName
        return Object.assign({}, friend, { displayName })
      })
      },
      activerUser () {
        return this.$store.state.activerUser.uid
      }

    },
    beforeMount () {
      this.loginUser()
    },
     methods: {
      print () {
        console.log(this.friendsDisplayed)
      },
       validate () {
        if (this.$refs.form.validate()) {
        this.addFriend()
        }
      },
      addFriend () {
        var uid = this.$store.state.activeUser.uid
        const usersRef = db.collection('users').doc(uid)
        console.log(this.friendsAdded)

        const conversationRef = db.collection('conversations').add({
          lastModified: null,
          members: [db.doc('users/' + this.friendsAdded.uid), db.doc('users/' + uid)],
        })

        this.friendsAdded = []
      },
      loginUser () {
        var uid = this.$store.state.activeUser.uid
        var displayName = this.$store.state.activeUser.displayName || this.$store.state.activeUser.email
        var email = this.$store.state.activeUser.email
        const usersRef = db.collection('users').doc(uid)

        usersRef.get()
          .then((docSnapShot) => {
            if (docSnapShot.exists) {
              usersRef.onSnapshot((doc) => {
                this.user = doc
              })
            } else {
              usersRef.set({
                displayName: displayName,
                uid: uid,
                email: email
              })
              this.user = this.$store.state.activeUser
            }
          })
      },
    },
    firestore () {
      return {
        friends: db.collection('users'), // collection of users
        friendsDisplayed: db.collection('conversations').where("members", "array-contains", db.doc('users/' + this.$store.state.activeUser.uid))
      }
    },
  }
</script>
