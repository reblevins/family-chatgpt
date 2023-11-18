import { defineStore } from 'pinia'

import { getDefaultState } from './state'
import actions from './actions'

export const useUsersStore = defineStore('users', {
  state: getDefaultState,
  actions: {
    ...actions,
  }
})