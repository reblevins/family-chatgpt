<template>
  <v-app-bar title="ChatGPT" :elevation="1">
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
              returnTo: 'http://localhost:5173'
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
import { useAuth0 } from '@auth0/auth0-vue';

const { loginWithRedirect, logout, isAuthenticated, isLoading } = useAuth0()
</script>

<style lang="scss" scoped>

</style>