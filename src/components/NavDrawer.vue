<template>
  <v-navigation-drawer v-model="drawer">
    <v-list>
      <v-list-item link nav :active="currentChatIndex === null" @click="startNewChat">
        <v-icon icon="mdi-plus" /> New Chat
      </v-list-item>
      <v-list-item
        v-for="(chat, index) in chats"
        :key="chat"
        link
        nav
        :active="index === currentChatIndex"
        @click="handleClickChatLink(index)"
      >
        {{ chat.name }}
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { defineProps, defineEmits, computed, toRefs } from 'vue'
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()
import { useChatsStore } from '@/stores/chats'

const props = defineProps({
  drawer: Boolean,
})

const emit = defineEmits(['update:drawer'])

const chatsStore = useChatsStore()
const { chats, currentChatIndex } = toRefs(chatsStore)

const drawer = computed({
  get() {
    return props.drawer
  },
  set(value) {
    console.log('drawer', value)
    emit('update:drawer', value)
  },
})

function startNewChat() {
  drawer.value = !mobile.value
  chatsStore.startNewChat()
}

function handleClickChatLink(index) {
  drawer.value = !mobile.value
  chatsStore.setCurrentChat(index)
}
</script>

<style lang="scss" scoped>

</style>