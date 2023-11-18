<template>
  <v-app>
    <NavBar />

    <NavDrawer />

    <v-main class="h-screen overflow-hidden">
      <CurrentChat />
    </v-main>

    <v-dialog
      v-model="loginRequired"
      width="auto"
      persistent
    >
      <v-card title="Login Required">
        <v-card-text>
          Your session has expired. Please login again.
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn @click="usersStore.loginWithRedirect">
            Login
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup>
import { onMounted, toRefs } from 'vue'
import { useUsersStore } from '@/stores/users'
import { useChatsStore } from '@/stores/chats'

import NavBar from '@/components/NavBar.vue'
import NavDrawer from '@/components/NavDrawer.vue'
import CurrentChat from '@/components/CurrentChat.vue'

const usersStore = useUsersStore()
const { accessToken, auth0UserId, loginRequired } = toRefs(usersStore)
const chatsStore = useChatsStore()

usersStore.$subscribe((mutation, state) => {
  if (mutation.events.key === 'auth0UserId' && auth0UserId.value) {
    chatsStore.fetchAllChats(auth0UserId.value, accessToken.value)
  }
})

onMounted(async() => {
  await usersStore.initAuth()
})
</script>

<style scoped>
</style>
