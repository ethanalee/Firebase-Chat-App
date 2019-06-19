<template>
  <v-flex xs12 class="py-0 chat-window">
    <v-layout align-space-between justify-center row fill-height>
      <v-flex xs12>
        <v-card height="100%" class="scroll" id="chat-scroll">
          <v-card-title primary-title class="fixed-title">
            <div v-if="chatBuddy">
              <h3 class="headline mb-0">Chatting with
                <span v-if="!!chatBuddy.displayName">
                  {{ chatBuddy.displayName }}
                </span>
                <span v-else>
                  {{ chatBuddy.email }}
                </span>

              </h3>
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
                :class="{ spacer : message.type === 'image' }"
                :offset-xs6="message.sender === activeUser.uid"
                :text-xs-right="message.sender === activeUser.uid"
              >
                <v-avatar
                  size="32"
                  color="red"
                  :style="{
                    'float': message.sender !== activeUser.uid ? 'left' : 'right'
                  }"
                >
                  <!-- Buddy Avatar -->
                    <img
                      v-if="chatBuddy && chatBuddy.avatar && message.sender !== activeUser.uid"
                      :src="chatBuddy.avatar"
                    >
                    <span
                      v-if="!chatBuddy.avatar && message.sender !== activeUser.uid"
                      class="white--text"
                    >
                      {{chatBuddy.displayName[0] || chatBuddy.email[0] }}
                    </span>
                  <!-- Active User Avatar -->
                    <img
                      v-if="activeUser && activeUser.avatar && message.sender === activeUser.uid"
                      :src="activeUser.avatar"
                    >
                    <span
                      v-if="!activeUser.avatar && message.sender === activeUser.uid"
                      class="white--text"
                    >
                      {{activeUser.displayName[0] || activeUser.email[0] }}
                    </span>
                </v-avatar>
                <v-chip class="mb-3" label color="grey lighten-2" text-color="black" v-if="message.type === 'text'">
                  {{ message.body }}
                </v-chip>
                <v-img :aspect-ratio="16/9"
                position="right"
                max-height="300px"
                max-width="300px"
                contain :src="message.body"
                v-else-if="message.type === 'image'"
                alt="Image Unavailable">
                </v-img>
              </v-flex>
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
                <input
                  type="file"
                  style="display: none"
                  ref="imageDisplay"
                  id="imageDisplay"
                  accept="image/*"
                  @change="onFilePicked">
                <v-btn fab color="success" class="mx-0 my-0 fill-button py-3" xs2 @click="pickFile('imageDisplay')">
                  +
                </v-btn>
              </v-flex>
              <v-flex md10 class="px-3 py-2">

                <v-img :aspect-ratio="16/9"
                position="right"
                class="mx-0 px-0"
                max-height="300px"
                max-width="300px"
                contain
                :src="imageDisplay.url"
                v-if="imageDisplay.url"
                alt="Image Unavailable"></v-img>
                <v-textarea
                  v-else
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
.headline {
  position: fixed
}
.chat-window {
  height: calc(100% - 102px);
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
  max-height: 500px;
  overflow-y: scroll;
}

.spacer {
  margin-bottom: 150px
}

.overflow-chip .v-chip__content {
  overflow: hidden;
  text-overflow: ellipsis
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .25s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.reverse-order {
  flex-direction: column-reverse !important;
}
</style>

<script>
  import { db, CurrentTime, storage } from '@/db.js'

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
      valid: true,
      body: "",
      bodyRules: [
        v => !!v || "No text found.",
        v => v.length <= 260 || "Smaller question please!"
      ],
      imageDisplay: {
        name: '',
        url: '',
        file: ''
      },
      messages: [],
      convoRef: null,
    }),
    computed: {
      activeConversation () {
        return this.convoRef
      },
      activeUser () {
        return this.$store.state["activeUser"] || null
      },
      chatBuddy () {
        const userFallback = [{
          uid: '',
          displayName: '',
          email: ''
        }]
        let activeUser = this.activeUser.uid
        let members = this['activeConversation']
          ? this.activeConversation.members
          : userFallback
        let buddy = members
          .filter( member => {
            return member.uid !== activeUser.uid
          })
        return buddy[0]
      },
      messagesList () {
        let messages = this.messages
        return messages
      }
    },
    methods: {
      reset () {
        this.$refs.form.reset()
        this.imageDisplay = {
        name: '',
        url: '',
        file: ''
        }
      },
      pickFile (ref) {
        this.$refs[ref].click()
      },
      onFilePicked (e) {
        const target = e.path['0'].id
        const files = e.target.files
        if (files[0] !== undefined && files[0].type.match(/image.*/)) {
          this[target].name = files[0].name
          if (this[target].name.lastIndexOf('.') <= 0) {
            return
          }
          const fr = new FileReader()
          fr.readAsDataURL(files[0])
          fr.addEventListener('load', () => {
            this[target].url = fr.result
            this[target].file = files[0]
          })
        } else {
          this[target].name = ''
          this[target].file = ''
          this[target].url = ''
        }
      },
      sendFormImages (messagePayload) {
        let vm = this
        const now = Date.now()
        let fileExtension = vm.imageDisplay.name
          .split('.')
          .slice(-1)
          .pop()

        storage
          .images(`_chatImage${messagePayload.conversation}_${now}.${fileExtension}`)
          .put(vm.imageDisplay.file)
          .then(snapshot => snapshot.ref.getDownloadURL())
          .then(url => {
            messagePayload.body = url
            messagePayload.type = 'image'
            db.collection('messages')
              .add(messagePayload)
          })
          .catch((error) => {
            vm.statusText = error
          })
      },
      submit () {
        let vm = this
        let messagePayload = {
          createdAt: CurrentTime,
          conversation: this.activeConversation.id,
          type: 'text',
          body: this.body,
          sender: this.activeUser.uid
        }

        if (!vm.imageDisplay.name) {
          db.collection('messages')
          .add(messagePayload)
        } else if (vm.imageDisplay.name) {
          vm.sendFormImages(messagePayload)
        }

        this.reset()

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
    }
  }
</script>
