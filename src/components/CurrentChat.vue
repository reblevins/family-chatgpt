<template>
  <v-container class="h-screen overflow-hidden">
    <div class="container-inner d-flex flex-column">
      <v-card class="flex-grow-1n fill-height overflow-y-auto" :loading="isChatLoading">
        <v-list>
          <v-list-item
            v-for="(message, index) in chatsStore.currentChatMessages"
            :id="(index === chatsStore.currentChatMessages.length - 1) ? 'last-message' : null"
            ref="messageList"
            :key="index"
            class="justify-start align-start"
          >
            <template #prepend>
              <v-icon class="align-self-start" :icon="message.role === 'user' ? 'mdi-account' : 'mdi-robot'" />
            </template>
        
            <v-list-item-title v-if="message.role === 'user'">
              <v-card variant="tonal" color="indigo">
                <v-card-text v-if="message.text">
                  {{ message.text }}
                </v-card-text>
                <v-card-text v-else-if="message.url">
                  <v-img :src="message.url" />
                </v-card-text>
              </v-card>
            </v-list-item-title>
            <v-list-item-title v-else>
              <v-card variant="flat">
                <!-- eslint-disable-next-line vue/no-v-text-v-html-on-component -->
                <v-card-text v-html="message.text" />
              </v-card>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>
      <v-spacer />
      <div class="d-flex">
        <v-file-input
          ref="imageField"
          v-model="newImage"
          accept="image/*"
          label="Select an image..."
          class="v-col-1"
          outlined
          dense
          @change="saveImage"
        />
        <v-text-field
          v-model="newMessage.content"
          label="Type a message..."
          append-icon="mdi-send"
          variant="underlined"
          outlined
          dense
          :loading="isChatLoading"
          :disabled="isChatLoading"
          @click:append="sendMessage"
          @keyup.enter="sendMessage"
        />
      </div>
    </div>
  </v-container>
</template>

<script setup>
import { ref, toRefs, onMounted, watch } from 'vue'
import hljs from 'highlight.js'

import { useChatsStore } from '@/stores/chats'
import { useUsersStore } from '@/stores/users'

const chatsStore = useChatsStore()
const { chats, currentChatMessages, currentChat, isChatLoading } = toRefs(chatsStore)

const usersStore = useUsersStore()
const { user, isAuthenticated, isLoading, loginWithRedirect, logout, accessToken, auth0UserId } = toRefs(usersStore)

const newMessage = ref({
  content: '',
  image: null,
})
const newImage = ref(null)
const messageList = ref(null)
const imageField = ref(null)

// watch(currentChat, () => {
//   if (messageList.value) {
//     messageList.value[messageList.value.length - 1].$el.scrollIntoView()
//   }
// })

onMounted(() => {
  // messageList.value[messageList.value.length - 1].$el.scrollIntoView()
})

// watch(messageList, () => {
//   console.log(messageList.value)
//   const lastMessage = messageList.value[messageList.value.length - 1]
//   if (lastMessage) {
//     lastMessage.$el.scrollIntoView()
//   }
// })

watch(currentChatMessages, () => {
  console.log('currentChatMessages changed')
  hljs.highlightAll()
})

function saveImage() {
  const reader = new FileReader()
  reader.readAsDataURL(newImage.value[0])
  reader.onload = () => {
    newMessage.value.image = reader.result
    newMessage.value.role = 'user'
  }
}

async function sendMessage() {
  if (currentChat.value.id === null) {
    await chatsStore.createChat(newMessage.value)
  } else {
    await chatsStore.sendMessage(newMessage.value)
  }
  setTimeout(() => {
    newMessage.value = {
      content: '',
      image: null,
    }
    imageField.value.reset()
  }, 500)
}
</script>

<style lang="scss" scoped>
.container-inner {
  height: 96%
}
:deep(.v-list-item__prepend) {
  align-self: flex-start;
  margin-top: 16px;
}
:deep(.v-card-text) {
  white-space: pre-line;
}
:deep(pre) {
  margin-bottom: 1.25rem;
}
:deep(pre code.hljs) {
  padding-top: 0;
  border-radius: 6px;
}
:deep(.language-label) {
  padding: 1em 0 1em 1em;
  margin-bottom: 1em;
  margin-left: -1em;
  margin-right: -1em;
}
:deep(.v-file-input) {
  display: block;
  .v-input__control, .v-input__details {
    display: none;
  }
}
</style>