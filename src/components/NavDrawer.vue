<template>
  <v-navigation-drawer>
    <v-list>
      <v-list-item link :active="currentChatIndex === null" @click="chatsStore.startNewChat">
        <v-icon icon="mdi-plus" /> New Chat
      </v-list-item>
      <v-list-item
        v-for="(chat, index) in chats"
        :key="chat"
        link
        :active="index === currentChatIndex"
        @click="handleClickChatLink(index)"
      >
        {{ chat.name }}
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { toRefs } from 'vue'

import { useChatsStore } from '@/stores/chats'

const chatsStore = useChatsStore()
const { chats, currentChatIndex } = toRefs(chatsStore)

function handleClickChatLink(index) {
  chatsStore.setCurrentChat(index)
}
</script>

<style lang="scss" scoped>

</style>