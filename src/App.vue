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
import { onMounted, toRefs, computed } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue';
import axios from 'axios';

import { useUsersStore } from '@/stores/users'
import { useChatsStore } from '@/stores/chats'

const { isAuthenticated, isLoading } = useAuth0()
import NavBar from '@/components/NavBar.vue'
import NavDrawer from '@/components/NavDrawer.vue'
import CurrentChat from '@/components/CurrentChat.vue'

const usersStore = useUsersStore()
const { accessToken, auth0UserId } = toRefs(usersStore)
const chatsStore = useChatsStore()

usersStore.$subscribe((mutation, state) => {
  if (state.accessToken && state.auth0UserId) {
    chatsStore.fetchAllChats(auth0UserId.value, accessToken.value)
  }
})

const loginRequired = computed(() => {
  return !isAuthenticated.value && !isLoading.value
})

onMounted(async() => {
  await usersStore.initAuth()

  axios.get('/')
    .then((response) => {
      console.log(response.data)
    })
    .catch((error) => {
      console.log(error)
    })
})
</script>

<style scoped>
</style>
