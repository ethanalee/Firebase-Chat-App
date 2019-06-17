<template>
  <v-flex xs12 md8 class="py-0 chat-window">
    <v-layout align-space-between justify-center row fill-height>
      <v-flex xs12>
        <v-card height="100%" class="scroll" id="chat-scroll">
          <v-card-title primary-title class="fixed-title">
            <div>
              <h3 class="headline mb-0">Chat History {{conversation.uid}}</h3>
            </div>
          </v-card-title>
          <v-card-title>
            <transition-group
              tag="div"
              class="layout row wrap bottom reverse-order"
              name="fade"
            >
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

            </transition-group>
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
                  label="Message"
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
.scroll {
  overflow-y: scroll;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .25s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.reverse-order {
  flex-direction: column-reverse !important;
}
</style>

<script>
  import { db, CurrentTime } from '@/db.js'

  export default {
    name: 'chatWindow',
    components: {
    },
    props: {
      conversation: {
        type: Object,
        required: true,
      }
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
      convoRef: null,
    }),
    computed: {
      activeConversation () {
        return this.convoRef
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
        let messages = this.messages
        return messages
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
      },
      scrollToBottom () {
        this.$nextTick()
          .then(() => {
            const element = document.getElementById('chat-scroll')
            element.scrollTop = element.scrollHeight + 30
          })
      }
    },
    watch: {
      messagesList: function () {
        this.scrollToBottom()
      },
      conversation: {
        immediate: true,
        handler(conversation) {
          this.$bind(
            'convoRef',
            db.collection('conversations')
              .doc(conversation.uid)
          )

          this.$bind(
            'messages',
            db.collection('messages')
              .where('conversation', '==', conversation.uid)
              .orderBy('createdAt', 'desc')
              .limit(30)
          )
        }
      }
    },
    firestore: {
      // messages: db.collection('messages')
      //   .where('conversation', '==', 'g1J2uIc4qupUo8ATZ6UQ')
      //   .orderBy("createdAt", "desc")
      //   .limit(30)
    }
  }
</script>
