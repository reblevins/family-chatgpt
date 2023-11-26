export const getDefaultState = () => {
  return {
    chats: [],
    currentChat: {
      id: null,
      user_id: null,
      messages: [],
      name: 'New Chat',
      created_at: null,
      updated_at: null,
    },
    currentChatIndex: null,
    loginWithRedirect: null,
    isChatloading: false,
  }
}