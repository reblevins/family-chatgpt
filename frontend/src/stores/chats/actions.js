import { computed } from 'vue'
import axios from 'axios'

import { useUsersStore } from '@/stores/users'

function startNewChat() {
  this.currentChat = {
    id: null,
    user_id: null,
    messages: [],
    name: 'New Chat',
    created_at: null,
    updated_at: null,
  }
  this.currentChatIndex = null
}

function setCurrentChat(index) {
  this.currentChatIndex = index
  this.currentChat = this.chats[index]
}

async function fetchAllChats(userId, accessToken) {
  this.isChatloading = true
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` },
  }
  const response = await axios.get(`/api/users/${userId}/chats`, config)
  this.chats = response.data.chats
  if (this.chats.length > 0) {
    this.currentChatIndex = 0
    this.currentChat = this.chats[0]
  }
  this.isChatloading = false
}

async function createFormData(newMessage) {
  const usersStore = useUsersStore()
  const { accessToken } = usersStore

  // Create FormData
  const formData = new FormData()
  formData.append('content', newMessage.content)

  // Check if there's an image and append it
  if (newMessage.image) {
    formData.append('image', newMessage.image)
  }
  console.log('formData', formData)

  const config = {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'multipart/form-data' // Important for file upload
    },
  }
  return { formData, config }
}

async function createChat(newMessage) {
  this.isChatloading = true
  const usersStore = useUsersStore()
  const { auth0UserId } = usersStore

  const { formData, config } = await createFormData(newMessage)

  this.currentChat.messages.push({ role: 'user', content: newMessage })

  const response = await axios.put(
    `/api/users/${auth0UserId}/chats`,
    formData,
    config
  )

  this.currentChat = response.data.chat
  this.chats.push(this.currentChat)
  this.currentChatIndex = this.chats.length - 1
}

async function sendMessage(newMessage) {
  this.isChatloading = true
  const { formData, config } = await createFormData(newMessage)

  const response = await axios.post(
    `/api/chats/${this.currentChat.id}/messages`,
    formData,
    config
  )

  this.currentChat = response.data.chat
  this.chats[this.currentChatIndex] = this.currentChat
  this.isChatloading = false
}

export default {
  startNewChat,
  setCurrentChat,
  fetchAllChats,
  createChat,
  sendMessage,
}