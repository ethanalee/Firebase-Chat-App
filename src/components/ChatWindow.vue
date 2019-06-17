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
          <v-card-text>
            Display Messages Here
            <v-layout row wrap>
              <v-flex xs7 offset-xs12 offset-md2 offset-lg5>
                {{ currentConversation }}
              </v-flex>
            </v-layout>
          </v-card-text>
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
                  v-model="name"
                  :rules="nameRules"
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
  export default {
    name: 'Chat Window',
    components: {
    },
    data: () => ({
      currentConversation: window.location.pathname.split('/').slice(-1)[0],
      valid: true,
      name: "",
      nameRules: [
        v => !!v || "No text found.",
        v => v.length <= 260 || "Smaller question please!"
      ],
    })
  }
</script>
