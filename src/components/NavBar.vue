<template>
  <v-app-bar title="ChatGPT" :elevation="1">
    <template v-slot:prepend>
      <v-app-bar-nav-icon size="x-large" variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    </template>

    <v-btn v-if="!isAuthenticated" @click="loginWithRedirect">
      Login
    </v-btn>

    <v-menu v-else>
      <template #activator="{ props }">
        <v-btn icon="mdi-account" v-bind="props" />
      </template>

      <v-list>
        <v-list-item v-if="isAuthenticated">
          <v-list-item-title>{{ user.nickname }}</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="!isAuthenticated && !isLoading" text link @click="loginWithRedirect">
          <v-list-item-title>Log in</v-list-item-title>
        </v-list-item>
        <v-list-item
          v-if="isAuthenticated"
          text
          link
          @click="logout({
            logoutParams: {
              returnTo: returnTo,
            }
          })"
        >
          <v-list-item-title>Log out</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script setup>
import { computed, toRefs } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue';

import { useUsersStore } from '@/stores/users'

const usersStore = useUsersStore()
const { user } = toRefs(usersStore)

const props = defineProps({
  drawer: Boolean,
})

const emit = defineEmits(['update:drawer'])

const { loginWithRedirect, logout, isAuthenticated, isLoading } = useAuth0()

console.log(document.location.origin)

const drawer = computed({
  get() {
    return props.drawer
  },
  set(value) {
    console.log('drawer', value)
    emit('update:drawer', value)
  },
})

const returnTo = computed(() => {
  return document.location.origin
})
</script>

<style lang="scss" scoped>

</style>