<template>
  <v-flex xs12 md8 class="py-0 chat-window">
    <v-layout align-space-between justify-center row fill-height>
      <v-flex xs12>
        <v-card height="100%">
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">Chat History</h3>
            </div>
          </v-card-title>
          <v-card-title>
            <v-layout row wrap>
              <v-flex
                v-for="message in messagesList"
                :key="message.id"
                xs7
                :offset-xs5="message.sender === activeUser"
                :text-xs-right="message.sender === activeUser"
              >

                <v-avatar
                  size="32"
                  color="red"
                  v-if="message.sender !== activeUser"
                >
                  <!-- <img
                    v-if="chatBuddy && chatBuddy.displayPicture"
                    :src="chatBuddy.displayPicture"
                    alt="alt"
                  > -->
                  <span class="white--text">
                    N
                  </span>
                </v-avatar>
                <v-chip label color="grey lighten-2" text-color="black">
                  {{message.body}}
                </v-chip>
                <v-avatar
                  size="32"
                  color="red"
                  v-if="message.sender === activeUser"
                >
                  <!-- <img
                    v-if="chatBuddy && chatBuddy.displayPicture"
                    :src="chatBuddy.displayPicture"
                    alt="alt"
                  > -->
                  <span class="white--text">
                    N
                  </span>
                </v-avatar>
                </v-flex>
                <!-- {{ activeConversation }} -->

            </v-layout>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout row grid bottom>
      <v-flex xs12>
        <v-card class="overflow-hidden">

          <v-form v-model="valid" ref="form" lazy-validation class="px-0 py-0">
            <v-layout row grid bottom>
              <v-flex class="px-0 py-0">
                <v-btn fab color="success" class="mx-0 my-0 fill-button py-3" xs2>
                  +
                </v-btn>
              </v-flex>
              <v-flex md10 class="px-3 py-2">
                <v-textarea
                  label="Name"
                  v-model="body"
                  :rules="bodyRules"
                  :counter="260"
                  auto-grow
                  rows="1"
                  required
                ></v-textarea>
              </v-flex>
              <v-flex class="px-0 py-0" md1>
                <v-btn
                  color="success"
                  class="mx-0 my-0 fill-button py-3"
                  fab
                  @click="submit"
                  :disabled="!valid"
                >
                  send
                </v-btn>
              </v-flex>
            </v-layout>
          </v-form>

        </v-card>
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<style>
.chat-window {
  height: calc(100% - 85px);
}
.chat-window .fill-button {
  width: 100%;
  height: 100%;
  border-radius: 0;
  float: right;
}
.overflow-hidden {
  overflow: hidden;
}
</style>

<script>
  import { db, CurrentTime } from '@/db.js'

  export default {
    name: 'chatWindow',
    components: {
    },
    props: {
      // conversation: {
        // type: Object,
        // required: true,
        // default: () => {
        //   uri: 'kSTz4t772PxhWO2w41YW'
        // }
      // }
    },
    data: () => ({
      currentConversation: window.location.pathname.split('/').slice(-1)[0],
      valid: true,
      body: "",
      bodyRules: [
        v => !!v || "No text found.",
        v => v.length <= 260 || "Smaller question please!"
      ],
      messages: [],
      tempConvo: null,
    }),
    computed: {
      activeConversation () {
        return this.tempConvo
      },
      activeUser () {
        return this.$store.state["activeUser"]["uid"] || null
      },
      chatBuddy () {
        let activeUser = this.activeUser
        return this.activeConversation.members
          .filter( member => {
            return member.uri !== activeUser
          })
      },
      messagesList () {
        let messageList = this.messages ? this.messages : []
        return messageList.reverse()
      }
    },
    methods: {
      submit () {
        let messagePayload = {
          createdAt: CurrentTime,
          conversation: this.activeConversation.id,
          type: 'text',
          body: this.body,
          sender: this.activeUser
        }
        db.collection('messages')
          .add(messagePayload)
      }
    },
    firestore: {
      messages: db.collection('messages')
        .where('conversation', '==', 'g1J2uIc4qupUo8ATZ6UQ')
        .orderBy("createdAt")
        .limit(30),
      tempConvo: db.collection('conversations').doc('g1J2uIc4qupUo8ATZ6UQ')
    }
  }
</script>
