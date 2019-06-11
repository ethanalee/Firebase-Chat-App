<template>
  <v-toolbar
    color="primary"
    dark
    scroll-off-screen
    scroll-target="#scrolling-techniques"
  >
    <v-toolbar-side-icon></v-toolbar-side-icon>
    <v-toolbar-title>Title</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon>
        <v-icon>search</v-icon>
    </v-btn>
    <v-btn icon>
        <v-icon>favorite</v-icon>
    </v-btn>
    <v-btn icon>
        <v-icon>more_vert</v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script>
export default {
  name: 'navBar'
}
</script>