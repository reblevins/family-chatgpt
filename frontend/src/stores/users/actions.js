import { useAuth0 } from '@auth0/auth0-vue';

// const { /*isAuthenticated, isLoading, user, loginWithRedirect, logout, */loginWithRedirect, getAccessTokenSilently } = useAuth0()

async function initAuth() {
  const { getAccessTokenSilently, loginWithRedirect } = useAuth0()
  this.loginWithRedirect = loginWithRedirect

  try {
    getAccessTokenSilently().then(async(token) => {
      this.accessToken = token
      this.auth0UserId = await this.user?.sub?.split('|')[1]
    }).catch((err) => {
      console.log(err)
      this.loginRequired = true
    })
  }
  catch (err) {
    console.log(err)
  }
}

async function loginWithRedirect() {
// const { loginWithRedirect } = useAuth0()
// console.log(useAuth0())
  this.loginWithRedirect()
}
  
export default {
  initAuth,
  // user,
  loginWithRedirect,
  // logout,
  // getAccessTokenSilently,
  // isAuthenticated,
  // isLoading,
}
