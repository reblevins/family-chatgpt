import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useAuth0 } from '@auth0/auth0-vue';

export const useUserStore = defineStore('user', () => {
  const { isAuthenticated, isLoading, user, loginWithRedirect, logout, getAccessTokenSilently } = useAuth0()
  const accessToken = ref('')
  const auth0UserId = ref('')

  getAccessTokenSilently().then(async(token) => {
    accessToken.value = token
    auth0UserId.value = await user?.value.sub?.split('|')[1]
    console.log(auth0UserId.value)
  })
  
  return { user, loginWithRedirect, logout, accessToken, getAccessTokenSilently, isAuthenticated, isLoading, auth0UserId }
})
