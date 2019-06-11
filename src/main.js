import Vue from 'vue'
import './plugins/vuetify'
import './plugins/vuetify'
import App from './App.vue'
import { firestorePlugin } from 'vuefire'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import router from './router'

Vue.config.productionTip = false

Vue.use(firestorePlugin)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
