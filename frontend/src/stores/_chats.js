import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useChatsStore = defineStore('chats', () => {
  const chats = ([])
  const currentChat = ref({})
  
  function resetNewChat() {
    currentChat.value = {}
  }

  function setCurrentChat(index) {
    currentChat.value = chats.value[index]
  }

  async function fetchAllChats(userId, accessToken) {
    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
    const response = await axios.get(`http://127.0.0.1:5000/users/${userId}/chats`, config)
    console.log(response.data.chats)
    chats.value = response.data.chats
  }

  function sendMessage(message) {
    currentChat.value.messages.push({
      content: message,
      date: new Date().toISOString(),
      from: 'user',
    })
  }

  return { chats, currentChat, resetNewChat, setCurrentChat, fetchAllChats, sendMessage }
})
