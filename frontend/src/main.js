import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createAuth0 } from "@auth0/auth0-vue";
import authConfig from "../auth_config.json";

import App from './App.vue'
import router from './router'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
})

// Highlight.js
// import 'highlight.js/styles/atom-one-dark.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(createAuth0({
  domain: authConfig.domain,
  clientId: authConfig.clientId,
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: authConfig.audience,
  }
}))

app.mount('#app')
