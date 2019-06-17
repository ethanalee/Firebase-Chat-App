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
                        return-object
                        required
                        :items="friends"
                        color="white"
                        item-text="displayName"
                        placeholder="Start typing to Search"
                        prepend-icon="mdi-database-search"
                        label="Add Friends"
                        :filter="customFilter"
                        outline
                        no-data-text="No Friends"
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
              <v-list three-line v-if="!!friendsDisplayed.length">
                <v-list-tile
                  v-for="friend in friendsDisplayed"
                  :key="friend.uid"
                  avatar
                  ripple
                  @click="displayConversation(friend.uid)"
                >
                  <v-list-tile-action>
                    <v-icon v-if="friend.icon" color="pink">star</v-icon>
                  </v-list-tile-action>

                  <v-list-tile-content>
                    <v-list-tile-title v-text="friend.members[0].displayName" v-if="activeUser !== friend.members[0].uid"></v-list-tile-title>
                    <v-list-tile-title v-text="friend.members[1].displayName" v-else></v-list-tile-title>
                  </v-list-tile-content>

                  <v-list-tile-avatar>
                    <img :src="friend.members[0].avatar" v-if="activeUser !== friend.members[0].uid">
                    <img :src="friend.members[1].avatar" v-else>
                  </v-list-tile-avatar>
                </v-list-tile>
              </v-list>
            </v-card>
          </v-flex>

        </v-layout>

      </v-flex>
      <v-flex>

        <chat-window :conversation="currentConversation" v-if="currentConversation === null"/>

      </v-flex>
    </v-layout>
    <v-snackbar
      v-model="snackbar"
      top
      >
      Convo already exists
    </v-snackbar>
  </v-container>
</template>

<style>
.home-page {
  height: calc(100vh - 56px)
}
</style>

<script>
  import { db, auth } from '@/db.js'
  import chatWindow from '@/components/ChatWindow'

  export default {
    components: {
      chatWindow
    },
    data () {
      return {
        friends: [],
        friendsAdded: [],
        friendsDisplayed: [],
        currentConversation: null,
        user: null,
        isLoading: false,
        search: null,
        valid: true,
        snackbar: false
      }
    },
    computed: {
      activeUser () {
        return this.$store.state["activeUser"]["uid"] || null
      },
    },
    beforeMount () {
      this.loginUser()
    },
     methods: {
      customFilter (item, queryText, itemText) {
      const textOne = item.displayName.toLowerCase()
      const searchText = queryText.toLowerCase()

      return textOne.indexOf(searchText) > -1
      },
      displayConversation (conversationUid) {
        this.currentConversation = this.friendsDisplayed.filter(convo => convo.id === conversationUid)
        this.currentConversation = this.currentConversation[0]
        console.log(this.currentConversation)
      },
      validate () {
        if (this.$refs.form.validate()) {
        this.addFriend()
        }
      },
      addFriend () {
        if(this.friendsAdded.length === 0) {
          return;
        }
        var uid = this.$store.state.activeUser.uid
        const usersRef = db.collection('users').doc(uid)

        const conversationRef = db.collection('conversations')

        const res = this.friendsDisplayed.filter(convo => {
          var friendone = convo.members[0]
          var friendtwo = convo.members[1]
          if (friendone.uid === this.friendsAdded.uid || friendtwo.uid === this.friendsAdded.uid) {
            return true
          }
        })

        if (res.length != 0) {
          this.snackbar = true
          return;
        }

        conversationRef.add({
          lastModified: null,
          members: [db.doc('users/' + this.friendsAdded.uid), db.doc('users/' + uid)]
        })
        .then( doc => {
          conversationRef.doc(doc.id).set({
            uid: doc.id
          },
          {
            merge: true
          }
          )
        })

        this.friendsAdded = []
      },
      loginUser () {
        var uid = this.$store.state.activeUser.uid
        var displayName = this.$store.state.activeUser.displayName || this.$store.state.activeUser.email
        var email = this.$store.state.activeUser.email
        var avatar = this.$store.state.activeUser.photoURL
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
                email: email,
                avatar: avatar
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
