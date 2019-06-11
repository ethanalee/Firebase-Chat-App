<template>
  <v-app>
    <navBar/>
    <v-content>

    </v-content>
  </v-app>
</template>

<script>
import navBar from './components/NavBar'

export default {
  name: 'App',
  components: {
    navBar
  },
  data () {
    return {
      //
    }
  }
}
</script>
