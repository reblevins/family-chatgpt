import { defineStore } from 'pinia'

import { getDefaultState } from './state'
import getters from './getters'
import actions from './actions'

export const useChatsStore = defineStore('chats', {
  state: getDefaultState,
  getters,
  actions: {
    ...actions,
  },
})
